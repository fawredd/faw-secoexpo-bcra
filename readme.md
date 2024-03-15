BACKEND
BCRA - SEGUIMIENTO DE CUMPLIDOS DE EMBARQUE (SECOEXPO)
Los exportadores pueden consultar los permisos de embarques cumplidos
A partir del 18/06/2020, los exportadores pueden consultar en la página web del Banco Central de la República Argentina (BCRA), los cumplidos de embarque informados por las entidades financieras.
Para el exportador es de suma importancia esta práctica; el control le permite verificar el cumplimiento de su obligación de orden cambiario para todas sus operaciones de exportación.
Esta APP que sirve para hacer una consulta a BCRA ( bcra.gob.ar ) SECOEXPO sobre el estado
de presentacion de las destinaciones.
Con dicha informacion se crea un archivo JSON y un xls con los datos obtenidos.
Utilizando app de forma local, utilizo los datos por diferencia por si en el futuro quiero realizar mas acciones sobre los mismos.

Puede hacer consultas a la API con el siguiente link modificando los datos de la quey:
https://faw-secoexpo-bcra.vercel.app/?back=json&cuit=00000000000&fechai=01-01-2019&fechaf=31-12-2024

1) Para utilizar la API localmente:
npm i
node index.js
acceder en tu browser a:
http://localhost:3000/?back=json&cuit=00000000000&fechai=01-01-2019&fechaf=31-12-2024

2)Para utilizar esta app:
ejecutar: npm i

crear un archivo .env con los siguientes datos:
cuit = "00000000000"
fechai = "dd/mm/aaaa"
fechaf = "dd/mm/aaaa"

ejecutar con: node index.js

