import { cartDAO } from "../dao/index.js";
import { productDAO } from "../dao/index.js";
import utils from "../utils.js";
import { PERSISTENCE } from "../config/config.js";
async function getAll(req, res){
    const {limit} = req.query;
    try{
        let response = await cartDAO.getAll();
        if(limit){
            let tempArray = response.filter((dat, index) => index < limit)
            res.json({carts: tempArray, limit: limit,quantity: tempArray.length});
        }else{
        res.json({carts: response});
        }
    }catch(error){
        console.log(error)
    }
}

async function getById(req, res){
    let {cid} = req.params;
    try{
        const cart = await cartDAO.getById(cid);

        
       if(cart){
             const productsWithDetails = [];
            for (const item of cart.products) {
                const productDetails = await productDAO.getById(item.id);
                productsWithDetails.push({
                    product: productDetails,
                    quantity: item.quantity
                });
            }
     
            
            res.render("cart",{cart:productsWithDetails, cid: cid });
        }else{
        res.status(404).json({message:"The cart does not exists" });
        }
    }catch(error){
        console.log(error)
    }
}

async function save(req,res){
    try{
        let cart = await cartDAO.save();
        if(cart){
            res.json({message: "Cart created"});
        }else{
            res.status(400).json({message:"The cart couldn't be created" });
        }
    }catch(error){
        console.log(error)
    }
}

async function saveProduct(req,res){
    let {cid, pid} = req.params;
    let {quantity} = req.body;
    try{
        let cart = await cartDAO.getById(cid);
       
        let product = await productDAO.getById(pid);
             
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
            res.status(404).json({message:"The product does not exists" });
        }
        }else{
            res.status(404).json({message:"The cart does not exists" });
        }
    }catch(error){
        console.log(error)
    }
}
async function update(req,res){
    const {cid,pid} = req.params
     const {quantity} = req.body
     let cart = await cartDAO.getById(cid)
     let product = cart.products

     let existsPindex = product.findIndex((producto) => producto.id === pid);
     if(existsPindex!== -1){
     product[existsPindex].quantity = quantity
     let updatedCart = await cartDAO.save(cart);
    console.log(updatedCart)
     const productsWithDetails = [];
            for (const item of updatedCart.products) {
                const productDetails = await productDAO.getById(item.id);
                productsWithDetails.push({
                    product: productDetails,
                    quantity: item.quantity
                });
            }
         
    return res.json({ message: "Product updated" });


     }else{
      return res.status(404).json({message: "Product not found"})
     }
}

async function deleteCart(req,res){
    try{
        const {cid} = req.params
        let cart = await cartDAO.getById(cid)
        cart.products = []
        await cartDAO.save(cart);
        return res.json({message: "Cart updated"})
    }catch(error){
        console.log(error)
    }
}

 async function addCartToFile(cartData) {
    try {
      let data = await utils.readFile("carts.json");
      const carts = data?.length > 0 ? data : [];
  
      carts.push(cartData);
  
      await utils.writeFile("carts.json", carts);
  
      return true;
    } catch (error) {
      console.error("Error al agregar el carrito al archivo 'cart.json':", error);
      return false;
    }
  }

  async function removeProduct(req,res){
    try{
        const {cid, pid} = req.params
        const cart =await cartDAO.getById(cid);
        await cartDAO.removeProduct(cart,pid);
        console.log(cart)
        await cartDAO.save(cart)
        return res.json({message: "product deleted"})
    }catch(error){
        console.log(error)
    }
}
  
export {getAll, getById, save, saveProduct, update, deleteCart,addCartToFile, removeProduct}