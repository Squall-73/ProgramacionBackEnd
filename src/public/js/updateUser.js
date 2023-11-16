document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const backButton = document.getElementById('go-back');
  
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const userId = document.getElementById('user').textContent;

    try {
      const formData = new FormData(form);
      const response = await fetch(`/api/users/${userId}/documents`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('Documentos subidos correctamente y usuario actualizado a Premium');
          const cartId = document.getElementById('cartId').textContent.trim();
          window.location.href = `/api/products?cartId=${cartId}`;
        } else {
          alert('No se ha terminado de cargar la documentación');
        }
      } else {
        alert('Hubo un error al subir los documentos');
      }
    } catch (error) {
      console.error('Error al subir los documentos:', error);
      alert('Hubo un error al subir los documentos');
    }
  });

  document.getElementById("go-back").addEventListener("click", function () {
    history.back();
  });
});