import React, { useState } from 'react';

function CrearDb() {
    const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleClick = () => {
    setCargando(true);
    fetch('http://localhost:8000/generar-datos', { method: 'POST' })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMensaje('Se han cargado todos los datos correctamente.');
      })
      .catch((error) => {
        console.error('Error al llamar a la API:', error);
        setMensaje('Error al cargar los datos.');
      })
      .finally(() => {
        setCargando(false);
      });
  };

  return (
    <div className="container mt-3 text-center">
      <button onClick={handleClick} className="btn btn-primary">
        Generar Datos
      </button>
      <br></br>
      {cargando && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}


export default CrearDb;
