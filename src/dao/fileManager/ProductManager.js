import utils from "../../utils.js";

export default class ProductManager {
    products;
    lastId;
    constructor(path) {
        this.path=path;
        this.products = [];
    }
    async save(data) {
        this.title= data.title;
        this.description= data.description;
        this.price= data.price;
        this.tithumbnailtle= data.thumbnail;
        this.code= data.code;
        this.stock= data.stock;
        if (
            title==undefined ||
            description==undefined ||
            price==undefined ||
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
            return false;
        }else{
            ProductManager.lastId++;
            const product ={
                id:ProductManager.lastId,
                title,
                description,
                price,
                thumbnail,
                status: true,
                code,
                stock,
        };
        this.products.push(product);
        try{
            await utils.writeFile(this.path, this.products);
            return true;
        }catch(error){
            console.log(error)
        }
        }
    }
    async getAll() {
        try{
            let data = await utils.readFile(this.path);
            this.products=data;
            return data?.length > 0 ? this.products : "There are no products registered";
        }catch(error){
            console.log(error)
        }
    };

    async getById(id) {
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

    async update(id, productData) {
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

            }else{
                throw new Error("The requested product does not exist");
            }
        }catch(error){
            console.log(error)
        }
    }

    async delete(id){
        try{
            let products = await utils.readFile(this.path);
            this.products= products?.length>0 ? products:[];
            let  productIndex = this.products.findIndex((data) => data.id === id)
            if(productIndex !==-1){
                
                this.products[productIndex].status=false;
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



