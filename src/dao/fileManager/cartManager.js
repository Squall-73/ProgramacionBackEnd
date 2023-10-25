import utils from "../../utils/utils.js";
import { CustomError } from "../../utils/errorHandler/customError.js";
import { errorDictionary } from "../../utils/errorHandler/errorDictionary.js";

export default class CartManager {
    carts;
    lastId;
    constructor(path) {
        this.path=path;
        this.carts = [];
    }
    async save(cart){
        try{
            const data = await utils.readFile(this.path);
            this.carts= data?.length>0 ? data : [];
            const cid= cart.id
            const  cartIndex = this.carts.findIndex((cart) => cart.id === cid)
            if(cartIndex !==-1){
                this.carts[cartIndex]=cart;
            }else{this.carts.push(cart);}
            await utils.writeFile(this.path, this.carts);
            const updatedData = await utils.readFile(this.path);
            if(data===updatedData){
                throw new CustomError(errorDictionary.CART_NOT_UPDATED, 400);
            }else{return cart.id;}
        }catch(error){
            req.logger.warning(error.message);
            req.logger.warning(`Código de error: ${error.errorCode}`);
        }
    }

    async getById(id) {
        try{
            const data = await utils.readFile(this.path);
            this.carts= data?.length>0 ? data:[];
            const  cart = this.carts.find(data => data.id === id)
            if(cart){
                return cart;
            }else{
                throw new CustomError(errorDictionary.CARTS_NOT_FOUND, 404);
            }
        }catch(error){
            req.logger.warning(error.message);
            req.logger.warning(`Código de error: ${error.errorCode}`);
        }
    }
    
    async saveProduct(cid, pid) {
        try{
            const data = await utils.readFile(this.path);
            this.carts= data?.length>0 ? data:[];
            const  cartIndex = this.carts.findIndex((cart) => cart.id === cid)
            if(cartIndex !==-1){
                const cart = this.carts[cartIndex];
                const productIndex = cart.products.findIndex((product) => product.id === pid);
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity++;
                }else{
                    cart.products.push({ id: pid, quantity: 1 });
                }
                await utils.writeFile(this.path, this.carts);
                return cart;
            }else{
                throw new CustomError(errorDictionary.CARTS_NOT_FOUND, 404);
            }
        }catch(error){
            req.logger.warning(error.message);
            req.logger.warning(`Código de error: ${error.errorCode}`);
        }
    }
    

 }



