
function updateProduct(productId) {
    const title = document.getElementById(`title-${productId}`).value;
    const description = document.getElementById(`description-${productId}`).value;
    const price = document.getElementById(`price-${productId}`).value;
    const thumbnail = document.getElementById(`thumbnail-${productId}`).value;
    const stock = document.getElementById(`stock-${productId}`).value;
  
    
    const data = {
      title: title,
      description: description,
      price:price,
      thumbnail:thumbnail,
      stock:stock
    };
  
  
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  
    
    fetch(`/api/products/${productId}`, options)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error en la solicitud');
        }
      })
      .then(data => {
        console.log(data);
        window.location.reload(); 
      })
      .catch(error => {
        
        console.error(error);
      });
  }

  function deleteProduct(productId) {
    const confirmation = confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmation) {
      fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            console.log("Producto eliminado con éxito");
            window.location.reload();
          } else {
            throw new Error('Error en la solicitud de eliminación');
          }
        })
        .catch(error => {
          
          console.error(error);
        });
    }
  }

  function activateProduct(productId) {
    const confirmation = confirm("¿Estás seguro de que deseas reactivar este producto?");
    if (confirmation) {
      fetch(`/api/products/${productId}/activate`, {
        method: 'put',
      })
        .then(response => {
          if (response.ok) {
            console.log("Producto reactivado con éxito");
            window.location.reload();
          } else {
            throw new Error('Error en la solicitud de reactivación');
          }
        })
        .catch(error => {
          
          console.error(error);
        });
    }
  }

  function addProduct(productId) {
    const title = document.getElementById(`title-${productId}`).value;
    const description = document.getElementById(`description-${productId}`).value;
    const price = document.getElementById(`price-${productId}`).value;
    const thumbnail = document.getElementById(`thumbnail-${productId}`).value;
    const stock = document.getElementById(`stock-${productId}`).value;
    const code = document.getElementById(`code-${productId}`).value;

    const data = {
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        stock: stock,
        code: code
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch('/api/products', options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error en la solicitud');
            }
        })
        .then(data => {
            console.log(data);
            alert('Producto agregado correctamente')
            window.location.href = 'http://localhost:8080/api/products';

        })
        .catch(error => {
            console.error(error);
        });
}
