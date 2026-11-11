import { useEffect, useState } from 'react';
import {
  getAlumnos,
  getCursos,
  createAlumno,
  updateAlumno,
  deleteAlumno,
} from './api/alumnos';
import { getToken, logout } from './api/auth';
import AlumnoForm from './components/AlumnoForm';
import AlumnosTable from './components/AlumnosTable';
import Login from './components/Login';
import './App.css';

function App() {
  // Se inicializa con el token guardado: así, al recargar la página,
  // la sesión se mantiene sin volver a pedir las credenciales.
  const [token, setToken] = useState(getToken());
  const [alumnos, setAlumnos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null);

  function cerrarSesion() {
    logout();
    setToken(null);
    setAlumnos([]);
    setCursos([]);
    setEditando(null);
    setError('');
  }

  // Un solo lugar decide qué hacer con un error de la API, para que todas
  // las operaciones traten igual al token vencido: un 401 devuelve al login
  // en vez de mostrar un mensaje técnico que el usuario no puede resolver.
  function manejarError(err) {
    if (err.status === 401) {
      cerrarSesion();
    } else {
      setError(err.message);
    }
  }

  async function cargarAlumnos() {
    try {
      setCargando(true);
      setAlumnos(await getAlumnos());
      setError('');
    } catch (err) {
      manejarError(err);
    } finally {
      // finally corre siempre: así "Cargando..." nunca queda colgado.
      setCargando(false);
    }
  }

  // Los cursos se piden una sola vez por sesión: cambian muy poco, y no
  // hace falta recargarlos después de guardar o eliminar un alumno.
  async function cargarCursos() {
    try {
      setCursos(await getCursos());
    } catch (err) {
      manejarError(err);
    }
  }

  useEffect(() => {
    if (!token) return;
    cargarAlumnos();
    cargarCursos();
  }, [token]);

  async function guardar(datos) {
    try {
      if (editando) {
        await updateAlumno(editando.id, datos);
      } else {
        await createAlumno(datos);
      }
    } catch (err) {
      // El 401 se atiende acá (vuelve al login) y el error se relanza para
      // que AlumnoForm muestre sus propios mensajes de validación, como
      // un DNI duplicado o un email inválido.
      if (err.status === 401) cerrarSesion();
      throw err;
    }
    setEditando(null);
    cargarAlumnos();
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar este alumno?')) return;
    try {
      await deleteAlumno(id);
      cargarAlumnos();
    } catch (err) {
      manejarError(err);
    }
  }

  // El orden importa: primero se decide si hay sesión; si el chequeo de
  // "cargando" fuera antes, el login nunca se mostraría.
  if (!token) {
    return <Login onLogin={setToken} />;
  }

  return (
    <main className="contenedor">
      <button onClick={cerrarSesion}>Cerrar sesión</button>
      <h1>Gestión de alumnos</h1>

      <AlumnoForm
        // El key hace que React cree un formulario nuevo al cambiar de
        // alumno; sin él, los campos conservarían los datos del anterior.
        key={editando ? editando.id : 'nuevo'}
        alumno={editando}
        cursos={cursos}
        onGuardar={guardar}
        onCancelar={() => setEditando(null)}
      />

      {error && <p className="error">{error}</p>}

      {cargando ? (
        <p>Cargando alumnos…</p>
      ) : (
        <AlumnosTable
          alumnos={alumnos}
          onEditar={setEditando}
          onEliminar={eliminar}
        />
      )}
    </main>
  );
}

export default App;