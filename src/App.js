import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from 'axios';



function App() {
  const baseUrl = "http://localhost/proyectophpjxdh/";
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalBorrar, setModalBorrar] = useState(false);
  const [jxdhSeleccionado, setjxdhSeleccionado] = useState({
    id_usuario: '',
    nombre_usuario: '',
    cedula_usuario: '',
    telefono_usuario: '',
    mail_usuario: ''
  });

  const handleChange =e=> {
    const { name, value } = e.target;
    setjxdhSeleccionado((prevState) => ({
      ...prevState,
      [name]: value
    }))
    console.log(jxdhSeleccionado);
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }
  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }
  const abrirCerrarModalBorrar = () => {
    setModalBorrar(!modalBorrar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
      .then(response=>{
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPost = async () => {
    var xd = new FormData();
    xd.append("nombre_usuario", jxdhSeleccionado.nombre_usuario);
    xd.append("cedula_usuario", jxdhSeleccionado.cedula_usuario);
    xd.append("telefono_usuario", jxdhSeleccionado.telefono_usuario);
    xd.append("mail_usuario", jxdhSeleccionado.mail_usuario);
    xd.append("METHOD", "POST");
    await axios.post(baseUrl, xd)
      .then(response => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPut = async () => {
    var xd = new FormData();
    xd.append("nombre_usuario", jxdhSeleccionado.nombre_usuario);
    xd.append("cedula_usuario", jxdhSeleccionado.cedula_usuario);
    xd.append("telefono_usuario", jxdhSeleccionado.telefono_usuario);
    xd.append("mail_usuario", jxdhSeleccionado.mail_usuario);
    xd.append("METHOD", "PUT");
    await axios.post(baseUrl, xd,{params:{id_usuario: jxdhSeleccionado.id_usuario}} )
      .then(response => {
      var DataNueva = data;
      DataNueva.map(jxdh=>{
        if(jxdh.id_usuario===jxdhSeleccionado.id_usuario){
          jxdh.nombre_usuario=jxdhSeleccionado.nombre_usuario;
          jxdh.cedula_usuario=jxdhSeleccionado.cedula_usuario;
          jxdh.telefono_usuario=jxdhSeleccionado.telefono_usuario;
          jxdh.mail_usuario=jxdhSeleccionado.mail_usuario;
        }
      });
      setData(DataNueva);
        abrirCerrarModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionDelete = async () => {
    var xd = new FormData();
    xd.append("METHOD", "DELETE");
    await axios.post(baseUrl, xd,{params:{id_usuario: jxdhSeleccionado.id_usuario}})
      .then(response => {
        setData(data.filter(jxdh=>jxdh.id_usuario!==jxdhSeleccionado.id_usuario));
        abrirCerrarModalBorrar();
      }).catch(error => {
        console.log(error);
      })
  }

  const seleccionarjxdh = (jxdh, caso) => {
    setjxdhSeleccionado(jxdh);

    (caso === "Editar")?
      abrirCerrarModalEditar():
      abrirCerrarModalBorrar()

      

  }

  useEffect(() => {
    peticionGet();
  }, [])
  return (
    <div style={{ textAlign: 'center' }}>
      <br />
      <button className="btn btn-success" onClick={() => abrirCerrarModalInsertar()}>Insertar</button>
      <br /><br /><br />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cedula</th>
            <th>Telefono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(jxdh => (
            <tr key={jxdh.id_usuario}>
              <td>{jxdh.id_usuario}</td>
              <td>{jxdh.nombre_usuario}</td>
              <td>{jxdh.cedula_usuario}</td>
              <td>{jxdh.telefono_usuario}</td>
              <td>{jxdh.mail_usuario}</td>
              <td>
                <button className="btn btn-primary" onClick={()=> seleccionarjxdh(jxdh, "Editar")}>Editar</button> {"  "}
                <button className="btn btn-danger" onClick={()=> seleccionarjxdh(jxdh, "Borrar")}>Borrar</button>
              </td>

            </tr>
          ))}
        </tbody>

      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Usuario</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre Usuario: </label>
            <br />
            <input type="text" className="form-control" name="nombre_usuario" onChange={handleChange}/>
            <br />
            <label>Cedula : </label>
            <br />
            <input type="text" className="form-control" name="cedula_usuario" onChange={handleChange}/>
            <br />
            <label>Telefono: </label>
            <br />
            <input type="text" className="form-control" name="telefono_usuario" onChange={handleChange}/>
            <br />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="mail_usuario" onChange={handleChange}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=> peticionPost()}>Insertar</button>{"   "}
          <button className="btn btn-danger" onClick={()=> abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Usuario</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre Usuario: </label>
            <br />
            <input type="text" className="form-control" name="nombre_usuario" onChange={handleChange} value={jxdhSeleccionado && jxdhSeleccionado.nombre_usuario} />
            <br />
            <label>Cedula : </label>
            <br />
            <input type="text" className="form-control" name="cedula_usuario" onChange={handleChange} value={jxdhSeleccionado && jxdhSeleccionado.cedula_usuario} />
            <br />
            <label>Telefono: </label>
            <br />
            <input type="text" className="form-control" name="telefono_usuario" onChange={handleChange} value={jxdhSeleccionado && jxdhSeleccionado.telefono_usuario} />
            <br />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="mail_usuario" onChange={handleChange} value={jxdhSeleccionado && jxdhSeleccionado.mail_usuario} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
          <button className="btn btn-danger" onClick={()=> abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalBorrar}>
        <ModalBody>
          estas seguro de Borrar el Registro {jxdhSeleccionado && jxdhSeleccionado.nombre_usuario}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            SI
          </button>
          <button className="btn btn-secondary" onClick={()=>abrirCerrarModalBorrar()}>
            NO
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
