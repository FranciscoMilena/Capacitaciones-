import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/contacto.css";

export default function Contacto() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const userMenuButtonRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    setUsuarioActivo(usuario);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userMenuButtonRef.current &&
        userDropdownRef.current &&
        !userMenuButtonRef.current.contains(event.target) &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  function toggleDropdown() {
    setDropdownVisible((visible) => !visible);
  }

  function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    setUsuarioActivo(null);
    setDropdownVisible(false);
    window.location.href = "index.html";
  }

  return (
    <>
      <Header />

      <div className="contacto-page">
        <section>
          <h2>Contáctanos</h2>
          <p>
            Estamos aquí para ayudarte. Ponte en contacto con nosotros a través de
            los siguientes medios:
          </p>

          <div>
            <div>
              <img
                src="https://img.icons8.com/ios-filled/50/2563eb/phone.png"
                alt="Teléfono"
              />
              <h3>Teléfono</h3>
              <p>+1 (123) 456-7890</p>
              <p>+1 (987) 654-3210</p>
            </div>
            <div>
              <img
                src="https://img.icons8.com/ios-filled/50/2563eb/email.png"
                alt="Correo Electrónico"
              />
              <h3>Correo Electrónico</h3>
              <p>info@educapacita.com</p>
              <p>soporte@educapacita.com</p>
            </div>
            <div>
              <img
                src="https://img.icons8.com/ios-filled/50/2563eb/instagram-new.png"
                alt="Instagram"
              />
              <h3>Instagram</h3>
              <p>
                <a
                  href="https://www.instagram.com/educapacita"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @educapacita
                </a>
              </p>
            </div>
            <div>
              <img
                src="https://img.icons8.com/ios-filled/50/2563eb/linkedin.png"
                alt="LinkedIn"
              />
              <h3>LinkedIn</h3>
              <p>
                <a
                  href="https://www.linkedin.com/company/educapacita"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  EduCapacita Oficial
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3>Nuestra Ubicación</h3>
            <p>Estamos ubicados en el corazón de la ciudad. ¡Visítanos!</p>
            <address>123 Calle Principal, Ciudad Ejemplo, País</address>
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.789182375836!2d-79.9168926852467!3d-0.2294979998144208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x90297316a3a3a3a3%3A0x1234567890abcdef!2sManta%2C%20Manab%C3%AD%2C%20Ecuador!5e0!3m2!1ses!2sec!4v1678901234567!5m2!1ses!2sec"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de Ubicación"
              />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
