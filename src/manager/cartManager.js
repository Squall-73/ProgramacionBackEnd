import utils from "../utils.js";

export class CartManager {
    carts;
    lastId;
    constructor(path) {
        this.path=path;
        this.carts = [];
    }
    async addCart(){
        try{
            let data = await utils.readFile(this.path);
            this.carts= data?.length>0 ? data : [];
            if(this.carts.length>0){
                CartManager.lastId=this.carts[this.carts.length-1].id;
            }else{CartManager.lastId=0}
        }catch(error){
            console.log(error)
        }
        CartManager.lastId++;
        const cart ={
            id:CartManager.lastId,
            products:[]
        }
        this.carts.push(cart);
        try{
            await utils.writeFile(this.path, this.carts);
            return true;
        }catch(error){
            console.log(error)
        }
    }

    async getCartById(id) {
        try{
            let data = await utils.readFile(this.path);
            this.carts= data?.length>0 ? data:[];
            let  cart = this.carts.find(data => data.id === id)
            if(cart){
                return cart;
            }else{
                throw new Error("The requested cart does not exist");
            }
        }catch(error){
            console.log(error)
        }
    }
    
    async updateCart(cid, pid) {
        try{
            let data = await utils.readFile(this.path);
            this.carts= data?.length>0 ? data:[];
            let  cartIndex = this.carts.findIndex((cart) => cart.id === cid)
            if(cartIndex !==-1){
                let cart = this.carts[cartIndex];
                let productIndex = cart.products.findIndex((product) => product.id === pid);
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity++;
                }else{
                    cart.products.push({ id: pid, quantity: 1 });
                }
                await utils.writeFile(this.path, this.carts);
                return cart;
            }else{
                throw new Error("The requested cart does not exist");
            }
        }catch(error){
            console.log(error)
        }
    }
 }

export default {
    CartManager,
};

