import { cartDAO } from "../dao/index.js";
import { productDAO } from "../dao/index.js";
import utils from "../utils/utils.js";
import { PERSISTENCE } from "../config/config.js";
import Tickets from "../dao/dbManager/ticketManager.js"
import Users from "../dao/dbManager/userManager.js"
import { CustomError } from "../utils/errorHandler/customError.js";
import { errorDictionary } from "../utils/errorHandler/errorDictionary.js";

const userManager = new Users();
const ticketManager = new Tickets();
async function getAll(req, res){
    const {limit} = req.query;
    try{
        const response = await cartDAO.getAll();
        if(response){
            if(limit){
                const tempArray = response.filter((dat, index) => index < limit)
                res.json({carts: tempArray, limit: limit,quantity: tempArray.length});
            }else{
            res.json({carts: response});
            }
        }else{
            throw new CustomError(errorDictionary.CARTS_NOT_FOUND, 404);
        }

    }catch(error){
        req.logger.error(error.message);
        req.logger.error(`Código de error: ${error.errorCode}`);
    }
}

async function getById(req, res){
    const {cid} = req.params;
    try{
        const cart = await cartDAO.getById(cid);
   
       if(cart){
             const productsWithDetails = [];
            for (let item of cart.products) {
                const productDetails = await productDAO.getById(item.id);
                productsWithDetails.push({
                    product: productDetails,
                    quantity: item.quantity
                });
            }
             
            res.render("cart",{cart:productsWithDetails, cid: cid });
        }else{
            throw new CustomError(errorDictionary.CARTS_NOT_FOUND, 404);
        }
    }catch(error){
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
    }
}

async function save(req,res){
    try{
        const cart = await cartDAO.save();
        if(cart){
            res.json({message: "Cart created"});
        }else{
            throw new CustomError(errorDictionary.CANT_CREATE_CART, 400);
        }
    }catch(error){
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
    }
}

async function saveProduct(req,res){
    const {cid, pid} = req.params;
    const {quantity} = req.body;
    try{
        const cart = await cartDAO.getById(cid);
       
        const product = await productDAO.getById(pid);
             
        if(cart){
            if(product){

            const existsPindex = cart.products.findIndex((producto) => producto.id === pid);
            if(existsPindex !==-1){
                cart.products[existsPindex].quantity+=parseInt(quantity);
            }else{cart.products.push({id:pid,quantity:parseInt(quantity)})}
            if(PERSISTENCE ==="MONGO"){
                const updatedCart = await cartDAO.save(cart);
                const cartId = updatedCart._id;
                const addedToCart = true;
                res.redirect(`/api/products?cartId=${cartId}&addedToCart=${addedToCart}`);
            }else{
            const updatedCartid = await cartDAO.save(cart);
            const addedToCart = true;

            res.redirect(`/api/products?cartId=${updatedCartid}&addedToCart=${addedToCart}`);
        }
        }else{
            throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
        }
        }else{
            throw new CustomError(errorDictionary.CARTS_NOT_FOUND, 404);
        }
    }catch(error){
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
    }
}
async function update(req,res){

    const {cid,pid} = req.params
    const {quantity} = req.body
    try{
     const cart = await cartDAO.getById(cid)
     const product = cart.products

     const existsPindex = product.findIndex((producto) => producto.id === pid);
     if(existsPindex!== -1){
     product[existsPindex].quantity = quantity
     const updatedCart = await cartDAO.save(cart);
    console.log(updatedCart)
     const productsWithDetails = [];
            for (let item of updatedCart.products) {
                const productDetails = await productDAO.getById(item.id);
                productsWithDetails.push({
                    product: productDetails,
                    quantity: item.quantity
                });
            }
         
    return res.json({ message: "Product updated" });


     }else{
        throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
     }
    }catch(error){
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
    }
}

