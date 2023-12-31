import React, { useEffect, useState } from "react";

function App() {
  //USE STATES Y VARIABLES
  const itemPorPagina = 10;
  const API_URL = "http://localhost:8000";
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginasTotales, setPaginasTotales] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [videojuegos, setVideojuegos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errores, setErrores] = useState({});
  const [eliminarVarios, setEliminarVarios] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  //ATRIBUTOS DEL VIDEOJUEGO
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Accion");
  const [dificultad, setDificultad] = useState("Facil");
  const [anio_lanzamiento, setAnio_lanzamiento] = useState("");
  const [precio, setPrecio] = useState("");
  

  //////////////////////USE EFFECTS
  useEffect(() => {
    obtenerVideojuegos();
  }, []);

  useEffect(() => {
    obtenerVideojuegos();
  }, [search]);

  useEffect(() => {
    obtenerVideojuegos();
  }, [paginaActual]);
  //////////////////////FIN DE USE EFFECTS

  //////////////////////FUNCIONES
  function handlePageChange(page) {
    setPaginaActual(page);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };
  //////////////////////FIN DE FUNCIONES

  ///////////////////LISTAR VIDEOJUEGOS
  function obtenerVideojuegos() {
    fetch(API_URL + "/videojuegos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search,
        page: paginaActual,
        limit: itemPorPagina,
      }),
      
    })
      .then((res) => res.json())
      .then((data) => {
        
        setVideojuegos(data.videojuegos);
        setPaginasTotales(Math.ceil(data.totalItems / itemPorPagina));
        setLoading(false);
        console.log(data.totalItems);
      })
      .catch((error) => console.error("Error:", error));
  }
  /////////////////FIN DE LISTAR VIDEOJUEGOS 

  ///////////////////GUARDAR VIDEOJUEGO
  function guardarVideojuego(){    
    const nuevosErrores = {};
    if (!nombre) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!anio_lanzamiento) nuevosErrores.anio_lanzamiento = "El año de lanzamiento es obligatorio";
    if (!precio) nuevosErrores.precio = "El precio es obligatorio";
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    fetch(API_URL + "/guardar-videojuego", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        nombre,
        categoria,
        dificultad,
        anio_lanzamiento,
        precio,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        obtenerVideojuegos();
        setId("");
        setNombre("");
        setCategoria("Accion");
        setDificultad("Facil");
        setAnio_lanzamiento("");
        setPrecio("");
        handleCloseModal();
        
      })
      .catch((error) => console.error("Error:", error));
  }
  ///////////////////FIN DE GUARDAR VIDEOJUEGO

  ///////////////////EDITAR VIDEOJUEGO
  function handleEditar(id) {
    fetch(API_URL + "/videojuego/" + id)
      .then((res) => res.json())
      .then((data) => {
        setId(data.videojuegos.id);
        setNombre(data.videojuegos.nombre);
        setCategoria(data.videojuegos.categoria);
        setDificultad(data.videojuegos.dificultad);
        setAnio_lanzamiento(data.videojuegos.anio_lanzamiento);
        setPrecio(data.videojuegos.precio);
        setErrores({});
        handleOpenModal();
      })
      .catch((error) => console.error("Error:", error));
  }
  ///////////////////FIN DE EDITAR VIDEOJUEGO

  ///////////////////ELIMINAR VIDEOJUEGO
  //////////////SELECCIONAR TODOS LOS VIDEOJUEGOS
  function handleCheckAll(e) {
    const checked = e.target.checked;
    setCheckAll(checked);
    const nuevosVideojuegos = videojuegos.map((videojuego) => {
      videojuego.checked = checked;
      return videojuego;
    });
    setVideojuegos(nuevosVideojuegos);
    setEliminarVarios(checked);
  }
  //////////////FIN DE SELECCIONAR TODOS LOS VIDEOJUEGOS

  //////////////SELECCIONAR UN VIDEOJUEGO
  function handleCheck(e) {
    const checked = e.target.checked;
    const id = e.target.value;
    const nuevosVideojuegos = videojuegos.map((videojuego) => {
      if (videojuego.id == id) {
        return { ...videojuego, checked: checked };
      }
      return videojuego;
    });
    setVideojuegos(nuevosVideojuegos);
    const seleccionados = nuevosVideojuegos.filter((videojuego) => videojuego.checked);
    setEliminarVarios(seleccionados.length > 0);
  }
  //////////////FIN DE SELECCIONAR UN VIDEOJUEGO
  
  //////////////ELIMINAR UN VIDEOJUEGO
  function handleEliminar(id) {
    const confirmar = window.confirm("¿Está seguro de eliminar el registro?");
    if (!confirmar) {
      return;
    }
    fetch(API_URL + "/eliminar-videojuego", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        obtenerVideojuegos();
      }
      )
      .catch((error) => console.error("Error:", error));
  }
  //////////////FIN DE ELIMINAR UN VIDEOJUEGO

  //////////////ELIMINAR VARIOS VIDEOJUEGOS
  function handleEliminarVarios() {
    const confirmar = window.confirm("¿Está seguro de eliminar los registros?");
    if (!confirmar) {
      return;
    }
    const ids = videojuegos.filter((videojuego) => videojuego.checked).map((videojuego) => videojuego.id);
    fetch(API_URL + "/eliminar-varios-videojuegos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        obtenerVideojuegos();
        setEliminarVarios(false);
        setCheckAll(false);
      })
      .catch((error) => console.error("Error:", error));
  }
  //////////////FIN DE ELIMINAR VARIOS VIDEOJUEGOS
  ///////////////////FIN DE ELIMINAR VIDEOJUEGO

  ///////////////////PAGINACION
  function actualizarPaginacion(totalPaginas, paginaActual) {
    const paginacion = [];
    if (paginaActual > 1) {
      paginacion.push(
        <li key="anterior" className="page-item">
          <a className="page-link" onClick={() => handlePageChange(paginaActual - 1)} href="#">&lt;</a>
        </li>
      );
    } else {
      paginacion.push(
        <li key="anterior" className="page-item disabled">
          <a className="page-link" href="#">&lt;</a>
        </li>
      );
    }

    paginacion.push(
      <li key="primero" className={`page-item ${paginaActual === 1 ? 'active' : ''}`}>
        <a className="page-link" onClick={() => handlePageChange(1)} href="#">1</a>
      </li>
    );

    const maximo = Math.min(totalPaginas, 5);
    const inicio = Math.max(2, paginaActual - 2);
    const fin = Math.min(inicio + maximo - 1, totalPaginas - 1);

    if (inicio > 2) {
      paginacion.push(
        <li key="inicio-ellipsis" className="page-item disabled">
          <a className="page-link" href="#">...</a>
        </li>
      );
    }

    for (let i = inicio; i <= fin; i++) {
      paginacion.push(
        <li key={i} className={`page-item ${paginaActual === i ? 'active' : ''}`}>
          <a className="page-link" onClick={() => handlePageChange(i)} href="#">{i}</a>
        </li>
      );
    }

    if (fin < totalPaginas - 1) {
      paginacion.push(
        <li key="fin-ellipsis" className="page-item disabled">
          <a className="page-link" href="#">...</a>
        </li>
      );
    }

    paginacion.push(
      <li key="ultimo" className={`page-item ${paginaActual === totalPaginas ? 'active' : ''}`}>
        <a className="page-link" onClick={() => handlePageChange(totalPaginas)} href="#">{totalPaginas}</a>
      </li>
    );

    if (paginaActual < totalPaginas) {
      paginacion.push(
        <li key="siguiente" className="page-item">
          <a className="page-link" onClick={() => handlePageChange(paginaActual + 1)} href="#">&gt;</a>
        </li>
      );
    } else {
      paginacion.push(
        <li key="siguiente" className="page-item disabled">
          <a className="page-link" href="#">&gt;</a>
        </li>
      );
    }
    return paginacion;
  }
  ///////////////////FIN DE PAGINACION

  return (
    <div class="container">
      <h1 class="mt-4 mb-4 text-center">Videojuegos de GameStation</h1>
      <div class="row mb-4">
        <div class="col-12 col-md-6">
        <button id="btn-agregar" className="btn btn-primary" onClick={handleOpenModal}>
            <i class="fas fa-plus"></i> Agregar
          </button>
          <button id="btn-eliminar" className="btn btn-danger" disabled={!eliminarVarios} onClick={handleEliminarVarios}>
            <i class="fas fa-trash"></i> Eliminar 
          </button>
        </div>
        <div class="col-12 col-md-6">
          <div class="input-group">
            <input
              id="busqueda"
              type="text"
              class="form-control"
              placeholder="Buscar videojuego"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></input>
            <button
              id="btn-buscar"
              class="btn btn-outline-secondary"
              type="button"
            > 
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <table
        id="tabla-videojuegos"
        className="table table-striped"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>
            <input type="checkbox" id="check-todos" onChange={handleCheckAll} checked={checkAll}></input>
            </th>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Dificultad</th>
            <th>Año de Lanzamiento</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {videojuegos.map((videojuego) => (
            <tr key={videojuego.id}>
              <td>
                <input
                  type="checkbox"
                  className="check-videojuego"
                  data-id={videojuego.id}
                  checked={videojuego.checked}
                  value={videojuego.id}
                  onChange={handleCheck}
                ></input>
              </td>
              <td>{videojuego.nombre}</td>
              <td>{videojuego.categoria}</td>
              <td>{videojuego.dificultad}</td>
              <td>{videojuego.anio_lanzamiento}</td>
              <td>{videojuego.precio}</td>
              <td>
                <button
                  className="btn btn-primary btn-editar"
                  data-id={videojuego.id}
                  onClick={() => handleEditar(videojuego.id)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-eliminar"
                  data-id={videojuego.id}
                  onClick={() => handleEliminar(videojuego.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav aria-label="Page navigation example">
        <ul id="paginacion" className="pagination justify-content-center">
          {actualizarPaginacion(paginasTotales, paginaActual)}
        </ul>
      </nav>

      {showModal && (
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header ">
              <h5 className="modal-title" id="exampleModalLabel">
                Administrar Videojuegos
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <form id="form-videojuego">
                <input type="hidden" id="id" name="id" ></input>
                <div className="mb-3">
                  <input type="hidden" id="id" name="id" value={id}></input>
                  <label htmlFor="nombre" className="form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                    id="nombre"
                    name="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  ></input>
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select className="form-control" id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                    <option value="Accion">Acción</option>
                    <option value="Aventura">Aventura</option>
                    <option value="Deportes">Deportes</option>
                    <option value="Disparos">Disparos</option>
                    <option value="Estrategia">Estrategia</option>
                    <option value="Rol">Rol</option>
                    <option value="RPG">RPG</option>
                    <option value="Simulacion">Simulación</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Dificultad</label>
                  <select className="form-control" id="dificultad" value={dificultad} onChange={(e) => setDificultad(e.target.value)} required>
                    <option value="Facil">Facil</option>
                    <option value="Normal">Normal</option>
                    <option value="Dificil">Dificil</option>
                    <option value="Extremo">Extremo</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Año de lanzamiento</label>
                  <input
                    type="number"
                    className={`form-control ${errores.anio_lanzamiento ? 'is-invalid' : ''}`}
                    id="lanzamiento"
                    name="lanzamiento"
                    value={anio_lanzamiento}
                    onChange={(e) => setAnio_lanzamiento(e.target.value)}
                    required
                  ></input>
                </div>
                <div className="mb-3">
                  <label className="form-label">Precio</label>
                  <input 
                  type="number" 
                  className={`form-control ${errores.precio ? 'is-invalid' : ''}`}
                  id="precio" 
                  name="precio" 
                  value={precio} 
                  onChange={(e) => setPrecio(e.target.value)} required>

                  </input>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" id="guardarVideojuego" onClick={guardarVideojuego}>
                Guardar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
       {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}


export default App;
