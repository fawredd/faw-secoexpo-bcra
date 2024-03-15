const fs = require('fs');
const {tabletojson} = require ('tabletojson');
const json2xls = require ('json2xls');
require('dotenv').config();
const cuit = process.env.cuit;
const fechaInicio = encodeURIComponent(process.env.fechai);
const fechaFin = encodeURIComponent(process.env.fechaf);
const URL = `https://www.bcra.gob.ar/BCRAyVos/exportaciones-bcra-certificados-cumplidos-secoexpo.asp?cuit=${cuit}&desde=${fechaInicio}&hasta=${fechaFin}&Tipo_Respuesta=1&B1=Enviar`;

(async () => {
  try {
    console.log("START")
    console.time("measure");
    
    const newData = await tabletojson.convertUrl(URL,(tables)=>{
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
      console.log("Datos BCRA vacios.")
      console.timeEnd("measure")
      return false;
    }
    // Read the file synchronously
    const filePreviousData = await readFileOrCreateFile('previousData.json');

    if (filePreviousData){
      // Parse the JSON data
      const previousData = JSON.parse(filePreviousData);
      //Compare previous and new data.
      if (newData.length > previousData.length){
        let countNewElements = newData.length - previousData.length;
        for (let j=0;j<countNewElements;j++){
          console.log("NEW: " + JSON.stringify(newData[j]));
          previousData.unshift(newData[j]);
        }
        console.log("Saving new data.");
        await fs.promises.writeFile("previousData.json", JSON.stringify(previousData), (e)=>console.log("Error writing new data.\n" + e))  
      } else {
      console.log("Los datos se encuentran actualizados.")
      }

      let xls = json2xls(previousData);
      fs.promises.writeFile('BCRA_Secoexpo.xlsx', xls, 'binary');

    } else if (newData) {
      console.log("No previous data. Saving new data.");
      await fs.promises.writeFile("previousData.json", JSON.stringify(newData), (e)=>console.log("Error writing new data.\n" + e))
    } else {
      console.log("No new nor previous data loaded. End.");
    }
    
    console.log("END");
    console.timeEnd("measure");
  }
  catch(e) {
    console.log (e);
  }
})();

async function readFileOrCreateFile(filePath) {
  try {
    // Check if the file exists
    const content = await fs.promises.readFile(filePath, 'utf-8', (e) => console.log("Error reading previousData.json.\n" + e));
    return content;
  } catch (error) { 
    // If the file doesn't exist, create it
    fs.writeFile(filePath, '');
    return null;
  }
}