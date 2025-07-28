import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/profesor.css";

export default function Profesor() {
  // ---------------------------
  // Estados principales
  // ---------------------------
  const [cursos, setCursos] = useState([]);
  const [entregasTareas, setEntregasTareas] = useState({});

  // Estado para agregar/editar curso
  const [nuevoCurso, setNuevoCurso] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    nivel: "",
    duracion: "",
    instructor: "",
    imagen: "",
    modulos: [],
  });
  const [editandoId, setEditandoId] = useState(null);

  // Estados para módulos y tareas
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [nuevoModuloTitulo, setNuevoModuloTitulo] = useState("");
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
  const [nuevaTareaTitulo, setNuevaTareaTitulo] = useState("");
  const [nuevaTareaDescripcion, setNuevaTareaDescripcion] = useState("");

  // ✅ Estados para edición
  const [editandoModulo, setEditandoModulo] = useState(null);
  const [editandoModuloTitulo, setEditandoModuloTitulo] = useState("");
  const [editandoTarea, setEditandoTarea] = useState(null);
  const [editandoTareaTitulo, setEditandoTareaTitulo] = useState("");
  const [editandoTareaDescripcion, setEditandoTareaDescripcion] = useState("");

  // Ver estudiantes inscritos
  const [cursoVerEstudiantes, setCursoVerEstudiantes] = useState(null);

  // ---------------------------
  // Cargar datos
  // ---------------------------
  useEffect(() => {
    setCursos(JSON.parse(localStorage.getItem("cursos")) || []);
    setEntregasTareas(JSON.parse(localStorage.getItem("entregasTareas")) || {});
  }, []);

  // ---------------------------
  // Guardar datos
  // ---------------------------
  const guardarCursos = (nuevos) => {
    setCursos(nuevos);
    localStorage.setItem("cursos", JSON.stringify(nuevos));
  };

  const guardarEntregas = (nuevas) => {
    setEntregasTareas(nuevas);
    localStorage.setItem("entregasTareas", JSON.stringify(nuevas));
  };

  // ---------------------------
  // Cursos
  // ---------------------------
  const handleChangeCurso = (e) => {
    setNuevoCurso({ ...nuevoCurso, [e.target.name]: e.target.value });
  };

  const handleAgregarCurso = (e) => {
    e.preventDefault();
    const { titulo, descripcion, categoria, nivel, duracion, instructor } = nuevoCurso;
    if (!titulo || !descripcion || !categoria || !nivel || !duracion || !instructor) {
      return alert("Completa todos los campos");
    }
    const nuevos = editandoId
      ? cursos.map((c) => (c.id === editandoId ? { ...nuevoCurso, id: editandoId } : c))
      : [...cursos, { ...nuevoCurso, id: Date.now(), modulos: [] }];
    guardarCursos(nuevos);
    setEditandoId(null);
    setNuevoCurso({ titulo: "", descripcion: "", categoria: "", nivel: "", duracion: "", instructor: "", imagen: "", modulos: [] });
  };

  const handleEditarCurso = (curso) => {
    setNuevoCurso({ ...curso });
    setEditandoId(curso.id);
  };

  const handleEliminarCurso = (id) => {
    if (!window.confirm("¿Eliminar este curso?")) return;
    guardarCursos(cursos.filter((c) => c.id !== id));
  };

  // ---------------------------
  // Módulos
  // ---------------------------
  const agregarModulo = () => {
    if (!nuevoModuloTitulo.trim()) return alert("Ingresa un título");
    const nuevos = cursos.map((c) =>
      c.id === cursoSeleccionado
        ? { ...c, modulos: [...c.modulos, { id: Date.now(), titulo: nuevoModuloTitulo, tareas: [] }] }
        : c
    );
    guardarCursos(nuevos);
    setNuevoModuloTitulo("");
    setCursoSeleccionado(null);
  };

  const eliminarModulo = (cursoId, moduloId) => {
    if (!window.confirm("¿Eliminar módulo y sus tareas?")) return;
    const nuevos = cursos.map((c) =>
      c.id === cursoId ? { ...c, modulos: c.modulos.filter((m) => m.id !== moduloId) } : c
    );
    guardarCursos(nuevos);
  };

  // ✅ Guardar edición de módulo
  const guardarEdicionModulo = (cursoId) => {
    const nuevos = cursos.map((c) =>
      c.id === cursoId
        ? { ...c, modulos: c.modulos.map((m) => (m.id === editandoModulo ? { ...m, titulo: editandoModuloTitulo } : m)) }
        : c
    );
    guardarCursos(nuevos);
    setEditandoModulo(null);
    setEditandoModuloTitulo("");
  };

  // ---------------------------
  // Tareas
  // ---------------------------
  const agregarTarea = () => {
    if (!nuevaTareaTitulo.trim()) return alert("Ingresa un título de tarea");
    const nuevos = cursos.map((c) =>
      c.modulos.some((m) => m.id === moduloSeleccionado)
        ? {
            ...c,
            modulos: c.modulos.map((m) =>
              m.id === moduloSeleccionado ? { ...m, tareas: [...m.tareas, { id: Date.now(), titulo: nuevaTareaTitulo, descripcion: nuevaTareaDescripcion }] } : m
            ),
          }
        : c
    );
    guardarCursos(nuevos);
    setModuloSeleccionado(null);
    setNuevaTareaTitulo("");
    setNuevaTareaDescripcion("");
  };

  const eliminarTarea = (cursoId, moduloId, tareaId) => {
    if (!window.confirm("¿Eliminar esta tarea?")) return;
    const nuevos = cursos.map((c) =>
      c.id === cursoId
        ? { ...c, modulos: c.modulos.map((m) => (m.id === moduloId ? { ...m, tareas: m.tareas.filter((t) => t.id !== tareaId) } : m)) }
        : c
    );
    guardarCursos(nuevos);
  };

  // ✅ Guardar edición de tarea
  const guardarEdicionTarea = (cursoId, moduloId) => {
    const nuevos = cursos.map((c) =>
      c.id === cursoId
        ? {
            ...c,
            modulos: c.modulos.map((m) =>
              m.id === moduloId
                ? {
                    ...m,
                    tareas: m.tareas.map((t) =>
                      t.id === editandoTarea ? { ...t, titulo: editandoTareaTitulo, descripcion: editandoTareaDescripcion } : t
                    ),
                  }
                : m
            ),
          }
        : c
    );
    guardarCursos(nuevos);
    setEditandoTarea(null);
    setEditandoTareaTitulo("");
    setEditandoTareaDescripcion("");
  };

  // ---------------------------
  // Calificar entregas
  // ---------------------------
  const manejarCalificarEntrega = (cursoId, moduloId, tareaId, correo, calificacion, estado) => {
    const entregas = JSON.parse(localStorage.getItem("entregasTareas")) || {};
    if (!entregas[correo]) entregas[correo] = {};
    if (!entregas[correo][cursoId]) entregas[correo][cursoId] = {};
    if (!entregas[correo][cursoId][moduloId]) entregas[correo][cursoId][moduloId] = {};
    if (!entregas[correo][cursoId][moduloId][tareaId]) entregas[correo][cursoId][moduloId][tareaId] = {};
    entregas[correo][cursoId][moduloId][tareaId].estado = estado;
    entregas[correo][cursoId][moduloId][tareaId].calificacion = calificacion;
    guardarEntregas(entregas);
  };

  // ---------------------------
  // Obtener estudiantes
  // ---------------------------
  const obtenerEstudiantesInscritos = (cursoId) => {
    const inscritos = JSON.parse(localStorage.getItem("allUsersCursosInscritos")) || {};
    return Object.keys(inscritos).filter((correo) => inscritos[correo].includes(cursoId));
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <>
      <Header />
      <div className="profesor-dashboard">
        <div className="profesor-container">
          <h2>{editandoId ? "Editar Curso" : "Agregar Nuevo Curso"}</h2>

          {/* Formulario curso */}
          <form onSubmit={handleAgregarCurso} className="formulario-curso">
            <input name="titulo" value={nuevoCurso.titulo} onChange={handleChangeCurso} placeholder="Título" />
            <textarea name="descripcion" value={nuevoCurso.descripcion} onChange={handleChangeCurso} placeholder="Descripción" />
            <input name="categoria" value={nuevoCurso.categoria} onChange={handleChangeCurso} placeholder="Categoría" />
            <select name="nivel" value={nuevoCurso.nivel} onChange={handleChangeCurso}>
              <option value="">Nivel</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
            <input name="duracion" value={nuevoCurso.duracion} onChange={handleChangeCurso} placeholder="Duración" />
            <input name="instructor" value={nuevoCurso.instructor} onChange={handleChangeCurso} placeholder="Instructor" />
            <input name="imagen" value={nuevoCurso.imagen} onChange={handleChangeCurso} placeholder="URL imagen" />
            <button type="submit">{editandoId ? "Guardar" : "Agregar Curso"}</button>
          </form>

          {/* Listado cursos */}
          {cursos.length === 0 && <p>No hay cursos creados.</p>}
          {cursos.map((curso) => (
            <div key={curso.id} className="card-curso">
              <h3>{curso.titulo}</h3>
              {curso.imagen && (
  <img
    src={curso.imagen}
    alt={`Imagen del curso ${curso.titulo}`}
    className="imagen-curso"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "https://via.placeholder.com/150?text=No+Image";
    }}
  />
)}

              <div className="acciones">
                <button onClick={() => handleEditarCurso(curso)}>✏️ Editar</button>
                <button onClick={() => handleEliminarCurso(curso.id)}>🗑 Eliminar</button>
                <button onClick={() => setCursoSeleccionado(curso.id)}>+ Módulo</button>
              </div>

              {/* Agregar módulo */}
              {cursoSeleccionado === curso.id && (
                <div>
                  <input value={nuevoModuloTitulo} onChange={(e) => setNuevoModuloTitulo(e.target.value)} placeholder="Nuevo módulo" />
                  <button onClick={agregarModulo}>Agregar</button>
                </div>
              )}

              {/* Módulos */}
              {curso.modulos.map((mod) => (
                <div key={mod.id} className="modulo-item">
                  {editandoModulo === mod.id ? (
                    <div>
                      <input value={editandoModuloTitulo} onChange={(e) => setEditandoModuloTitulo(e.target.value)} />
                      <button onClick={() => guardarEdicionModulo(curso.id)}>💾 Guardar</button>
                      <button onClick={() => setEditandoModulo(null)}>❌ Cancelar</button>
                    </div>
                  ) : (
                    <div>
                      <strong>{mod.titulo}</strong>
                      <button onClick={() => { setEditandoModulo(mod.id); setEditandoModuloTitulo(mod.titulo); }}>✏️ Editar</button>
                      <button onClick={() => eliminarModulo(curso.id, mod.id)}>🗑 Eliminar</button>
                      <button onClick={() => setModuloSeleccionado(mod.id)}>+ Tarea</button>
                    </div>
                  )}

                  {/* Agregar tarea */}
                  {moduloSeleccionado === mod.id && (
                    <div>
                      <input value={nuevaTareaTitulo} onChange={(e) => setNuevaTareaTitulo(e.target.value)} placeholder="Título tarea" />
                      <textarea value={nuevaTareaDescripcion} onChange={(e) => setNuevaTareaDescripcion(e.target.value)} placeholder="Descripción" />
                      <button onClick={agregarTarea}>Agregar Tarea</button>
                    </div>
                  )}

                  {/* Listar tareas */}
                  <ul>
                    {mod.tareas.map((t) => (
                      <li key={t.id}>
                        {editandoTarea === t.id ? (
                          <>
                            <input value={editandoTareaTitulo} onChange={(e) => setEditandoTareaTitulo(e.target.value)} />
                            <textarea value={editandoTareaDescripcion} onChange={(e) => setEditandoTareaDescripcion(e.target.value)} />
                            <button onClick={() => guardarEdicionTarea(curso.id, mod.id)}>💾 Guardar</button>
                            <button onClick={() => setEditandoTarea(null)}>❌ Cancelar</button>
                          </>
                        ) : (
                          <>
                            <span>{t.titulo} - {t.descripcion}</span>
                            <button onClick={() => { setEditandoTarea(t.id); setEditandoTareaTitulo(t.titulo); setEditandoTareaDescripcion(t.descripcion); }}>✏️ Editar</button>
                            <button onClick={() => eliminarTarea(curso.id, mod.id, t.id)}>🗑 Eliminar</button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
