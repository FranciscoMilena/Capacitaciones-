import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/perfil.css";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({ current: "", nueva: "", confirmar: "" });
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    // Manejo del menú usuario en header
    const userMenuButton = document.getElementById("user-menu-button");
    const userDropdown = document.getElementById("user-dropdown");
    const authButtons = document.getElementById("auth-buttons");
    const userInfo = document.getElementById("user-info");
    const userEmailSpan = document.getElementById("user-email");

    if (userMenuButton && userDropdown) {
      userMenuButton.addEventListener("click", () => {
        userDropdown.classList.toggle("hidden");
      });

      window.addEventListener("click", (event) => {
        if (
          !userMenuButton.contains(event.target) &&
          !userDropdown.contains(event.target)
        ) {
          userDropdown.classList.add("hidden");
        }
      });
    }

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo) {
      alert("Debes iniciar sesión para ver tu perfil.");
      window.location.href = "/login";
      return;
    }

    if (authButtons) authButtons.classList.add("hidden");
    if (userInfo) userInfo.classList.remove("hidden");
    if (userEmailSpan) userEmailSpan.textContent = usuarioActivo.correo;

    setUsuario(usuarioActivo);

    // Limpiar event listeners al desmontar
    return () => {
      if (userMenuButton) userMenuButton.removeEventListener("click", null);
      window.removeEventListener("click", null);
    };
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "/";
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const cambiarContrasena = (e) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    if (form.current !== usuario.contrasena) {
      setMensaje({ tipo: "error", texto: "La contraseña actual es incorrecta." });
      return;
    }
    if (form.nueva.length < 6) {
      setMensaje({ tipo: "error", texto: "La nueva contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (form.nueva !== form.confirmar) {
      setMensaje({ tipo: "error", texto: "La nueva contraseña y la confirmación no coinciden." });
      return;
    }

    const actualizado = { ...usuario, contrasena: form.nueva };
    setUsuario(actualizado);
    localStorage.setItem("usuarioActivo", JSON.stringify(actualizado));

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const i = usuarios.findIndex(u => u.id === usuario.id);
    if (i !== -1) {
      usuarios[i].contrasena = form.nueva;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    setMensaje({ tipo: "exito", texto: "Contraseña actualizada exitosamente." });
    setForm({ current: "", nueva: "", confirmar: "" });
  };

  const eliminarCuenta = () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.")) return;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios = usuarios.filter(u => u.id !== usuario.id);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    let cursos = JSON.parse(localStorage.getItem("cursos")) || [];
    cursos.forEach(curso => {
      if (usuario.rol === "estudiante") {
        curso.estudiantes = (curso.estudiantes || []).filter(e => e.correo !== usuario.correo);
      }
    });
    localStorage.setItem("cursos", JSON.stringify(cursos));

    if (usuario.rol === "estudiante") {
      let inscritos = JSON.parse(localStorage.getItem("allUsersCursosInscritos")) || {};
      delete inscritos[usuario.correo];
      localStorage.setItem("allUsersCursosInscritos", JSON.stringify(inscritos));
    }

    localStorage.removeItem("usuarioActivo");
    alert("Tu cuenta ha sido eliminada exitosamente.");
    window.location.href = "/";
  };

  if (!usuario) return null;

  return (
    <>
      <Header correo={usuario.correo} onCerrarSesion={cerrarSesion} />

      <div className="perfil-container">
        <h1 className="profile-title">Mi Perfil</h1>

        <section className="profile-section">
          <h2>Información Personal</h2>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Rol:</strong> {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}</p>
        </section>

        <section className="profile-section">
          <h2>Cambiar Contraseña</h2>
          <form onSubmit={cambiarContrasena}>
            <label htmlFor="current">Contraseña Actual</label>
            <input
              type="password"
              id="current"
              value={form.current}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="nueva">Nueva Contraseña</label>
            <input
              type="password"
              id="nueva"
              value={form.nueva}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="confirmar">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              id="confirmar"
              value={form.confirmar}
              onChange={handleInputChange}
              required
            />

            {mensaje.texto && (
              <div className={mensaje.tipo === "exito" ? "success-message" : "error-message"}>
                {mensaje.texto}
              </div>
            )}

            <button type="submit" className="submit-button">Cambiar Contraseña</button>
          </form>
        </section>

        <section className="profile-section delete-account-section">
          <h2>Eliminar Cuenta</h2>
          <p className="delete-account-warning">
            Advertencia: Esta acción es irreversible y eliminará todos tus datos.
          </p>
          <button onClick={eliminarCuenta} className="delete-button">Eliminar Mi Cuenta</button>
        </section>
      </div>

      <Footer />
    </>
  );
}
