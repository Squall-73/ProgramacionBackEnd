document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const backButton = document.getElementById('go-back');
    
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const userId = document.getElementById('user').textContent;
  
      try {
        const formData = new FormData(form);
        await fetch(`/api/users/${userId}/documents`, {
          method: 'POST',
          body: formData
        });
  
        alert('Documentos subidos correctamente');
        const cartId = document.getElementById('cartId').textContent.trim();
        window.location.href = `/api/products?cartId=${cartId}`
      } catch (error) {
        console.error('Error al subir los documentos:', error);
        alert('Hubo un error al subir los documentos');
      }
    });
  

document.getElementById("go-back").addEventListener("click", function () {
    history.back();
});
});