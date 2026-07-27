import React from 'react';

import {
 MDBContainer,
 MDBCol,
 MDBRow,
 MDBBtn,
 MDBIcon,
 MDBInput,
 MDBCheckbox
} from 'mdb-react-ui-kit';
//import '../css/Login.css';

import { urlApi } from '../services/apirest';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';


class Login extends React.Component {

    state = {
    form: {
        email: "",
        password: ""
    }

    
}

/**
 *  state = {
    form: {
        email: "",
        password: ""
    },
    errorMensaje: ''
    
}
 */

    manejadorOnChange = async (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
        console.log(this.state.form);
    }


manejadorLogin = () => {
    let url = urlApi + 'auth/login';
    // Limpiamos cualquier error previo antes de intentar iniciar sesión de nuevo
    //this.setState({ errorMensaje: '' });

    const {notificacion} = this.props;


    axios
    .post(url, this.state.form)
    .then(response => { 
        

        if (response.data.message === 'logueo exitoso') {
            console.log("navegando a empresa");
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('idempresa', response.data.idempresa);

            this.props.navigate('/empresa');
        }else {
            //this.setState({ errorMensaje: response.data.message });
            notificacion(response.data.message, "warning");
            //this.setState({ errorMensaje: response.data.message || 'Contraseña incorrecta.' });

        }
    })
    .catch(error => {
       if (error.response) {
        notificacion(error.response.data.message, "error");
       // const mensajeError = error.response.data.message || 'Usuario o contraseña incorrectos.';
           // this.setState({ errorMensaje: mensajeError });

       } else if (error.request) {
        notificacion("No se pudo conectar con el servidor");
       }
    });
}

/*
 */

/*
manejadorLogin = () => {

    let url = urlApi + 'auth/login';

    axios.post(url, this.state.form)
    .then(response => {

       console.log(response.data);

    if (response.data.message === 'logueo exitoso') {

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('idusuarioEmpresa', response.data.idusuarioEmpresa);

        this.props.navigate('/empresa');

    } else {

        console.log(response.data.message);

    }


    })
    .catch(error => {

        console.log("CATCH");
        console.log(error);

        if (error.response) {
            console.log(error.response.data);
        }

    });
}
*/

 render() {
  return (
   <MDBContainer fluid className="p-3 my-5">

    <MDBRow>

     <MDBCol col='10' md="6">
      <img
       src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
       className="img-fluid"
       alt="Phone"
      />
     </MDBCol>

     <MDBCol col='4' md="6">

      <MDBInput
       wrapperClass='mb-4'
       label='Email address'
       type='email'
       size='lg'
       name='email'
       
       onChange={this.manejadorOnChange}
      />

      <MDBInput
       wrapperClass='mb-4'
       label='Password'
       type='password'
       size='lg'
       name='password'
       
       onChange={this.manejadorOnChange}
      />

      <div className="d-flex justify-content-between mx-4 mb-4">
       <MDBCheckbox
        label='Remember me'
       />
       <a href="#">Forgot password?</a>
      </div>

      <MDBBtn className="mb-4 w-100" size="lg" onClick={this.manejadorLogin}>
       Sign in
      </MDBBtn>
      {this.state.errorMensaje && (
                <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>
                    {this.state.errorMensaje}
                </p>
            )}

      <div className="divider d-flex align-items-center my-4">
       <p className="text-center fw-bold mx-3 mb-0">
        OR
       </p>
      </div>

      <MDBBtn
       className="mb-4 w-100"
       size="lg"
       style={{ backgroundColor: '#3b5998' }}
      >
       <MDBIcon fab icon="facebook-f" className="mx-2" />
       Continue with Facebook
      </MDBBtn>

      <MDBBtn
       className="mb-4 w-100"
       size="lg"
       style={{ backgroundColor: '#55acee' }}
      >
       <MDBIcon fab icon="twitter" className="mx-2" />
       Continue with Twitter
      </MDBBtn>

     </MDBCol>

    </MDBRow>

   </MDBContainer>
  );
 }
}

function ContenerdorNavegacion(props) {
    let navigate = useNavigate();
        return <Login {...props} navigate={navigate} />

}




export default ContenerdorNavegacion;

//export default Login;