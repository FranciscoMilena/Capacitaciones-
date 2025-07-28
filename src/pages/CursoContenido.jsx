import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/cursoContenido.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CursoContenido() {
  const query = useQuery();
  const cursoId = query.get("id");
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [entregas, setEntregas] = useState({});
  const [nuevoContenido, setNuevoContenido] = useState({});
  const [archivosAdjuntos, setArchivosAdjuntos] = useState({});
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!u || u.rol !== "estudiante") {
      alert("Debes iniciar sesión como estudiante para acceder");
      navigate("/login");
      return;
    }
    setUsuario(u);

    const cursos = JSON.parse(localStorage.getItem("cursos")) || [];
    const c = cursos.find((c) => String(c.id) === String(cursoId));
    if (!c) {
      alert("Curso no encontrado");
      navigate("/cursos");
      return;
    }
    setCurso(c);

    const allInscritos = JSON.parse(localStorage.getItem("allUsersCursosInscritos")) || {};
    const cursosUsuario = allInscritos[u.correo] || [];
    if (!cursosUsuario.includes(c.id)) {
      alert("No estás inscrito en este curso");
      navigate("/cursos");
      return;
    }

    const entregasTareas = JSON.parse(localStorage.getItem("entregasTareas")) || {};
    const entregasUsuario = entregasTareas[u.correo] || {};
    const entregasCurso = entregasUsuario[cursoId] || {};
    setEntregas(entregasCurso);
  }, [cursoId, navigate]);

  if (!curso) return (
    <>
      <Header />
      <main style={{ padding: "2rem" }}>
        <p>Cargando curso...</p>
      </main>
      <Footer />
    </>
  );

  // ✅ Calcular progreso basado solo en tareas APROBADAS
  const calcularProgreso = () => {
    if (!curso || curso.modulos.length === 0) return 0;
    let totalTareas = 0;
    let tareasCompletadas = 0;

    curso.modulos.forEach((modulo) => {
      modulo.tareas.forEach((tarea) => {
        totalTareas++;
        const tareaEntrega = entregas[modulo.id]?.[tarea.id];
        if (tareaEntrega && tareaEntrega.estado === "Aprobado") {
          tareasCompletadas++;
        }
      });
    });

    if (totalTareas === 0) return 0;
    return Math.round((tareasCompletadas / totalTareas) * 100);
  };

  const progreso = calcularProgreso();

  // ✅ Manejar cambio de texto de entrega
  const handleCambioContenido = (moduloId, tareaId, valor) => {
    setNuevoContenido({
      ...nuevoContenido,
      [`${moduloId}_${tareaId}`]: valor,
    });
  };

  // ✅ Manejar selección de archivo
  const handleSeleccionArchivo = (moduloId, tareaId, archivo) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setArchivosAdjuntos((prev) => ({
        ...prev,
        [`${moduloId}_${tareaId}`]: {
          nombre: archivo.name,
          data: reader.result
        }
      }));
    };
    reader.readAsDataURL(archivo);
  };

  // ✅ Manejar envío de entrega (texto + archivo)
  const handleEnviarEntrega = (moduloId, tareaId) => {
    if (!nuevoContenido[`${moduloId}_${tareaId}`] && !archivosAdjuntos[`${moduloId}_${tareaId}`]) {
      setMensaje({ texto: "Debes escribir algo o adjuntar un archivo.", tipo: "error" });
      return;
    }

    const entregasTareas = JSON.parse(localStorage.getItem("entregasTareas")) || {};
    if (!entregasTareas[usuario.correo]) entregasTareas[usuario.correo] = {};
    if (!entregasTareas[usuario.correo][cursoId]) entregasTareas[usuario.correo][cursoId] = {};
    if (!entregasTareas[usuario.correo][cursoId][moduloId]) entregasTareas[usuario.correo][cursoId][moduloId] = {};

    entregasTareas[usuario.correo][cursoId][moduloId][tareaId] = {
      contenidoEntrega: nuevoContenido[`${moduloId}_${tareaId}`] || "",
      archivo: archivosAdjuntos[`${moduloId}_${tareaId}`] || null,
      estado: "Enviado",
      calificacion: null,
      comentarioProfesor: null,
    };

    localStorage.setItem("entregasTareas", JSON.stringify(entregasTareas));
    setEntregas(entregasTareas[usuario.correo][cursoId]);

    // limpiar campos temporales
    setNuevoContenido((prev) => {
      const copia = { ...prev };
      delete copia[`${moduloId}_${tareaId}`];
      return copia;
    });

    setArchivosAdjuntos((prev) => {
      const copia = { ...prev };
      delete copia[`${moduloId}_${tareaId}`];
      return copia;
    });

    setMensaje({ texto: "Entrega enviada con éxito.", tipo: "success" });
  };

  // ✅ Descargar certificado
  const handleDescargarCertificado = () => {
    const contenido = `
    🎓 CERTIFICADO DE FINALIZACIÓN 🎓
    
    Se certifica que ${usuario.nombre} ha completado exitosamente el curso:
    "${curso.titulo}"
    
    Fecha: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([contenido], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Certificado_${curso.titulo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header />
      <main className="curso-contenido">
        <h1>{curso.titulo}</h1>

        {/* ✅ Barra de progreso */}
        <div className="barra-progreso-container">
          <p className="barra-progreso-label">Progreso del curso: {progreso}%</p>
          <div className="barra-progreso-fondo">
            <div
              className={`barra-progreso-llenado ${progreso >= 70 ? "exito" : ""}`}
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
        </div>

        {/* ✅ Mensaje de progreso */}
        {progreso >= 70 && progreso < 100 && (
          <p className="mensaje-progreso">
            ¡Has avanzado más del 70%! Estás cerca de completar el curso.
          </p>
        )}

        {/* ✅ Mensaje y botón de certificado cuando se completa */}
        {progreso === 100 && (
          <div className="curso-completado">
            <h2>🎉 Curso Completado con Éxito</h2>
            <button className="btn-certificado" onClick={handleDescargarCertificado}>
              📄 Descargar Certificado
            </button>
          </div>
        )}

        {/* Renderizado de módulos */}
        {curso.modulos.length === 0 && <p>Este curso no tiene módulos.</p>}

        {curso.modulos.map((modulo) => (
          <section key={modulo.id} className="modulo">
            <h2>Módulo: {modulo.titulo}</h2>

            {modulo.tareas.length === 0 && <p>No hay tareas en este módulo.</p>}

            {modulo.tareas.map((tarea) => {
              const tareaEntrega = entregas[modulo.id]?.[tarea.id] || null;
              return (
                <div key={tarea.id} className="tarea">
                  <h3>{tarea.titulo}</h3>
                  <p>{tarea.descripcion}</p>

                  {tareaEntrega ? (
                    <div>
                      <p><strong>Estado:</strong> {tareaEntrega.estado}</p>
                      <p><strong>Calificación:</strong> {tareaEntrega.calificacion ?? "Pendiente"}</p>
                      <p><strong>Tu entrega:</strong> {tareaEntrega.contenidoEntrega || "No escribiste texto"}</p>

                      {/* ✅ Mostrar archivo subido */}
                      {tareaEntrega.archivo && (
                        <p>
                          <strong>Archivo enviado:</strong>{" "}
                          <a href={tareaEntrega.archivo.data} download={tareaEntrega.archivo.nombre}>
                            {tareaEntrega.archivo.nombre}
                          </a>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        placeholder="Escribe tu entrega aquí..."
                        value={nuevoContenido[`${modulo.id}_${tarea.id}`] || ""}
                        onChange={(e) => handleCambioContenido(modulo.id, tarea.id, e.target.value)}
                        rows={4}
                      />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={(e) => handleSeleccionArchivo(modulo.id, tarea.id, e.target.files[0])}
                      />
                      <button onClick={() => handleEnviarEntrega(modulo.id, tarea.id)}>
                        Enviar Entrega
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}

        {mensaje && (
          <p style={{ color: mensaje.tipo === "success" ? "green" : "red" }}>
            {mensaje.texto}
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
