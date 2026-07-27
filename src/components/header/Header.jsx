// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand">Mi Sistema</span>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/empresa">Empresas</Link>
            </li>
            {/* Aquí tus compañeros agregarán sus links después */}
            <li className="nav-item">
              <Link className="nav-link" to="/almacen">Almacén</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/clientes">Clientes</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};



export default Header;