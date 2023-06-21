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
  
  app.post('/videojuegos', (req, res) => {
    const { search, page, limit } = req.body;
    const offset = (page - 1) * limit;
    const connection = mysql.createConnection(dbConfig);
  
    connection.connect((err) => {
      if (err) {
        console.error('Error al conectar con MySQL: ', err);
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
        return;
      }
  
      const query = `
      SELECT *, (@row_number:=@row_number + 1) AS posicion
      FROM videojuegos, (SELECT @row_number:=0) AS t
      WHERE (nombre LIKE '%${search}%'
            OR categoria LIKE '%${search}%'
            OR dificultad LIKE '%${search}%'
            OR anio_lanzamiento LIKE '%${search}%'
            OR precio LIKE '%${search}%')
      ORDER BY id
      LIMIT ${offset}, ${limit};
      `;
      connection.query(query, (error, results) => {
        if (error) {
          connection.end();
          console.error('Error al realizar la consulta: ', error);
          res.status(500).json({ error: 'Error al realizar la consulta' });
          return;
        }
  
        const queryCount = `
          SELECT COUNT(*) AS totalItems FROM videojuegos
          WHERE (nombre LIKE '%${search}%'
          OR categoria LIKE '%${search}%'
          OR dificultad LIKE '%${search}%'
          OR anio_lanzamiento LIKE '%${search}%'
          OR precio LIKE '%${search}%')
        `;
        connection.query(queryCount, (errorCount, resultsCount) => {
          if (errorCount) {
            connection.end();
            console.error('Error al realizar la consulta: ', errorCount);
            res.status(500).json({ error: 'Error al realizar la consulta' });
            return;
          }
  
          connection.end();
          res.json({
            videojuegos: results,
            totalItems: resultsCount[0].totalItems,
          });
        }
        );
  
      });
    });
  });
  
  app.get('/videojuego/:id', (req, res) => {
    const { id } = req.params;
    const connection = mysql.createConnection(dbConfig);
  
    connection.connect((err) => {
      if (err) {
        console.error('Error al conectar con MySQL: ', err);
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
        return;
      }
  
      const query = `
        SELECT * FROM videojuegos
        WHERE id = ${id}
      `;
      connection.query(query, (error, results) => {
        if (error) {
          connection.end();
          console.error('Error al realizar la consulta: ', error);
          res.status(500).json({ error: 'Error al realizar la consulta' });
          return;
        }
  
        connection.end();
        res.json({
          videojuegos: results[0],
        });
      });
    });
  });
  
  
  app.post('/guardar-videojuego', (req, res) =>{
    const { id, nombre, categoria, dificultad, anio_lanzamiento, precio } = req.body;
    const connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
      if (err) {
        console.error('Error al conectar con MySQL: ', err);
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
        return;
      }
      if(id == '' || id == 'undefined' || id == null || id == undefined){
        const query = `
          INSERT INTO videojuegos (nombre, categoria, dificultad, anio_lanzamiento, precio)
          VALUES ('${nombre}', '${categoria}', '${dificultad}', '${anio_lanzamiento}', '${precio}')
        `;
        connection.query(query, (error, results) => {
          if (error) {
            connection.end();
            console.error('Error al realizar la consulta: ', error);
            res.status(500).json({ error: 'Error al realizar la consulta' });
            return;
          }
          connection.end();
          res.json({
            videojuegos: results,
          });
        });
      }else{
        const query = `
          UPDATE videojuegos
          SET nombre = '${nombre}', categoria = '${categoria}', dificultad = '${dificultad}', anio_lanzamiento = '${anio_lanzamiento}', precio = '${precio}'
          WHERE id = '${id}'
        `;
        connection.query(query, (error, results) => {
          if (error) {
            connection.end();
            console.error('Error al realizar la consulta: ', error);
            res.status(500).json({ error: 'Error al realizar la consulta' });
            return;
          }
          connection.end();
          res.json({
            videojuegos: results,
          });
        });
      }
    });
  });
  
  


app.listen(8000, () => {
    console.log('Servidor escuchando en el puerto 8000');
  });