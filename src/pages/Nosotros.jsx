import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/nosotros.css";

export default function Nosotros() {
  useEffect(() => {
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

    if (usuarioActivo) {
      if (authButtons) authButtons.classList.add("hidden");
      if (userInfo) userInfo.classList.remove("hidden");
      if (userEmailSpan) userEmailSpan.textContent = usuarioActivo.correo;
    } else {
      if (authButtons) authButtons.classList.remove("hidden");
      if (userInfo) userInfo.classList.add("hidden");
    }

    window.cerrarSesion = () => {
      localStorage.removeItem("usuarioActivo");
      window.location.href = "/";
    };
  }, []);

  return (
    <>
      <Header />

      <div className="nosotros-page">
        <section className="about-us-section">
          <h2 className="title">Sobre Nosotros</h2>
          <p className="subtitle">
            Conoce más sobre nuestra misión, visión y los valores que nos impulsan.
          </p>

          <div className="about-card">
            <h3 className="card-title">Nuestra Misión</h3>
            <p>
              En EduCapacita, nuestra misión es democratizar el acceso a la educación de calidad, proporcionando
              una plataforma intuitiva y recursos educativos innovadores...
            </p>
          </div>

          <div className="about-card">
            <h3 className="card-title">Nuestra Visión</h3>
            <p>
              Visualizamos un mundo donde el aprendizaje continuo es parte integral de la vida diaria...
            </p>
          </div>

          <div className="about-card">
            <h3 className="card-title">Nuestros Valores</h3>
            <ul className="values-list">
              <li><strong>Excelencia:</strong> Alta calidad en nuestros cursos.</li>
              <li><strong>Innovación:</strong> Nuevas tecnologías para el aprendizaje.</li>
              <li><strong>Accesibilidad:</strong> Educación para todos.</li>
              <li><strong>Comunidad:</strong> Ambiente de apoyo mutuo.</li>
              <li><strong>Integridad:</strong> Honestidad y ética en todo.</li>
            </ul>
          </div>

          <div className="about-card">
            <h3 className="card-title">Nuestra Historia</h3>
            <p>
              EduCapacita fue fundada en 2020 por educadores y tecnólogos apasionados...
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
