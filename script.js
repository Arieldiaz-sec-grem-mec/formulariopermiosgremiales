document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');
  const idpermisoInput = document.getElementById('idpermiso');
  const fechaSolicitudInput = document.getElementById('fecha_solicitud');

  // Generar un ID automático
  const generateID = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // Asignar el ID automáticamente
  idpermisoInput.value = generateID();

  // Asignar la fecha de solicitud automáticamente
  const currentDate = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
  fechaSolicitudInput.value = currentDate;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    // Enviar el formulario a Google Apps Script
    fetch(form.action, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        alert('Formulario enviado con éxito');
        form.reset();
      })
      .catch(error => {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al enviar el formulario');
      });
  });
});
