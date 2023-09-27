const confirmButton = document.getElementById("confirmButton");


  confirmButton.addEventListener("click", async function() {
    
    const userId = confirmButton.getAttribute("data-user");
    const cartId = confirmButton.getAttribute("data-cartid");
    const detailProducts = JSON.parse(confirmButton.getAttribute("data-products"))
    const noStockProduct = JSON.parse(confirmButton.getAttribute("data-noStockProduct"))

    try {
        const requestBody = {
            cartId: cartId,
            userId: userId,
            detailProducts:detailProducts,
            noStockProduct: noStockProduct
          };
      
      const response = await fetch(`/api/carts/purchase`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify(requestBody),
        });
    
      
      if (response.ok) {
        const responseData = await response.json()

        alert("Compra confirmada. ¡Gracias por tu compra!");
        window.open(`http://localhost:8080/api/tickets/${responseData.ticket}`);

        window.location.href = `http://localhost:8080/api/carts/${cartId}`; 

      }else {
        
        alert("No se pudo completar la compra.");
        
      }
    } catch (error) {
      
      console.error("Error al confirmar la compra:", error);
    }
  });