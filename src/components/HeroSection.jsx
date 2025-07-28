// src/components/HeroSection.jsx
export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Aprende algo nuevo cada día</h1>
        <p className="hero-subtitle">
          Explora una amplia gama de cursos en línea diseñados para impulsar tu carrera y tus pasiones.
        </p>
        <div className="hero-buttons">
          <a href="/cursos" className="explore-courses-button">Explorar Cursos</a>
          <a href="/registro" className="join-us-button">Únete Ahora</a>
        </div>
      </div>
    </section>
  );
}
