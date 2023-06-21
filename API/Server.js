const express = require('express');
const mysql = require('mysql');
const generarDatos = require('./ScriptGenerador');

const app = express();
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  port: 3308,
  user: 'James',
  password: 'erp94128',
  database: 'gamestation',
};
 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/generar-datos', (req, res) => {
    const connection = mysql.createConnection(dbConfig);
  
    connection.connect((err) => {
      if (err) {
        console.error('Error al conectar con MySQL: ', err);
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
        return;
      }
  
      generarDatos(connection)
        .then(() => {
          connection.end();
          res.json({ message: 'Datos generados correctamente' });
        })
        .catch((error) => {
          connection.end();
          console.error('Error al generar los datos: ', error);
          res.status(500).json({ error: 'Error al generar los datos' });
        });
    });
  });
  
  
app.listen(8000, () => {
    console.log('Servidor escuchando en el puerto 8000');
  });