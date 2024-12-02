document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');
  const idpermisoInput = document.getElementById('idpermiso');
  const fechaSolicitudInput = document.getElementById('fecha_solicitud');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');

  // Función para generar un ID aleatorio para el permiso
  const generateID = () => {
    return Math.random().toString(36).substring(2, 15); // ID único
  };

  // Asignar el ID automáticamente al campo "idpermiso"
  idpermisoInput.value = generateID();

  // Función para formatear la fecha en formato DD/MM/YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Día con 2 dígitos
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Mes con 2 dígitos
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Asignar la fecha de solicitud automáticamente con el formato deseado
  const currentDate = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
  fechaSolicitudInput.value = currentDate;
  // Mostrar la fecha formateada en el formulario si es necesario
  document.getElementById("fecha_solicitud").value = formatDate(currentDate); // Guardar fecha en formato DD/MM/YYYY

  // Manejar el envío del formulario
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto (enviar)

    // Mostrar la barra de progreso
    progressContainer.style.display = 'block';

    // Enviar los datos a Google Sheets
    const formData = new FormData(form);

    // Actualizar la barra de progreso
    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 80) {
        progress += 5;
        progressBar.style.width = `${progress}%`;
      } else {
        clearInterval(interval);
      }
    }, 100);

    // Enviar los datos a Google Apps Script
    fetch(form.action, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        // Enviar los datos a la web externa con parámetros
        const url = new URL('https://arieldiaz-sec-grem-mec.github.io/permisogremialappsheets/');
        url.searchParams.append('idpermiso', formData.get('idpermiso'));
        url.searchParams.append('nombre', formData.get('nombre'));
        url.searchParams.append('empresa', formData.get('empresa'));
        url.searchParams.append('fechaPermiso', formatDate(formData.get('fecha_permiso')));
        url.searchParams.append('fechaPermiso2', formData.get('fecha_permiso2') ? formatDate(formData.get('fecha_permiso2')) : '');
        url.searchParams.append('fechaSolicitud', formatDate(formData.get('fecha_solicitud')));

        // Redirigir al usuario a la web externa con los datos cargados
        window.location.href = url.toString();

        // Resetear el formulario
        form.reset();
        // Ocultar la barra de progreso
        progressContainer.style.display = 'none';

        alert('Formulario enviado con éxito');
      })
      .catch(error => {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al enviar el formulario');
        progressContainer.style.display = 'none'; // Ocultar barra de progreso si hay un error
      });
  });
});
