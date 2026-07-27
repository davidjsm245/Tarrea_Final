

import React, { useState } from 'react'
//import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './css/App.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


import Login from './components/Login.jsx'

import Empresa from './components/empresa/Empresa.jsx'

import Almacen from './components/almacen/Almacen.jsx'

import Clientes from './components/cliente/Cliente.jsx'

import Header from './components/header/Header.jsx'




class App extends React.Component {


   constructor(props) {
    super(props);
    this.state = {
      NoModal: true,
      idForaneo: "0",
      datoForaneo: "0",
    };
    this.EditarVariable = this.EditarVariable.bind(this);
  }

  EditarVariable(valorid, valorDato) {
    this.setState({
      idForaneo: valorid,
      datoForaneo: valorDato
    });
  }






  notifiacion = (mensaje , tipo = "info" ,duracion = 3000) => {
    //Accedo al contenedor
    let container = document.querySelector('.notif-container');
    //Crear un elemento de la notifacion
    const notif = document.createElement('div');
    // agrego clases al elemento
    notif.className = 'notif-toast ${tipo}';
    //Agrego mensaje al elemento
    notif.innerText = mensaje;
    //agregamos el elemento al contenedor
    container.appendChild(notif);
    //Activar animación de entrada
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            notif.classList.add('show');//Mostramos la notificación
        });
    });
    setTimeout(() => {
        notif.classList.remove('show');
        notif.classList.add('fade-out');
        notif.addEventListener('transitionend', () => {
            notif.remove(); //eliminar el elemento
        });
    }, duracion);
  }

render() {
  return (
    <div className="App">
        <div className="notif-container"></div>

      

      <Router>

       
        
        <Routes>
          <Route path="/" element={<Login notificacion={this.notifiacion} />} />
          {/* <Route path="/empresa" element={<Empresa  notificacion={this.notifiacion}/>} /> */}


          {/* Tus compañeros irán agregando sus rutas aquí: */}
          {/* <Route path="/clientes" element={<Clientes notificacion={this.notifiacion}/>} /> */}


          <Route path="/empresa" element={
      <>
        <Header />
        <div className="container mt-5"> {/* mt-5 da el espacio superior */}
          <Empresa notificacion={this.notifiacion} NoModal={this.state.NoModal}/>
        </div>
      </>
    } />

    <Route path="/almacen" element={
      <>
        <Header />
        <div className="container mt-5">
          <Almacen notificacion={this.notifiacion} EditarVariable={this.EditarVariable} idForaneo={this.state.idForaneo} datoForaneo={this.state.datoForaneo}
/>

        </div>
      </>
    } />


    <Route path="/clientes" element={
      <>
        <Header />  

        <div className="container mt-5">
          <Clientes notificacion={this.notifiacion}/>
        </div>
      </>
    } />
          
        </Routes>
      </Router>
    </div>
  );
}

}



  

  

  

export default App;


