class ProductManager {
    products;
    static lastId=0;
    constructor() {
      this.products = [];
    }
    addProduct(title, description, price, thumbnail, code, stock) {
        
        if(this.products.some(product => product.code=== code)) {
            throw new Error("El código de producto ingresado ya existe");
        }else{
            ProductManager.lastId++;
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
        throw new Error("El producto solicitado no existe");
    }
    }
}
