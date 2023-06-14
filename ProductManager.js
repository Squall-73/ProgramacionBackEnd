class ProductManager {
    products;
    static lastId=0;
    constructor() {
      this.products = [];
    }
    addProduct(title, description, price, thumbnail, code, stock) {
        ProductManager.lastId++;
        if(this.products.some(product => product.code=== code)) {
            console.log("El código de producto ingresado ya existe");
        }else{
        const product ={
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id:ProductManager.lastId,
        };
        this.products.push(product);
    }
    }
    getProducts() {
        return this.products;    
    };

    getProductById(idProducto) {
      const prod = this.products.find(dato => dato.id === idProducto)
    if(prod){
        return prod;
    }else{
        console.log("El producto solicitado no existe")
    }
    }
}

console.log("\nNOTA: no se utilizó la sentencia 'throw new Error' para que la respuesta sea mas legible \n")
const productoPrueba = new ProductManager();
console.log("NOTA: Obtengo productos de lista vacía \n")
console.log(productoPrueba.getProducts());
productoPrueba.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin Imagen","abc123",25 );
console.log("\nNOTA: Obtengo productos habiendo agregado un objeto \n")
console.log(productoPrueba.getProducts());
console.log("\nNOTA: Agrego objeto repetido por lo que obtengo mensaje de error \n")
productoPrueba.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin Imagen","abc123",25 );
console.log("\nNOTA: Obtengo producto con id = 1 \n")
console.log(productoPrueba.getProductById(1));
console.log("\nNOTA: Obtengo mensaje de error porque ID=2 no existe \n")
console.log(productoPrueba.getProductById(2));