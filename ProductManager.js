class ProductManager {
    products;
    static lastId=0;
    constructor() {
      this.products = [];
    }
    addProduct(title, description, price, thumbnail, code, stock) {
        
        if(this.products.some(product => product.code === code)) {
            throw new Error("The product code entered already exists");
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

    getProductById(productId) {
      const prod = this.products.find(data => data.id === productId)
    if(prod){
        return prod;
    }else{
        throw new Error("The requested product does not exist");
    }
    }
}