document.addEventListener('DOMContentLoaded', () => { 
  const form = document.getElementById('formulario');
  const idpermisoInput = document.getElementById('idpermiso');
  const fechaSolicitudInput = document.getElementById('fecha_solicitud');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');

  // Generar ID único para el permiso
  const generateID = () => Math.random().toString(36).substring(2, 15);
  idpermisoInput.value = generateID();

  // Formatear fecha a DD/MM/YYYY sin desfase
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`; // Convertir a formato DD/MM/YYYY
  };

  // Configurar la fecha de solicitud automáticamente
  const currentDate = new Date();
  const currentDay = String(currentDate.getDate()).padStart(2, '0');
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const currentYear = currentDate.getFullYear();
  fechaSolicitudInput.value = `${currentDay}/${currentMonth}/${currentYear}`;

  // Manejar el envío del formulario
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Mostrar la barra de progreso
    progressContainer.style.display = 'block';
    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 80) {
        progress += 5;
        progressBar.style.width = `${progress}%`;
      } else {
        clearInterval(interval);
      }
    }, 100);

    // Preparar datos para enviar
    const formData = new FormData(form);

    // Reemplazar las fechas con el formato correcto
    formData.set('fecha_permiso', formatDate(formData.get('fecha_permiso'))); 
    if (formData.get('fecha_permiso2')) {
      formData.set('fecha_permiso2', formatDate(formData.get('fecha_permiso2'))); 
    }

    // Enviar datos a Google Apps Script
    fetch(form.action, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        // Redirigir a URL con parámetros formateados
        const url = new URL('https://arieldiaz-sec-grem-mec.github.io/permisogremialappsheets/');
        url.searchParams.append('idpermiso', formData.get('idpermiso'));
        url.searchParams.append('nombre', formData.get('nombre'));
        url.searchParams.append('empresa', formData.get('empresa'));
        url.searchParams.append('fechaPermiso', formData.get('fecha_permiso'));
        url.searchParams.append('fechaPermiso2', formData.get('fecha_permiso2') || '');
        url.searchParams.append('fechaSolicitud', formData.get('fecha_solicitud'));

        window.location.href = url.toString();
        form.reset();
        progressContainer.style.display = 'none';
        alert('Formulario enviado con éxito');
      })
      .catch(error => {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al enviar el formulario');
        progressContainer.style.display = 'none';
      });
  });
});
