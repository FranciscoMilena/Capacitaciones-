import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cursos.css";

export default function Cursos() {
  
  const [cursosOriginales, setCursosOriginales] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nivel, setNivel] = useState("");
  const [categoriasUnicas, setCategoriasUnicas] = useState([]);
  const navigate = useNavigate(); // ✅ Hook para redirección

  useEffect(() => {
    const cursos = JSON.parse(localStorage.getItem("cursos")) || [];
    setCursosOriginales(cursos);
    setCursosFiltrados(cursos);

    const categorias = [...new Set(cursos.map((c) => c.categoria))] || [];
    setCategoriasUnicas(categorias);
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [busqueda, categoria, nivel]);

 const aplicarFiltros = () => {
  const texto = busqueda.toLowerCase();

  const filtrados = cursosOriginales.filter((curso) => {
    const coincideBusqueda =
      curso.titulo.toLowerCase().includes(texto) ||
      curso.descripcion.toLowerCase().includes(texto) ||
      curso.instructor.toLowerCase().includes(texto) ||
      curso.categoria.toLowerCase().includes(texto) ||
      curso.nivel.toLowerCase().includes(texto);

    const coincideCategoria = categoria === "" || curso.categoria === categoria;
    const coincideNivel = nivel === "" || curso.nivel === nivel;

    return coincideBusqueda && coincideCategoria && coincideNivel;
  });

  setCursosFiltrados(filtrados);
};


  // ✅ Nueva función para manejar el click en "Ver Detalles"
  const handleVerDetalles = (cursoId) => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
      // 🔹 Si no hay sesión → ir a registro
      navigate("/registro");
    } else {
      // 🔹 Si hay sesión → ir al detalle
      navigate(`/curso-detalle?id=${cursoId}`);
    }
  };

  return (
    <>
      <Header />

      <div className="cursos-page">
        <h1 className="page-title">Explora Nuestros Cursos</h1>
        <p className="page-subtitle">
          Encuentra el curso perfecto para tus objetivos de aprendizaje.
        </p>

        {/* 🔹 Filtros */}
        <section className="filters-section">
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button onClick={aplicarFiltros}>Buscar</button>
          </div>
          <div className="filter-controls">
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Todas las Categorías</option>
              {categoriasUnicas.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
              <option value="">Todos los Niveles</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
        </section>

        {/* 🔹 Grid de Cursos */}
        <section className="courses-grid-section">
          <div className="courses-grid">
            {cursosFiltrados.length > 0 ? (
              cursosFiltrados.map((curso) => (
                <div key={curso.id} className="course-card">
                  <img
                    src={curso.imagen || "https://via.placeholder.com/300x200?text=Curso"}
                    alt={`Imagen del curso ${curso.titulo}`}
                  />
                  <div className="course-content">
                    <span className="course-category">{curso.categoria}</span>
                    <h3 className="course-title">{curso.titulo}</h3>
                    <p className="course-description">{curso.descripcion}</p>
                    <div className="course-details">
                      <span className="course-instructor">
                        <img src="https://img.icons8.com/material-rounded/16/000000/user.png" alt="Instructor icon" />
                        {curso.instructor}
                      </span>
                      <span className="course-duration">
                        <img src="https://img.icons8.com/material-rounded/16/000000/time--v2.png" alt="Duration icon" />
                        {curso.duracion}
                      </span>
                    </div>

                    {/* ✅ Ahora es un botón, NO un <a>, para usar navigate */}
                    <button 
                      className="enroll-button"
                      onClick={() => handleVerDetalles(curso.id)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron cursos que coincidan con tu búsqueda.</p>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
