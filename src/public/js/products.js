import Products from "../../dao/fileManager/ProductManager.js";

const products = new Products();

async function addToCart(code) {

    let product = await products.getByCode(code);
    let id=product.id;
    let carrito = "64d1833895417b493b556bbb";
    postCart(id, carrito)
      .then((dato) => {
        alert("producto agregado al carrito", dato);
      })
      .catch((err) => console.log(err, "no se agrego el producto "));
  }
  
  async function postCart(id, carrito) {
    try {
      const response = await fetch(`/${carrito}/product/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }