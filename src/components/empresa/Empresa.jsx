import React from "react";
import axios from "axios";
import { urlApi } from '../../services/apirest';
import { confirm } from '../../components/Confirmation'; // Vite buscará automáticamente .jsx o .js
import FormularioEmpresa from "../../components/empresa/FormularioEmpresa";

class Empresa extends React.Component {

    //    componentDidMount() {
    //      console.log("EMPRESA CARGADA");
    //}

    state = {
        registros: [],
        pagina_actual: 1,
        cadena_busqueda: "",
        token: localStorage.getItem('token'),
        total_paginas: 0,
        limit: 10,

        mostrarModal: false,

        empresaSeleccionada: null, // Estado para almacenar la empresa seleccionada para editar


    }


    cambiarIdForaneo(codigo, dato) {
        const { EditarVariable } = this.props;
        EditarVariable(codigo, dato);
        const { cerrarModal } = this.props;
        cerrarModal();
    }





    mostralModalNuevo = () => {
        this.setState({
            empresaSeleccionada: null, // Limpiar la empresa seleccionada al abrir el modal para un nuevo registro
            mostrarModal: true
        });
    }


    mostrarModalEditar = (id) => {
        this.setState({
            empresaSeleccionada: id, // Establecer la empresa seleccionada para editar
            mostrarModal: true
        });
    }

    cerrarModal = () => {
        this.setState({
            mostrarModal: false
        });


    }

    alGuardar = () => {
        this.cargarDatos();// Recargar los datos después de guardar
        this.cerrarModal();// Cerrar el modal después de guardar
    }



    componentDidMount = () => {
        this.cargarDatos();
    }




    //  abrirModal = () => {
    //this.setState({
    //  mostrarModal: true
    // });
    //}





    paginaSiguiente = () => {
        if (this.state.pagina_actual < this.state.total_paginas) {
            this.setState(
                { pagina_actual: this.state.pagina_actual + 1 },
                () => { this.cargarDatos() }
            )
        }
    }



    paginaAnterior = () => {
        if (this.state.pagina_actual > 1) {
            this.setState(
                { pagina_actual: this.state.pagina_actual - 1 },
                () => { this.cargarDatos() }
            )
        }
    }


    cargarDatos = () => {
        let url = urlApi + "empresa?page=" + this.state.pagina_actual + "&string=" + this.state.cadena_busqueda + "&limit=" + this.state.limit;

        axios
            .get(url, {
                headers: {
                    'Authorization': `Bearer ${this.state.token}`
                }
            })
            .then(response => {
                this.setState({
                    registros: response.data.data,
                    total_paginas: response.data.totalPage
                })
            })
            .catch(error => {
                const { notificacion } = this.props;
                notificacion(error);
            })
    }


    busqueda = async e => {
        {/* this.setState({pagina_actual: 1}, () => {this.cargarDatos()})*/ }

        if (e.charCode === 13) {
            this.setState({
                cadena_busqueda: e.target.value,
                pagina_actual: 1
            }, () => { this.cargarDatos() })

        }
    }


    eliminar = async (id, nombre) => {
        if (await confirm('¿Desea eliminar la empresa ' + nombre + '?')) {
            const { notificacion } = this.props;
            const url = urlApi + "empresa/" + id;
            axios
                .delete(url, {
                    headers: {
                        'Authorization': `Bearer ${this.state.token}`
                    }
                })
                .then(response => {
                    this.cargarDatos();
                })
                .catch(error => {
                    notificacion(error.response.data.error || 'Error al eliminar la empresa');

                })
        }
    }

