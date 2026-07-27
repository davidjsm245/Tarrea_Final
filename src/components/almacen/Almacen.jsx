import React from "react";
import "./Almacen.css"; // Importas tu nuevo archivo de estilos
import { IconoEditar, IconoEliminar } from "../ui/Iconos"; // Importas tus componentes visuales
import axios from "axios";
import { urlApi } from "../../services/apirest";
import { confirm } from "../../components/Confirmation"; // Vite buscará automáticamente .jsx o .js
import FormularioAlmacen from "../../components/almacen/FormularioAlmacen";
import "../../css/modal.css";
import Empresa from "../../components/empresa/Empresa"; // Importa el componente Empresa

class Almacen extends React.Component {
  state = {
    registros: [],
    pagina_actual: 1,
    cadena_busqueda: "",
    token: localStorage.getItem("token"),
    total_paginas: 0,
    limit: 10,
    mostrarModal: false,
    almacenSeleccionada: null, // Estado para almacenar la empresa seleccionada para editar
    mostrarModalWin: false, // Estado para controlar la visibilidad del modal
  };

   abrirModal = () => {
        this.setState({ mostrarModalWin: true });
    }
    cerrarModalWin = () => {
        this.setState({ mostrarModalWin: false });
    }



  mostrarModalNuevo = () => {

    const {EditarVariable}  = this.props;
        EditarVariable("", "");

    this.setState({
      almacenSeleccionada: null, // Limpiar la empresa seleccionada al abrir el modal para un nuevo registro
      mostrarModal: true,
    });
  };

  mostrarModalEditar = (value) => {
    const { EditarVariable } = this.props;
    EditarVariable(value.id_empresa, value.nombre_empresa); // Llamar a la función del padre con los datos de la empresa seleccionada
    this.setState({
      mostrarModal: true,
      almacenSeleccionada: value // Establecer la empresa seleccionada para editar
      
    });
  }

  cerrarModal = () => {
    this.setState({
      mostrarModal: false,
    });
  };

  alGuardar = () => {
    this.cargarDatos(); // Recargar los datos después de guardar
    this.cerrarModal(); // Cerrar el modal después de guardar
  };

  componentDidMount = () => {
    this.cargarDatos();
  };

  paginaSiguiente = () => {
    if (this.state.pagina_actual < this.state.total_paginas) {
      this.setState({ pagina_actual: this.state.pagina_actual + 1 }, () => {
        this.cargarDatos();
      });
    }
  };

  paginaAnterior = () => {
    if (this.state.pagina_actual > 1) {
      this.setState({ pagina_actual: this.state.pagina_actual - 1 }, () => {
        this.cargarDatos();
      });
    }
  };

  cargarDatos = () => {
    let url =
      urlApi +
      "almacen?page=" +
      this.state.pagina_actual +
      "&string=" +
      this.state.cadena_busqueda +
      "&limit=" +
      this.state.limit;

   
  axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      })
      .then((response) => {
        this.setState({
          registros: response.data.data,
          total_paginas: response.data.totalPage,
        });
      })
      .catch((error) => {
        const { notificacion } = this.props;
        notificacion(error);
      });
  };

  busqueda = async (e) => {
    {
      /* this.setState({pagina_actual: 1}, () => {this.cargarDatos()})*/
    }

    if (e.charCode === 13) {
      this.setState(
        {
          cadena_busqueda: e.target.value,
          pagina_actual: 1,
        },
        () => {
          this.cargarDatos();
        },
      );
    }
  };

  eliminar = async (id, nombre) => {
    if (await confirm("¿Desea eliminar el almacén " + nombre + "?")) {
      const { notificacion } = this.props;
      const url = urlApi + "almacen/" + id;
      axios
        .delete(url, {
          headers: {
            Authorization: `Bearer ${this.state.token}`,
          },
        })
        .then((response) => {
          this.cargarDatos();
        })
        .catch((error) => {
          notificacion(
            error.response.data.error || "Error al eliminar el almacén",
          );
        });
    }
  };

  render() {
    return (
      <div className="container mt-4">
        <h1 className="titulo-almacen">Datos de Almacén</h1>
        
        <button className="btn btn-success" onClick={this.mostrarModalNuevo}>
          Nuevo registro
        </button>

        <input
          type="text"
          placeholder="Buscar por nombre..."
          onKeyPress={this.busqueda}
          className="input-busqueda"
        />

        <table className="table tabla-almacen">
            <thead>
              <tr>
                <th scope="col">ID_Almacen</th>
                <th scope="col">Nombre</th>
                <th scope="col">Direccion</th>
                <th scope="col">Ciudad</th>
                <th scope="col">Capacidad (m³)</th>
                <th scope="col">Id Empresa</th>
                <th scope="col">Empresa</th>
                <th scope="col">Estado</th>
                <th scope="col">Fecha Registro</th>
                <th scope="col">Acciones</th>
              </tr>
           </thead>
          <tbody>
            {this.state.registros.map((value, index) => (
              <tr key={index}>
                <td>{value.id_almacen}</td>
                <td>{value.nombre}</td>
                <td>{value.direccion}</td>
                <td>{value.ciudad}</td>
                <td>{value.capacidad_m3}</td>
                <td>{value.id_empresa}</td>
                <td>{value.nombre_empresa}</td>
                <td>{value.estado}</td>
                <td>{value.fecha_registro}</td>
                <td>
                  <IconoEditar onClick={() => this.mostrarModalEditar(value)} />
                  <IconoEliminar onClick={() => this.eliminar(value.id_almacen, value.nombre)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn btn-primary btn-paginacion" onClick={this.paginaAnterior}>
          Anterior
        </button>
        
        <input
          type="text"
          readOnly
          value={`${this.state.pagina_actual} de ${this.state.total_paginas}`}
          className="input-paginacion"
        />
        
        <button className="btn btn-secondary btn-paginacion" onClick={this.paginaSiguiente}>
          Siguiente
        </button>

        {/* =============== ZONA DE MODALES (AHORA SÍ ADENTRO DEL RETURN) =============== */}
        
        {this.state.mostrarModal && (
          <div className="modal-overlay" style={modalStyles.overlay}>
            <div className="modal-content" style={modalStyles.content}>
              <FormularioAlmacen
                almacenAEditar={this.state.almacenSeleccionada}
                onClose={this.cerrarModal}
                onGuardar={this.alGuardar}
                notificacion={this.props.notificacion}
                abrirModal={this.abrirModal}
                datoForaneo={this.props.datoForaneo}
                idForaneo={this.props.idForaneo}
              />
            </div>
          </div>
        )}

        {this.state.mostrarModalWin && (
          <div className="modal">
            <div className="contenido-modal">
              <span className="close" onClick={this.cerrarModalWin}>&times;</span>
              <Empresa EditarVariable={this.props.EditarVariable} cerrarModal={this.cerrarModalWin} />
            </div>
          </div>
        )}
        
        {/* ============================================================================== */}

      </div>
    );
  }
} // <-- Aquí termina la clase Almacen

// Estilos del modal que van al final del archivo
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
  },
};

export default Almacen;