import { useState } from 'react';
import { login } from '../api/auth';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function manejarEnvio(evento) {
    // Sin esto el navegador recarga la página al enviar el formulario
    // y se pierde el estado de React.
    evento.preventDefault();
    setError('');

    try {
      const token = await login(usuario, password);
      onLogin(token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={manejarEnvio}>
      <h1>Iniciar sesión</h1>
      <input
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default Login;