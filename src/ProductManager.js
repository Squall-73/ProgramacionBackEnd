import utils from "./utils.js";

export class ProductManager {
    products;
    lastId;
    constructor(path) {
        this.path=path;
        this.products = [];
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        if (
            title==undefined ||
            description==undefined ||
            price==undefined ||
            thumbnail==undefined ||
            code==undefined ||
            stock==undefined
        )   {
            throw new Error("Every field must be completed");
        }
        
        try{
            let data = await utils.readFile(this.path);
            this.products= data?.length>0 ? data : [];
            if(this.products.length>0){
            ProductManager.lastId=this.products[this.products.length-1].id;
            }else{ProductManager.lastId=0}
        }catch(error){
            console.log(error)
        }
        
        if(this.products.some(product => product.code === code)) {
            throw new Error("The product code entered already exists");
        }else{
            ProductManager.lastId++;
            const product ={
                id:ProductManager.lastId,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                
        };
        this.products.push(product);
        try{
            await utils.writeFile(this.path, this.products);
        }catch(error){
            console.log(error)
        }
        }
    }
    async getProducts() {
        try{
            let data = await utils.readFile(this.path);
            return data?.length > 0 ? this.products : "There are no products registered";
        }catch(error){
            console.log(error)
        }
    };

    async getProductById(id) {
        try{
            let data = await utils.readFile(this.path);
            this.products= data?.length>0 ? data:[];
            let  prod = this.products.find(data => data.id === id)
            if(prod){
                return prod;
            }else{
                throw new Error("The requested product does not exist");
            }
        }catch(error){
            console.log(error)
        }
    }

    async updateProduct(id, productData) {
        try{
            let products = await utils.readFile(this.path);
            this.products= products?.length>0 ? products:[];
            let  productIndex = this.products.findIndex((data) => data.id === id)
            if(productIndex !==-1){
                this.products[productIndex]={
                    ...this.products[productIndex],
                    ...productData,
                };
                await utils.writeFile(this.path, this.products);
                return {
                  Message: "Product updated",
                  Product: this.products[productIndex],
                };
            }else{
                throw new Error("The requested product does not exist");
            }
        }catch(error){
            console.log(error)
        }
    }

    async deleteProduct(id){
        try{
            let products = await utils.readFile(this.path);
            this.products= products?.length>0 ? products:[];
            let  productIndex = this.products.findIndex((data) => data.id === id)
            if(productIndex !==-1){
                
                this.products.splice(productIndex,1)
                await utils.writeFile(this.path, this.products);
                return "Produtc deleted succesfully"
                }
                else{
                throw new Error("The requested product does not exist");
            }
        }catch(error){
            console.log(error)
        }
    }
}

export default {
    ProductManager,
};