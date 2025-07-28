import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function FeaturedCourses() {
  const [cursos, setCursos] = useState([])

  useEffect(() => {
    const todosLosCursos = JSON.parse(localStorage.getItem('cursos')) || []
    const destacados = todosLosCursos.slice(0, 3)
    setCursos(destacados)
  }, [])

  return (
    <section className="featured-courses-section">
      <h2 className="section-title">Cursos Destacados</h2>
      <p className="section-subtitle">
        Descubre nuestros cursos más populares y comienza a aprender hoy mismo.
      </p>
      <div className="courses-grid">
        {cursos.length > 0 ? (
          cursos.map((curso) => (
            <div key={curso.id} className="course-card">
              <img
                src={curso.imagen || 'https://via.placeholder.com/300x200?text=Curso'}
                alt={`Imagen del curso de ${curso.titulo}`}
                className="course-image"
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

                {/* ✅ Usamos Link en lugar de <a> */}
                <Link to={`/curso-detalle?id=${curso.id}`} className="enroll-button">
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '1.125rem', gridColumn: '1 / -1' }}>
            No hay cursos destacados disponibles en este momento.
          </p>
        )}
      </div>
    </section>
  )
}
