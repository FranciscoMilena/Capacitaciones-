import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header"; // ✅ Asegúrate de que esta ruta sea correcta
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // "error" o "exito"

  useEffect(() => {
    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (usuariosGuardados.length === 0) {
      const usuariosIniciales = [
        {
          id: "prof-001",
          nombre: "Profesor Prueba",
          correo: "isaac@gmail.com",
          contrasena: "12345",
          rol: "profesor",
          avatar: "https://via.placeholder.com/100?text=Profesor",
          especialidad: "Desarrollo Web",
          biografia: "Profesor con 10 años de experiencia en desarrollo web."
        },
        {
          id: "est-001",
          nombre: "Estudiante Uno",
          correo: "estudiante1@test.com",
          contrasena: "12345",
          rol: "estudiante",
          avatar: "https://via.placeholder.com/100?text=Estudiante1",
          intereses: "Programación Frontend",
          bio: "Estudiante apasionado por la creación de interfaces web."
        },
        {
          id: "est-002",
          nombre: "Estudiante Dos",
          correo: "estudiante2@test.com",
          contrasena: "12345",
          rol: "estudiante",
          avatar: "https://via.placeholder.com/100?text=Estudiante2",
          intereses: "Bases de Datos, Backend",
          bio: "Interesado en la lógica del lado del servidor y gestión de datos."
        }
      ];

      localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
      console.log("Usuarios iniciales creados.");
    }

    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    if (usuarioActivo) {
      alert("Ya has iniciado sesión como " + usuarioActivo.correo);
      navigate(usuarioActivo.rol === "profesor" ? "/profesor" : "/");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      setTipoMensaje('error');
      setMensaje("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(
      (u) => u.correo === correo && u.contrasena === contrasena
    );

    if (usuario) {
      localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
      setTipoMensaje('exito');
      setMensaje("¡Inicio de sesión exitoso! Redirigiendo...");

      setTimeout(() => {
        navigate(usuario.rol === "profesor" ? "/profesor" : "/");
      }, 1500);
    } else {
      setTipoMensaje('error');
      setMensaje("Correo o contraseña incorrectos.");
    }
  };

  return (
    <>
      <Header /> {/* ✅ Aquí se muestra el header en la parte superior */}
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <button type="submit">Ingresar</button>
        </form>

        {mensaje && (
          <p className={tipoMensaje === "error" ? "mensaje-error" : "mensaje-exito"}>
            {mensaje}
          </p>
        )}
      </div>
    </>
  );
}
