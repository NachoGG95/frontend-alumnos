// La URL se exporta desde acá para que alumnos.js la reutilice
// y exista un único lugar donde cambiarla.
// Si existe VITE_API_URL en el .env del frontend, se usa esa; si no, localhost.
// Así el proyecto arranca sin configuración extra, pero se puede apuntar
// a otro servidor sin tocar el código.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Constante para no escribir el nombre de la clave a mano en cada uso:
// un error de tipeo fallaría en silencio.
const CLAVE_TOKEN = 'access_token';

export async function login(usuario, password) {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password }),
  });

  // fetch no lanza error con un 401: hay que chequearlo a mano.
  if (!respuesta.ok) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const { access_token } = await respuesta.json();
  localStorage.setItem(CLAVE_TOKEN, access_token);
  return access_token;
}

export function getToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function logout() {
  localStorage.removeItem(CLAVE_TOKEN);
}