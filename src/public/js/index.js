const socket = io();

socket.on("addProduct", (newProduct) => {
  const productList = document.getElementById("productList");
  const li = document.createElement("li");
  li.innerHTML = `
    <h3>${newProduct.name}</h3>
    <p>Título: ${newProduct.title}</p>
    <p>Descripción: ${newProduct.description}</p>
    <p>Precio: ${newProduct.price}</p>
    <p>Thumbnail: ${newProduct.thumbnail}</p>
  `;
  productList.appendChild(li);
});
