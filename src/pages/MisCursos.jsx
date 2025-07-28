import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/misCursos.css";

export default function MisCursos() {
  const [usuario, setUsuario] = useState(null);
  const [cursosInscritos, setCursosInscritos] = useState([]);
  const [entregas, setEntregas] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!u) {
      alert("Debes iniciar sesión para ver tus cursos.");
      navigate("/login");
      return;
    }
    setUsuario(u);

    const cursos = JSON.parse(localStorage.getItem("cursos")) || [];
    const allInscritos = JSON.parse(localStorage.getItem("allUsersCursosInscritos")) || {};
    const cursosUsuario = allInscritos[u.correo] || [];
    const filtrados = cursos.filter((curso) => cursosUsuario.includes(curso.id));
    setCursosInscritos(filtrados);

    const entregasTareas = JSON.parse(localStorage.getItem("entregasTareas")) || {};
    setEntregas(entregasTareas[u.correo] || {});
  }, [navigate]);

  // Calcula progreso de un curso
  const calcularProgresoCurso = (curso) => {
    if (!curso.modulos.length) return 0;
    let total = 0;
    let completadas = 0;

    curso.modulos.forEach((mod) => {
      mod.tareas.forEach((t) => {
        total++;
        const entrega = entregas[curso.id]?.[mod.id]?.[t.id];
        if (entrega && (entrega.estado === "Enviado" || entrega.estado === "Aprobado")) {
          completadas++;
        }
      });
    });

    return total === 0 ? 0 : Math.round((completadas / total) * 100);
  };

  return (
    <>
      <Header />
      <main className="mis-cursos">
        <h1>📚 Mis Cursos</h1>

        {cursosInscritos.length === 0 ? (
          <p className="no-cursos">No estás inscrito en ningún curso aún.</p>
        ) : (
          <div className="lista-micursos">
            {cursosInscritos.map((curso) => {
              const progreso = calcularProgresoCurso(curso);
              return (
                <div key={curso.id} className="curso-card">
                  {curso.imagen && <img src={curso.imagen} alt={curso.titulo} className="curso-img" />}
                  <div className="curso-body">
                    <h2>{curso.titulo}</h2>
                    <p>{curso.descripcion}</p>

                    {/* Barra de progreso */}
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${progreso}%` }}></div>
                    </div>
                    <span className="progress-text">{progreso}% completado</span>

                    <Link to={`/curso-contenido?id=${curso.id}`} className="btn-ver">
                      Ver Contenido
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
