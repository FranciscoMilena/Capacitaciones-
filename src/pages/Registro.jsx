// src/pages/Registro.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/Registro.css";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    rol: "estudiante", // 🔹 Siempre será estudiante
  });

  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, correo, contrasena, confirmarContrasena, rol } = formData;

    // 🔹 Validaciones
    if (!nombre || !correo || !contrasena || !confirmarContrasena) {
      setMensaje({ tipo: "error", texto: "Todos los campos son obligatorios." });
      return;
    }

    if (contrasena.length < 6) {
      setMensaje({ tipo: "error", texto: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setMensaje({ tipo: "error", texto: "Las contraseñas no coinciden." });
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.find((u) => u.correo === correo)) {
      setMensaje({ tipo: "error", texto: "El correo electrónico ya está registrado." });
      return;
    }

    // 🔹 Registro fijo como estudiante
    const nuevoUsuario = {
      id: Date.now().toString(),
      nombre,
      correo,
      contrasena,
      rol, // siempre "estudiante"
      cursosInscritos: [],
      cursosImpartidos: [],
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    setMensaje({ tipo: "success", texto: "¡Registro exitoso! Redirigiendo al login..." });

    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="registration-container">
          <h1 className="registration-title">Regístrate en EduCapacita</h1>
          <p className="registration-subtitle">
            Crea una cuenta para acceder a nuestros cursos y recursos.
          </p>

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input type="text" name="nombre" className="form-input" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input type="email" name="correo" className="form-input" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input type="password" name="contrasena" className="form-input" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <input type="password" name="confirmarContrasena" className="form-input" onChange={handleChange} required />
            </div>

            {/* 🔹 Eliminado el select para elegir rol */}

            {mensaje.texto && (
              <div className={mensaje.tipo === "error" ? "error-message" : "success-message"}>
                {mensaje.texto}
              </div>
            )}

            <button type="submit" className="register-submit-button">Registrarse</button>

            <p className="login-link-text">
              ¿Ya tienes una cuenta?
              <a href="/login" className="login-link">Inicia Sesión aquí</a>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
