import utils from "../../utils/utils.js";
import { CustomError } from "../../utils/errorHandler/customError.js";
import { errorDictionary } from "../../utils/errorHandler/errorDictionary.js";

export default class ProductManager {
    products;
    lastId;
    constructor(path) {
        this.path=path;
        this.products = [];
    }
    async save(data) {
        try{
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
        ){
            throw new CustomError(errorDictionary.MISSING_DATA, 400);

        }
        
        
            let data = await utils.readFile(this.path);
            this.products= data?.length>0 ? data : [];
            if(data){
            if(this.products.length>0){
            ProductManager.lastId=this.products[this.products.length-1].id;
            }else{ProductManager.lastId=0}
        }else{
            throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
        }
        }catch(error){
            req.logger.warning(error.message);
            req.logger.warning(`Código de error: ${error.errorCode}`);
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
            req.logger.info(error)
        }
        }
    }
    async getAll() {
        try{
            let data = await utils.readFile(this.path);
            this.products=data;
            if(data){
                return this.products
            }else{
                throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
            } 
        }catch (error) {
            req.logger.warning(error.message);
            req.logger.warning(`Código de error: ${error.errorCode}`);
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
                throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
            } 
        }catch (error) {
            req.logger.warning(error.message);
            req.logger.warning(`Código de error: ${error.errorCode}`);
            }
            
    };

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
                throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
            } 
        }catch (error) {
            req.logger.warning(error.message);
            req.logger.warning(`Código de error: ${error.errorCode}`);
            }
            
    };

    async delete(id){
        try{
            let products = await utils.readFile(this.path);
            this.products= products?.length>0 ? products:[];
            let  productIndex = this.products.findIndex((data) => data.id === id)
            if(productIndex !==-1){
                
                this.products[productIndex].status=false;
                await utils.writeFile(this.path, this.products);
                return "Produtc deleted succesfully"
            }else{
                throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
            } 
        }catch (error) {
            req.logger.warning(error.message);
            req.logger.warning(`Código de error: ${error.errorCode}`);
            }
            
    };
}



