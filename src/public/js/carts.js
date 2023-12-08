async function updateQuantity(url) {
  const productId = url.split('/').pop();
  const newQuantity = document.getElementById(`quantity-${productId}`).value;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (response.ok) {
              
                const data = await response.json();
                window.location.reload(); 
            } else {
                console.error('Error updating quantity');
            }
        } catch (error) {
            console.error(error);
        }
}

async function removeProductFromCart(url) {
  try {
      const response = await fetch(url, {
          method: 'DELETE'
      });

      if (response.ok) {
        const data = await response.json();
          
          window.location.reload(); 
      } else {
          console.error('Error removing product from cart');
      }
  } catch (error) {
      console.error(error);
  }
}

async function emptyCart(url) {
  try {
   
      const response = await fetch(url, {
          method: 'DELETE'
      });
      window.location.reload(); 
      if (response.ok) {
          const data = await response.json();
          
      } else {
          console.error('Error emptying cart');
      }
  } catch (error) {
      console.error(error);
  }
}

async function goToProducts(cid) {
    const cartId = cid;
    const baseUrl = window.location.origin;
    const productsUrl = '/api/products'; // Ruta relativa desde la base

    const fullUrl = `${baseUrl}${productsUrl}?cartId=${cartId}`;
    window.location.href = fullUrl;
    
}

