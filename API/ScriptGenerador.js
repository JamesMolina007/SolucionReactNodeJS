function generarDatos(connection) {
    return new Promise((resolve, reject) => {
      const tabla = "videojuegos";
  
      const consultaVerificarTabla = `SHOW TABLES LIKE '${tabla}'`;
      connection.query(consultaVerificarTabla, (err, result) => {
        if (err) {
          console.error("Error al verificar la existencia de la tabla: ", err);
          reject(err);
          return;
        }
  
        if (result.length > 0) {
          const consultaVaciarTabla = `TRUNCATE TABLE ${tabla}`;
          connection.query(consultaVaciarTabla, (err) => {
            if (err) {
              console.error("Error al vaciar la tabla: ", err);
              reject(err);
            } else { 
              console.log(`La tabla '${tabla}' ha sido vaciada correctamente.`);
              generarInsertarRegistros();
            } 
          });
        } else {
          const consultaCrearTabla = `
            CREATE TABLE ${tabla} (
              id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              nombre VARCHAR(50),
              categoria VARCHAR(50),
              dificultad VARCHAR(20),
              anio_lanzamiento INT(4),
              precio DECIMAL(8,2)
            )
          `;
          connection.query(consultaCrearTabla, (err) => {
            if (err) {
              console.error("Error al crear la tabla: ", err);
              reject(err);
            } else {
              console.log(`La tabla '${tabla}' ha sido creada correctamente.`);
              generarInsertarRegistros();
            }
          });
        }
      });
  
      function generarInsertarRegistros() {
        const registros = 300000;
        const lotes = Math.ceil(registros / 10000);
        const registrosPorLote = 10000;
        const categorias = ["Accion", "Aventura", "Estrategia", "Deportes", "RPG", "Disparos", "Rol", "Simulacion", "Otros"];
        const dificultades = ["Facil", "Normal", "Dificil", "Extremo"];
        const preciosMin = 10;
        const preciosMax = 100;
  
        let registrosInsertados = 0;
  
        for (let loteActual = 1; loteActual <= lotes; loteActual++) {
          const records = [];
  
          for (let i = 0; i < registrosPorLote && registrosInsertados < registros; i++) {
            const nombre = `Videojuego ${registrosInsertados + 1}`;
            const categoria = categorias[Math.floor(Math.random() * categorias.length)];
            const dificultad = dificultades[Math.floor(Math.random() * dificultades.length)];
            const anioLanzamiento = Math.floor(Math.random() * (2023 - 1980 + 1)) + 1980;
            const precio = ((Math.floor(Math.random() * ((preciosMax - preciosMin) * 100))) / 100 + preciosMin).toFixed(2);
            records.push([nombre, categoria, dificultad, anioLanzamiento, precio]);
            registrosInsertados++;
          }
  
          const consultaInsertarRegistros = `INSERT INTO ${tabla} (nombre, categoria, dificultad, anio_lanzamiento, precio) VALUES ?`;
  
          connection.query(consultaInsertarRegistros, [records], (err, result) => {
            if (err) {
              console.error("Error al insertar registros en el lote", loteActual, ":", err);
              reject(err);
            } else {
              console.log(`Se han insertado ${result.affectedRows} registros en el lote ${loteActual}.`);
              if (loteActual === lotes) {
                console.log(`Se han insertado todos los registros en la tabla.`);
                resolve();
              }
            }
          });
        }
      }
    });
  }

  module.exports = generarDatos;
  