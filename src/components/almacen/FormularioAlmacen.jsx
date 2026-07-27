
import React, { useState, useEffect } from "react";
import axios from "axios";
import { urlApi } from "../../services/apirest";
//import { SoloLetras } from '../../utils/validaciones';

const FormularioAlmacen = ({
  almacenAEditar,
  onClose,
  onGuardar,
  notificacion,
  abrirModal,
  datoForaneo,
  idForaneo,
}) => {
  // 1. Estado inicial del formulario
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    capacidad_m3: "",
    id_empresa: "",
    estado: "",
    fecha_registro: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. useEffect: Detectar si estamos en modo EDICIÓN
  useEffect(() => {
    if (almacenAEditar) {
      setForm({
        ...almacenAEditar,
        // Truco importante: SQL devuelve la fecha completa (ISO), pero el input type="date"
        // solo acepta el formato YYYY-MM-DD. Hacemos un split para cortarla.
        //fecha_hora_alquiler: alquilerAEditar.fecha_hora_alquiler ? alquilerAEditar.fecha_hora_alquiler.split('T')[0] : ''
        fecha_registro: almacenAEditar.fecha_registro
          ? almacenAEditar.fecha_registro.slice(0, 16)
          : "",
        // fecha_hora_devolucion: almacenAEditar.fecha_hora_devolucion
        // ? almacenAEditar.fecha_hora_devolucion.slice(0, 16)
        //: ''
      });
    } else {
      setForm({
        nombre: "",
        direccion: "",
        ciudad: "",
        capacidad_m3: "",
        id_empresa: "",
        estado: "",
        fecha_registro: "",
        id_almacen: localStorage.getItem(""),
      });
    }
  }, [almacenAEditar]);

  useEffect(() => {
    // Si idForaneo tiene un valor real (no es vacío ni "0")
    if (idForaneo && idForaneo !== "0") {
      setForm((estadoAnterior) => ({
        ...estadoAnterior,
        id_empresa: idForaneo, // Actualizamos el ID interno del formulario
      }));
    }
  }, [idForaneo]);

  // 3. Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    console.log(form);
  };

  // 4. Envío del formulario (Create o Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    // Determinar si es POST (crear) o PUT (editar)
      const method = almacenAEditar ? "put" : "post";
    // Si editamos, agregamos el ID a la URL. Si creamos, usamos la URL base.
    const url = almacenAEditar
      ? urlApi + `almacen/${almacenAEditar.id_almacen}` //Put
      : urlApi + "almacen"; //Post

    try {
      await axios({
        method: method,
        url: url,
        data: form,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Si todo sale bien:
      notificacion(
        almacenAEditar ? "Almacen actualizado" : "Almacen registrado",
      );
      onGuardar(); // Llamamos a la función del padre para recargar la tabla
      onClose(); // Cerramos el modal
    } catch (err) {
      // Manejo de errores (ej: Cédula duplicada 409, Error servidor 500)
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Error al guardar");
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <h3>{almacenAEditar ? "Editar Almacen" : "Nuevo Almacen"}</h3>

      {error && <p className="alert alert-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>ciudad:</label>
          <input
            type="text"
            name="ciudad"
            value={form.ciudad}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>capacidad_m3:</label>
          <input
            type="text"
            name="capacidad_m3"
            value={form.capacidad_m3}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

          <div className="form-group">
          <label>Empresa:</label>
          <input
            type="text" name="empresa" value={datoForaneo} onClick={abrirModal}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Id_Empresa:</label>
          <input
            type="text"
            name="id_empresa"
            value={form.id_empresa}
            onChange={handleChange}
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
            <option value="activo">
operativo
</option>
            <option value="mantenimiento">
mantenimiento
</option>
            <option value="cerrado">

cerrado

</option>
          </select>
        </div>

        <div className="form-group">
          <label>Fecha de Registro:</label>
          <input
            type="datetime-local"
            name="fecha_registro"
            value={form.fecha_registro}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="botones-accion" style={{ marginTop: "15px" }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ marginLeft: "10px" }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioAlmacen;






