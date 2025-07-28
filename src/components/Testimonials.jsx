// src/components/Testimonials.jsx
export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <h2 className="section-title">Lo que nuestros estudiantes dicen</h2>
      <div className="testimonial-grid">
        <div className="testimonial-card">
          <p className="testimonial-text">
            "EduCapacita ha transformado mi forma de aprender. Los cursos son
            increíbles y los profesores, excelentes."
          </p>
          <p className="testimonial-author">- Ana García</p>
        </div>
        <div className="testimonial-card">
          <p className="testimonial-text">
            "La plataforma es muy intuitiva y el contenido de los cursos es de
            alta calidad. ¡Totalmente recomendado!"
          </p>
          <p className="testimonial-author">- Luis Fernández</p>
        </div>
        <div className="testimonial-card">
          <p className="testimonial-text">
            "He mejorado mis habilidades laborales significativamente gracias a
            los cursos de programación. ¡Gracias, EduCapacita!"
          </p>
          <p className="testimonial-author">- María L.P.</p>
        </div>
      </div>
    </section>
  );
}
