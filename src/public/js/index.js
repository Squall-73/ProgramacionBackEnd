const socket = io();

const productListContainer = document.createElement("div");
productListContainer.id = "productList";

document.body.appendChild(productListContainer);

socket.on("addProduct", (newProduct) => {
  const productList = document.getElementById("productList");
  
  const div = document.createElement("div");
  
  div.innerHTML = `
    <p><b>ID:</b>${newProduct.id}</p>
    <p><b>Title:</b> ${newProduct.title}</p>
    <p><b>Description:</b> ${newProduct.description}</p>
    <p><b>Price:</b> ${newProduct.price}</p> `
    if(newProduct.thumbnail){
      div.innerHTML+=`<p><b>Thumbnail:</b> ${newProduct.thumbnail}</p>`;
    }
    div.innerHTML+=`<p><b>Code:</b> ${newProduct.code} </p>
    <p><b>Stock:</b> ${newProduct.stock} </p> `
 ;
  if(!newProduct.status){
    div.innerHTML+=`<p style="color: red;"><b>Status:</b> ${newProduct.status}</p>`;
  }
    div.innerHTML+=`<p><b>-----------------------------------</b></p>`
  productList.appendChild(div);

  
});


async function goBack() {
   
  history.back();
}