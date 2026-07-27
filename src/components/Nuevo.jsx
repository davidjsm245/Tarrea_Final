    import React from "react";
    import 'bootstrap/dist/css/bootstrap.css';
    
    import axios from "axios";

    class Nuevo extends React.Component {
        state = {
    form: {
        nombre: "",
        telefono: "",
        email: "",
        password: "",  
        direccion: "",
        tipo: "",
        estado: ""
    }
}

        irDatos = () => {
            this.props.navigate('/');
        }

        manejadorOnChange = async (e) => {
            this.setState({
                form: {
                    ...this.state.form,
                    [e.target.name]: e.target.value
                }
            })
            console.log(this.state.form);
        }

       guardarDatos = () => {

    const { notificacion } = this.props;

    let url = urlApi + "empresa";

    axios
        .post(url, this.state.form)
        .then(response => {

            notificacion("Empresa registrada correctamente");

            this.props.cerrarModal();

        })
        .catch(error => {

            notificacion(
                error.response?.data?.error ||
                "Error al registrar"
            );

        });
}

    


        render() {
            return (
                <div className="container mt-4  dark bg-light p-4 rounded shadow">
                    <h1 className="mb-4"> Ingrese su Nueva Empresa</h1>

                    <form>

    <div className="mb-3">
        <label>Nombre</label>
        <input
            type="text"
            className="form-control"
            name="nombre"
            onChange={this.manejadorOnChange}
        />
    </div>

    <div className="mb-3">
        <label>Teléfono</label>
        <input
            type="text"
            className="form-control"
            name="telefono"
            onChange={this.manejadorOnChange}
        />
    </div>

    <div className="mb-3">
        <label>Email</label>
        <input
            type="email"
            className="form-control"
            name="email"
            onChange={this.manejadorOnChange}
        />
    </div>

    <div className="mb-3">
        <label>Password</label>
        <input
            type="password"
            className="form-control"
            name="password"
            onChange={this.manejadorOnChange}
        />
    </div>



    <div className="mb-3">
        <label>Dirección</label>
        <input
            type="text"
            className="form-control"
            name="direccion"
            onChange={this.manejadorOnChange}
        />
    </div>

    <div className="mb-3">
        <label>Tipo</label>
        <input
            type="text"
            className="form-control"
            name="tipo"
            onChange={this.manejadorOnChange}
        />
    </div>

    <div className="mb-3">
        <label>Estado</label>

        <select
            className="form-control"
            name="estado"
            onChange={this.manejadorOnChange}
        >
            <option value="">---Seleccione---</option>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
        </select>
    </div>

    <button
        type="button"
        className="btn btn-primary"
        onClick={this.guardarDatos}
    >
        Guardar
    </button>

</form>

                </div>





            );
        }
    }

   
    export default Nuevo;