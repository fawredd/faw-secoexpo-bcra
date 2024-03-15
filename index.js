const express = require('express');
const {tabletojson} = require ('tabletojson');
const json2xls = require ('json2xls');
const app = express();

async function readSecoexpo (back,queryURL) {
  try {
    const newData = await tabletojson.convertUrl(queryURL,(tables)=>{
      return tables[0].map(
        (element) => {
            const primerObjeto = element;
            const keys = Object.keys(primerObjeto)
            const primeraPropiedad = keys[0];
            primerObjeto['Destinacion'] = primerObjeto[primeraPropiedad];
            delete primerObjeto[primeraPropiedad];
            return primerObjeto;
        }
      );
    });
    if(!newData){
      return null;
    }
    
    //Convert data to xls
    let xls = json2xls(newData);
    
    switch (back.toLowerCase().trim()){
      case 'json':
        return newData;
      case 'xls':
        return xls;
      default:
        return null;
    }
  }
  catch(e) {
    console.log (e);
  }
}

async function mainController(req,res){
  const back = req.query.back;
  
  // Inicializo los paramentros para la URL
  let cuit = req.query.cuit;
  let fechaInicio = decodeURIComponent(req.query.fechai);
  let fechaFin = decodeURIComponent(req.query.fechaf);
  // el cuit
  if (!(cuit && cuit.match(/\d{11}/g))){
      res.status(500).json('[{"error":"Specify cuit ?cuit=00000000000}]');
      return;
  }
  // la fecha de inicio
  if (!(fechaInicio && fechaInicio.match(/\d\d[-]\d\d[-]\d{4}/))) {
    res.status(500).json('[{"error":"Specify fechai ?fechai=01-01-2023}]');
    return;
  }
  fechaInicio = encodeURIComponent(fechaInicio);
  // la fecha de finalizacion
  if (!(fechaFin && fechaFin.match(/\d\d[-]\d\d[-]\d{4}/))) {
    res.status(500).json('[{"error":"Specify fechaf ?fechaf=01-01-2023}]');
    return;
  }
  fechaFin = encodeURIComponent(fechaFin);
  const queryURL = `https://www.bcra.gob.ar/BCRAyVos/exportaciones-bcra-certificados-cumplidos-secoexpo.asp?cuit=${cuit}&desde=${fechaInicio}&hasta=${fechaFin}&Tipo_Respuesta=1&B1=Enviar`;
  // ---- fin confeccion URL -----

  if (!back || (back != 'json' && back != 'xls') ){
    res.status(500).json('[{"error":"Specify return type as ?back=json or ?back=xls"}]');
    return;
  }

  const data = await readSecoexpo(back,queryURL);
  if (data){
    switch (back){
      case 'json':
        res.status(200).json(data);
        break;
      case 'xls':
        // Establece las cabeceras adecuadas para indicar que se trata de una descarga de archivo
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=BCRA_Secoexpo.xlsx');
        // Envía los datos binarios al navegador
          // Envía los datos XLS al navegador
        res.write(data, 'binary');
        res.end();
        break;
      default:
        res.status(500).json([{"error":"No arguments received."}]);
    }
  } else {
    res.status(500).json([{"error":"No data returned."}]);
  }

}

console.log("START")
console.time("measure");
  
  app.get("/", mainController);
  app.listen(process.env.PORT || 3000, () => console.log(`Server running at http://localhost:3000`));

console.log("END");
console.timeEnd("measure");