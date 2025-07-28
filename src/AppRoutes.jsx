// src/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './App';
import Cursos from './pages/Cursos';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Profesor from './pages/Profesor';
import CursoDetalle from './pages/CursoDetalle';  // ✅ IMPORTA EL COMPONENTE
import CursoContenido from './pages/CursoContenido';  // ✅ IMPORTA EL COMPONENTE
import MisCursos from './pages/MisCursos';
export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/profesor" element={<Profesor />} />
        <Route path="/curso-detalle" element={<CursoDetalle />} />  
        <Route path="/curso-contenido" element={<CursoContenido />} />
        <Route path="/mis-cursos" element={<MisCursos />} />


        {/* ✅ CORRECTO */}

      </Routes>
    </Router>
  );
}
