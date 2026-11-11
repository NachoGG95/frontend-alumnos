function AlumnosTable({ alumnos, onEditar, onEliminar }) {
  if (alumnos.length === 0) {
    return <p>Todavía no hay alumnos cargados.</p>;
  }

  return (
    <table className="tabla">
      <thead>
        <tr>
          <th>Nombre</th><th>Apellido</th><th>DNI</th>
          <th>Email</th><th>Curso</th><th></th>
        </tr>
      </thead>
      <tbody>
        {alumnos.map((alumno) => (
          <tr key={alumno.id}>
            <td>{alumno.nombre}</td>
            <td>{alumno.apellido}</td>
            <td>{alumno.dni}</td>
            <td>{alumno.email}</td>
            <td>{alumno.curso?.nombre}</td>
            <td>
              <div className="acciones">
                <button onClick={() => onEditar(alumno)}>Editar</button>
                <button className="secundario" onClick={() => onEliminar(alumno.id)}>
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AlumnosTable;