    render() {
        return (

            <div>



                <div className="container mt-4">
                    <h1 style={{ fontSize: '2.5rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#007aff' }}>
                        Datos de Empresa
                    </h1>
                    {this.props.NoModal === true && (
                        <button className="btn btn-success" onClick={this.mostralModalNuevo}>Nuevo registro</button>
                    )}

                    <input type="text" placeholder="Buscar por nombre..." onKeyPress={this.busqueda} style={{ marginLeft: "20px", padding: "10px", borderRadius: "22px", border: "1px solid #ced4da", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.12)" }} />

                    {/* <button className="btn btn-primary" onClick={this.busqueda} style={{marginLeft: "10px", padding: "10px 18px", borderRadius: "30px", boxShadow: "0 6px 14px rgba(0,0,0,0.18)"}}>Buscar</button> */}

                    <table className="table" style={{ marginTop: "20px", borderRadius: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Telefono</th>
                                <th scope="col">Email</th>
                                {/* <th scope="col">password</th> */}
                                <th scope="col">Direccion</th>
                                <th scope="col">Tipo</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Fecha registro</th>
                                <th scope="col">Acciones</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.registros.map((value, index) => {//Recorrer los registros
                                return (
                                    <tr key={index}>
                                        <td>{value.id_empresa}</td>

                                        <td>{value.nombre}</td>
                                        <td>{value.telefono}</td>
                                        <td>{value.email}</td>
                                        {/* <td>{value.password}</td> */}
                                        <td>{value.direccion}</td>
                                        <td>{value.tipo}</td>
                                        <td>{value.estado}</td>
                                        <td>{value.fecha_registro}</td>
                                        <td>

                                            {this.props.NoModal === true ? (

                                                <div>
                                                    <svg
                                                        onClick={() => this.mostrarModalEditar(value)}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="28"
                                                        height="28"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="#007aff"
                                                        strokeWidth="1"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                        <path d="M16 5l3 3" />
                                                    </svg>

                                                    <svg
                                                        onClick={() => this.eliminar(value.id_empresa, value.nombre)}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="28"
                                                        height="28"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="#ff2d55"
                                                        strokeWidth="1"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M4 7l16 0" />
                                                        <path d="M10 11l0 6" />
                                                        <path d="M14 11l0 6" />
                                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                    </svg>

                                                </div>
                                            ) : (

                                                <div>

                                                    <svg
                                                        onClick={() => this.cambiarIdForaneo(value.id_empresa, value.nombre)}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="32"
                                                        height="32"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="#607d8b"
                                                        strokewidth="1"
                                                        strokelinecap="round"
                                                        strokelinejoin="round"
                                                    >
                                                        <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
                                                        <path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5" />
                                                        <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
                                                        <path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
                                                        <path d="M5 3l-1 -1" />
                                                        <path d="M4 7h-1" />
                                                        <path d="M14 3l1 -1" />
                                                        <path d="M15 6h1" />
                                                    </svg>

                                                </div>

                                            )}


                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>

                    </table>



                    <button type="button" className="btn btn-primary" onClick={this.paginaAnterior} style={{ marginRight: "10px", padding: "10px 18px", borderRadius: "30px", boxShadow: "0 6px 14px rgba(0,0,0,0.18)" }}>Anterior</button>
                    <input type="text" readOnly value={this.state.pagina_actual + " de " + this.state.total_paginas} style={{ marginRight: "10px", textAlign: "center", width: "140px", padding: "10px", borderRadius: "22px", border: "1px solid #ced4da", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.12)" }} />
                    <button type="button" className="btn btn-secondary" onClick={this.paginaSiguiente} style={{ padding: "10px 18px", borderRadius: "30px", boxShadow: "0 6px 14px rgba(0,0,0,0.18)" }}>Siguiente</button>

                </div>

                {this.state.mostrarModal && (
                    <div className="modal-overlay" style={modalStyles.overlay}>
                        <div className="modal-content" style={modalStyles.content}>
                            <FormularioEmpresa
                                empresaAEditar={this.state.empresaSeleccionada}
                                onClose={this.cerrarModal}
                                onGuardar={this.alGuardar}
                                notificacion={this.props.notificacion}
                            />
                        </div>
                    </div>

                )}
            </div>
        );
    }
}

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    content: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
    }
};

export default Empresa;




