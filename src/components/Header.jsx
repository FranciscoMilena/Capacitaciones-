import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const [usuario, setUsuario] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false) // ✅ agregado para el menú responsive
  const navigate = useNavigate()

  // Cargar usuario activo desde localStorage
  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'))
    setUsuario(usuarioActivo)
  }, [])

  // Cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('usuarioActivo')
    setUsuario(null)
    navigate('/') // Redirige al inicio
  }

  // Cerrar el menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('user-dropdown')
      const button = document.getElementById('user-menu-button')
      if (
        dropdown &&
        button &&
        !dropdown.contains(event.target) &&
        !button.contains(event.target)
      ) {
        setShowDropdown(false)
      }
    }

    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <header className="header">
      <div className="header-logo">
        <img
          src="https://img.icons8.com/ios-filled/24/graduation-cap.png"
          alt="Logo"
          className="logo-icon"
        />
        <Link to="/" className="app-title">EduCapacita</Link>
      </div>

      {/* ✅ Botón de menú hamburguesa */}
      <button className="hamburger" onClick={() => setMenuAbierto(!menuAbierto)}>
        ☰
      </button>

      {/* 🔹 Ahora Inicio aparece antes de Cursos */}
      <nav className={`nav-links ${menuAbierto ? 'show' : ''}`}>
        <Link to="/" className="nav-item" onClick={() => setMenuAbierto(false)}>Inicio</Link>
        <Link to="/cursos" className="nav-item" onClick={() => setMenuAbierto(false)}>Cursos</Link>
        <Link to="/contacto" className="nav-item" onClick={() => setMenuAbierto(false)}>Contacto</Link>
        <Link to="/nosotros" className="nav-item" onClick={() => setMenuAbierto(false)}>Nosotros</Link>
      </nav>

      {!usuario ? (
        <div className="auth-buttons">
          <Link to="/login" className="login-button">Iniciar Sesión</Link>
          <Link to="/Registro" className="register-button">Registrarse</Link>
        </div>
      ) : (
        <div className="user-info" id="user-info">
          <button
            id="user-menu-button"
            className="user-menu-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="user-email">{usuario.correo}</span>
            <div className="user-avatar-circle">
              {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "U"}
            </div>
          </button>

          <div
            id="user-dropdown"
            className={`user-dropdown ${showDropdown ? '' : 'hidden'}`}
          >
            <Link to="/perfil" className="dropdown-link">Mi Perfil</Link>
            <Link to="/mis-cursos" className="dropdown-link">Mis Cursos</Link>
            <button onClick={cerrarSesion} className="logout-button">Cerrar Sesión</button>
          </div>
        </div>
      )}
    </header>
  )
}
