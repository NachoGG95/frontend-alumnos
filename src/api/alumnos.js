import { API_URL, getToken } from './auth';

async function request(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    // Los headers se arman DESPUÉS del spread de opciones: si fuera al revés,
    // un "headers" dentro de opciones reemplazaría todo el objeto y se perdería el token.
    headers: {
      'Content-Type': 'application/json',
      // "Bearer" es el esquema que espera ExtractJwt.fromAuthHeaderAsBearerToken()
      // en la JwtStrategy del backend.
      Authorization: `Bearer ${getToken()}`,
      ...opciones.headers,
    },
  });

  // El catch evita que explote cuando la respuesta no trae cuerpo
  // (por ejemplo, un DELETE), ya que .json() fallaría con un cuerpo vacío.
  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    // Cuando falla la validación de un DTO, Nest devuelve "message" como
    // arreglo de textos; se unen para mostrarlos en una sola línea.
    const mensaje = Array.isArray(datos?.message)
      ? datos.message.join(' · ')
      : datos?.message;

    const error = new Error(mensaje || `Error ${respuesta.status}`);
    // Se guarda el código para que App distinga un token vencido (401)
    // de otros fallos, como el servidor caído.
    error.status = respuesta.status;
    throw error;
  }

  return datos;
}

export const getAlumnos = () => request('/alumnos');

export const createAlumno = (alumno) =>
  request('/alumnos', { method: 'POST', body: JSON.stringify(alumno) });

export const updateAlumno = (id, cambios) =>
  request(`/alumnos/${id}`, { method: 'PATCH', body: JSON.stringify(cambios) });

export const deleteAlumno = (id) =>
  request(`/alumnos/${id}`, { method: 'DELETE' });

export const getCursos = () => request('/cursos');