async function deleteCart(req,res){
    try{
        const {cid} = req.params
        const cart = await cartDAO.getById(cid)
        cart.products = []
        await cartDAO.save(cart);
        const updatedCart = await cartDAO.getById(cid)
        if(cart === updatedCart){
            throw new CustomError(errorDictionary.CART_NOT_EMPTIED, 400);
        }else{
            return res.json({message: "Cart updated"})
        }
        
    }catch(error){
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
    }
}


 async function addCartToFile(cartData) {
    try {
      const data = await utils.readFile("carts.json");
      const carts = data?.length > 0 ? data : [];
      carts.push(cartData);
      await utils.writeFile("carts.json", carts);
      const updatedData = await utils.readFile("carts.json");
      if(data===updatedData){
        throw new CustomError(errorDictionary.CART_NOT_UPDATED, 400);
      }else{
      return true;
      }
    } catch (error) {
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
      return false;
    }
  }

  async function removeProduct(req,res){
    try{
        const {cid, pid} = req.params
        const cart =await cartDAO.getById(cid);
        await cartDAO.removeProduct(cart,pid);
        await cartDAO.save(cart)
        const updatedCart = await cartDAO.getById(cid);
        if(cart === updatedCart){
            throw new CustomError(errorDictionary.CART_NOT_UPDATED, 400);
      }else{
        return res.json({message: "product deleted"})
      }
    }catch(error){
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
    }
}

async function emptyCart(cid){
    try{
        const cart = await cartDAO.getById(cid)
        cart.products = []
        await cartDAO.save(cart);
        const updatedCart = await cartDAO.getById(cid)
        if(cart === updatedCart){
            throw new CustomError(errorDictionary.CART_NOT_EMPTIED, 400);
        }else{
            return res.status(200).json()
        }
        
    }catch(error){
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
    }
}

  
async function purchase(req,res){

    try{
       const{cartId, userId, noStockProduct, detailProducts}=req.body
       const cart=await cartDAO.getById(cartId)
       const user= await userManager.getById(userId)
       let amount =0;
       if (detailProducts.length) {
        for (let i = 0; i < detailProducts.length; i++) {
          let productID = detailProducts[i].product._id;
          let product = await productDAO.getById(productID);
          let quantity = detailProducts[i].quantity;
          amount = amount + product.price * quantity;
          product.stock = product.stock - quantity;
          await productDAO.save(product);
        }
      } else {
        let productID = detailProducts[0].product._id;
        let product = await productDAO.getById(productID);
        let quantity = detailProducts[0].product.quantity;
        amount = amount + product.price * quantity;
        product.stock = product.stock - quantity;
        await productDAO.save(product);
      }

        const datetime= new Date()
        const purchase_datetime = datetime.toISOString().split('T')[0] + "-" + datetime.toLocaleString();
        const purcharser = user.email
        const tickets =await ticketManager.getAll();
        let code="";

        if(tickets.length>=0){
            let numberCode= tickets.length + 1
            code = "A " + numberCode
        }else{
             code = "A " + 1
        }
        let data={code, purchase_datetime, amount, purcharser};
        
        if(amount>0){
        
            await ticketManager.save(data);
            //await emptyCart(cartId);
            if(noStockProduct.length){
                for (let i = 0; i < noStockProduct.length; i++) {
                    const productID = noStockProduct[i].product._id;
                    const quantity = noStockProduct[i].quantity;
                    cart.products.push({id:productID,quantity:parseInt(quantity)})
        }}
        
        await cartDAO.save(cart)
        const ticket = await ticketManager.getByCode(code)
        
        
        data.ticket = ticket._id
        
        res.status(200).json(data)
        }else{
            throw new CustomError(errorDictionary.NOT_ENOUGH_STOCK, 400);
        }
        
    }catch(error){
        
        res.status(200).json();
    }
}
export {getAll, getById, save, saveProduct, update, deleteCart,addCartToFile, removeProduct, purchase}