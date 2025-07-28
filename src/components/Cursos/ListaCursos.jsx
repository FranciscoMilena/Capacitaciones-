// src/components/Cursos/ListaCursos.jsx
export default function ListaCursos() {
  return (
    <section className="courses-grid-section">
      <div id="lista-cursos" className="courses-grid">
        {/* Aquí luego se puede hacer un map para renderizar cursos dinámicamente */}
      </div>
      <p id="no-results-message" className="no-results-message hidden">
        No se encontraron cursos que coincidan con tu búsqueda.
      </p>
    </section>
  );
}
