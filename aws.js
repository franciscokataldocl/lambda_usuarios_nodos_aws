const fs = require("fs");
const AWS = require("aws-sdk");
const { generateLog, logType } = require('../utils/generateLog');

if(!process.env.LMS_AWS_ACCESS_KEY_ID){
  generateLog(logType.WARN, 'process.env.LMS_AWS_ACCESS_KEY_ID no existe', 'aws.js');
}
if(!process.env.LMS_AWS_SECRET_ACCESS_KEY){
  generateLog(logType.WARN, 'process.env.LMS_AWS_SECRET_ACCESS_KEY no existe', 'aws.js');
}
if(!process.env.NOMBRE_BUCKET){
  generateLog(logType.WARN, 'NOMBRE_BUCKET no existe', 'aws.js');
}


const s3 = new AWS.S3({
  accessKeyId: process.env.LMS_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.LMS_AWS_SECRET_ACCESS_KEY,
});

const uploadFile = (fileName, config) => {
  fs.readFile(fileName, "utf8", (err, data) => {
    if (err) {
      generateLog(logType.ERROR, 'Error al leer archivo', 'aws.js', err);
      throw err;
    } 
    const params = {
      Bucket: process.env.NOMBRE_BUCKET, // pass your bucket name
      Key: fileName.replace(config.path, ""), // file will be saved as testBucket/contacts.csv
      Body: data,
    };
    s3.upload(params, function (s3Err, data) {

      if (s3Err) {
        generateLog(logType.WARN, 'Error en la subida de archivo', 'aws.js');
        throw s3Err;
      }
      generateLog(logType.INFO, `Archivo subido correctamente a AWS S3 : ${data.Location}`);
      console.log(`File uploaded successfully at ${data.Location}`);
    });
  });
};


const uploadLogs = (fileName) => {
  let fechaActual = new Date();
  let fecha = fechaActual.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
  }).replace(/\//g, '-').replace(/, /g, '-');
    fileName.map(file =>{
      fs.readFile(file, "utf8", (err, data) => {
        if (err) {
          generateLog(logType.ERROR, 'Error al leer archivo', 'aws.js', err);
          throw err;
        } 
        let nombreArchivo = file.split('/').pop();
        let fileRouteName = 'log/' + nombreArchivo.replace('.log', '') + '__'  +  fecha + '.log';
        const params = {
          Bucket: process.env.NOMBRE_BUCKET, // pass your bucket name
          Key: fileRouteName, // file will be saved as testBucket/contacts.csv
          Body: data,
        };
        s3.upload(params, function (s3Err, data) {
    
          if (s3Err) {
            generateLog(logType.WARN, `Error en la subida de archivo ${file.split('/').pop()}`, 'aws.js');
            throw s3Err;
          }
          generateLog(logType.INFO, `Archivo ${file.split('/').pop()} subido correctamente a AWS S3 : ${data.Location}`);
          console.log(`File uploaded successfully at ${data.Location}`);
        });
      });
    })
  };
  module.exports = { uploadFile, uploadLogs };
