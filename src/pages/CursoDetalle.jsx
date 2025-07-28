import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/curso_detalle.css";

export default function CursoDetalle() {
  const [curso, setCurso] = useState(null);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [estaInscrito, setEstaInscrito] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener id del curso desde query param ?id=xxx
  const queryParams = new URLSearchParams(location.search);
  const cursoId = queryParams.get("id");

  useEffect(() => {
    // Cargar usuario activo desde localStorage
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
    setUsuarioActivo(usuario);

    if (!cursoId) {
      setNoEncontrado(true);
      return;
    }

    const cursos = JSON.parse(localStorage.getItem("cursos")) || [];
    const cursoEncontrado = cursos.find(c => String(c.id) === String(cursoId));

    if (!cursoEncontrado) {
      setNoEncontrado(true);
      return;
    }

    setCurso(cursoEncontrado);

    // Verificar si usuario está inscrito
    if (usuario && usuario.rol === "estudiante") {
      const allInscritos = JSON.parse(localStorage.getItem("allUsersCursosInscritos")) || {};
      const cursosUsuario = allInscritos[usuario.correo] || [];
      setEstaInscrito(cursosUsuario.includes(cursoEncontrado.id));
    }
  }, [cursoId]);

  const handleInscribirse = () => {
    if (!usuarioActivo) {
      setMensaje({ texto: "Debes iniciar sesión para inscribirte.", tipo: "error" });
      return;
    }
    if (usuarioActivo.rol !== "estudiante") {
      setMensaje({ texto: "Solo los estudiantes pueden inscribirse en cursos.", tipo: "error" });
      return;
    }
    if (estaInscrito) {
      setMensaje({ texto: "Ya estás inscrito en este curso.", tipo: "error" });
      return;
    }

    // Inscripción gratuita (o si el precio es "Gratis")
    if (curso.precio && curso.precio.toLowerCase() !== "gratis") {
      setMensaje({ texto: "Este curso no es gratis, la inscripción no está disponible aquí.", tipo: "error" });
      return;
    }

    // Guardar inscripción en localStorage
    const allInscritos = JSON.parse(localStorage.getItem("allUsersCursosInscritos")) || {};
    const cursosUsuario = allInscritos[usuarioActivo.correo] || [];

    const nuevosCursosUsuario = [...cursosUsuario, curso.id];
    const nuevosAllInscritos = { ...allInscritos, [usuarioActivo.correo]: nuevosCursosUsuario };
    
    localStorage.setItem("allUsersCursosInscritos", JSON.stringify(nuevosAllInscritos));

    setEstaInscrito(true);
    setMensaje({ texto: "¡Inscripción exitosa! Ahora puedes acceder al curso.", tipo: "success" });
  };

  if (noEncontrado) {
    return (
      <>
        <Header />
        <main className="curso-detalle-page">
          <p>Curso no encontrado.</p>
          <button onClick={() => navigate("/cursos")}>Volver a cursos</button>
        </main>
        <Footer />
      </>
    );
  }

  if (!curso) {
    return (
      <>
        <Header />
        <main className="curso-detalle-page">
          <p>Cargando curso...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="curso-detalle-page">
        <h1>{curso.titulo}</h1>
        <img
          src={curso.imagen || "https://via.placeholder.com/600x400?text=Sin+Imagen"}
          alt={curso.titulo}
          style={{ maxWidth: "100%", borderRadius: 10 }}
        />
        <p><strong>Descripción:</strong> {curso.descripcion}</p>
        <p><strong>Categoría:</strong> {curso.categoria}</p>
        <p><strong>Nivel:</strong> {curso.nivel}</p>
        <p><strong>Duración:</strong> {curso.duracion}</p>
        <p><strong>Instructor:</strong> {curso.instructor}</p>
        <p><strong>Precio:</strong> {curso.precio || "Gratis"}</p>

        {!estaInscrito ? (
          <button onClick={handleInscribirse}>Inscribirme Gratis</button>
        ) : (
          <button onClick={() => navigate(`/curso-contenido?id=${curso.id}`)}>
            Ir al Curso
          </button>
        )}

        {mensaje && (
          <p className={mensaje.tipo === "success" ? "mensaje-exito" : "mensaje-error"}>
            {mensaje.texto}
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
