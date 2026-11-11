import { useState } from 'react';

const VACIO = {
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  telefono: '',
  cursoId: '',
};

// El alumno de la lista trae "id" y "curso" (un objeto), pero el DTO del
// backend espera "cursoId" (un número). Por eso el estado se arma campo por
// campo en lugar de copiar el alumno entero con "...alumno".
function desdeAlumno(alumno) {
  if (!alumno) return VACIO;

  return {
    nombre: alumno.nombre,
    apellido: alumno.apellido,
    dni: alumno.dni,
    email: alumno.email,
    telefono: alumno.telefono ?? '',
    cursoId: alumno.curso?.id ?? '',
  };
}

// "cursos" llega por props desde App, que es quien pide la lista a la API.
function AlumnoForm({ alumno, cursos, onGuardar, onCancelar }) {
  const [form, setForm] = useState(desdeAlumno(alumno));
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Se valida acá porque Number('') da 0: el backend lo aceptaría como
    // número, pero no existe un curso con id 0 y fallaría más adentro.
    if (!form.cursoId) {
      setError('Elegí un curso');
      return;
    }

    try {
      await onGuardar({
        nombre: form.nombre,
        apellido: form.apellido,
        dni: form.dni,
        email: form.email,
        telefono: form.telefono,
        // Un <select> siempre entrega texto, y el DTO usa @IsNumber().
        cursoId: Number(form.cursoId),
      });
      setForm(VACIO);
      setError('');
    } catch (err) {
      // err.message ya trae los mensajes de validación de Nest unidos
      // por request() en alumnos.js.
      setError(err.message);
    }
  }

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h2>{alumno ? 'Editar alumno' : 'Nuevo alumno'}</h2>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
      <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />
      <input name="dni" placeholder="DNI" value={form.dni} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />

      <select name="cursoId" value={form.cursoId} onChange={handleChange}>
        <option value="">Seleccioná un curso</option>
        {cursos.map((curso) => (
          <option key={curso.id} value={curso.id}>
            {curso.nombre}
          </option>
        ))}
      </select>

      {error && <p className="error">{error}</p>}

      <button type="submit">{alumno ? 'Guardar cambios' : 'Crear alumno'}</button>
      {alumno && (
        <button type="button" className="secundario" onClick={onCancelar}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default AlumnoForm;