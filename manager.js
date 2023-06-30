import { ProductManager } from "./src/ProductManager.js";

let myFirstStore = new ProductManager("./products.json");
/*myFirstStore.addProduct(
    "producto prueba",
    "Este es un producto de prueba",
    200,
    "sin imagen",
    "abc1s23",
    25
);*/

//myFirstStore.getProducts().then((data) => console.log(data));
//myFirstStore.getProductById(1).then((data) => console.log(data));
/*myFirstStore.updateProduct(1, {
    title: "pizza",
    description: "es una pizza",
    price:5000,
    thumbnail:"no hay imagen",
    code:"aaaa1111",
    stock:"50"}).then((data) => console.log(data));*/
myFirstStore.getProductById(1).then((data) => console.log(data));
myFirstStore.deleteProduct(1);
myFirstStore.getProducts().then((data) => console.log(data));