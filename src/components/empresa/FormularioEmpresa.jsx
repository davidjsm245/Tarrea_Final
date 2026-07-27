import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { urlApi } from "../../services/apirest";
//import { SoloLetras } from '../../utils/validaciones';

const FormularioEmpresa = ({ empresaAEditar, onClose, onGuardar, notificacion, abrirModal, datoForaneo, idForaneo }) => {

  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    nombre: "",
        telefono: "",
        email: "",
        password: "",  
        direccion: "",
        tipo: "",
        estado: "",
        fecha_registro: ""
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (empresaAEditar) {

      setForm({
        ...empresaAEditar,
        // Truco importante: SQL devuelve la fecha completa (ISO), pero el input type="date"
        // solo acepta el formato YYYY-MM-DD. Hacemos un split para cortarla.
        //fecha_hora_alquiler: alquilerAEditar.fecha_hora_alquiler ? alquilerAEditar.fecha_hora_alquiler.split('T')[0] : ''
        fecha_registro: empresaAEditar.fecha_registro
          ? empresaAEditar.fecha_registro.slice(0, 16)
          : '',
       // fecha_hora_devolucion: empresaAEditar.fecha_hora_devolucion
         // ? empresaAEditar.fecha_hora_devolucion.slice(0, 16)
          //: ''
      });
    } else {
      setForm({
        nombre: '', telefono: '', email: '', password: '', direccion: '', tipo: '', estado: '', fecha_registro: '', id_empresa: localStorage.getItem('')
      });
    }

  }, [empresaAEditar]);

  useEffect(() => {
    // Si idForaneo tiene un valor real (no es vacío ni "0")
    if (idForaneo && idForaneo !== "0") {
      setForm(estadoAnterior => ({
        ...estadoAnterior,
        id_empresa: idForaneo // Actualizamos el ID interno del formulario
      }));
    }
  }, [idForaneo]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    console.log(form);
  };

  // 4. Envío del formulario (Create o Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');

    // Determinar si es POST (crear) o PUT (editar)
    const method = empresaAEditar ? 'put' : 'post';
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = empresaAEditar
      ? urlApi + `empresa/${empresaAEditar.id_empresa}`//Put
      : urlApi + 'empresa';//Post

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` }
      });

      // Si todo sale bien:
      notificacion(empresaAEditar ? 'Empresa actualizada' : 'Empresa registrada');
      onGuardar(); // Llamamos a la función del padre para recargar la tabla
      onClose();   // Cerramos el modal

    } catch (err) {
      // Manejo de errores (ej: Cédula duplicada 409, Error servidor 500)
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error al guardar');
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h3>{empresaAEditar ? 'Editar Empresa' : 'Nueva Empresa'}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text" name="nombre" value={form.nombre} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Telefono:</label>
          <input
            type="text" name="telefono" value={form.telefono} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email" name="email" value={form.email} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Dirección:</label>
          <input
            type="text" name="direccion" value={form.direccion} onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Tipo de Empresa:</label>
          <input
            type="text" name="tipo_empresa" value={form.tipo} onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Estado:</label>
          <select
            className="form-control"
            name="estado"
            value={form.estado}
            onChange={handleChange}
          >
            <option value="">---Seleccione---</option>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
        </div>


        <div className="form-group">
          <label>Fecha de Registro:</label>
          <input
            type="datetime-local" name="fecha_registro" value={form.fecha_registro} onChange={handleChange}
            className="form-control"
          />
        </div>


        <div className="botones-accion" style={{ marginTop: '15px' }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioEmpresa;