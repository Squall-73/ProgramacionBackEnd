import { Router } from "express";
import Carts from "../../dao/dbManager/cartManager.js";
import Products from "../../dao/dbManager/productManager.js"


const router = Router();
const carts = new Carts();
const products = new Products();

router.get("/", async (req, res) => {
    const {limit} = req.query;
    try{
        let response = await carts.getAll();
        if(limit){
            let tempArray = response.filter((dat, index) => index < limit)
            res.json({carts: tempArray, limit: limit,quantity: tempArray.length});
        }else{
        res.json({carts: response});
        }
    }catch(error){
        console.log(error)
    }
});

router.get("/:cid", async (req, res) => {
    let {cid} = req.params;
    try{
        let cart = await carts.getById(cid);

        
        if(cart){
            const productsWithDetails = [];
            for (const item of cart.products) {
                const productDetails = await products.getById(item.id);
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
});

router.post("/",async (req,res)=>{
    
    try{
        let cart = await carts.save();
        if(cart){
            res.json({message: "Cart created"});
        }else{
            res.status(400).json({message:"The cart couldn't be created" });
        }
    }catch(error){
        console.log(error)
    }
});

router.post("/:cid/product/:pid",async (req,res)=>{
    let {cid, pid} = req.params;
    let {quantity} = req.body;
    try{
        let cart = await carts.getById(cid);
        let product = await products.getById(pid);
        
        if(cart){
            if(product){
            const existsPindex = cart.products.findIndex((producto) => producto.id === pid);
            
            if(existsPindex !==-1){
                cart.products[existsPindex].quantity+=parseInt(quantity);
            }else{cart.products.push({id:pid,quantity:parseInt(quantity)})}
            const updatedCart = await carts.save(cart);
            const cartId = updatedCart._id;
            const addedToCart = true;

            res.redirect(`/api/products?cartId=${cartId}&addedToCart=${addedToCart}`);
        }else{
            res.status(404).json({message:"The product does not exists" });
        }
        }else{
            res.status(404).json({message:"The cart does not exists" });
        }
    }catch(error){
        console.log(error)
    }
});

router.delete("/:cid/products/:pid",async(req,res)=>{
    const {cid,pid} = req.params
    let cart = await carts.getById(cid);
    let products = cart.products
    let existsPindex = products.findIndex((producto) => producto.id === pid);
    if(existsPindex!== -1){
      products.splice(existsPindex,1)
      await carts.save(cart);
      return res.json({ message: "Product removed from cart" });
    }else{
      return res.status(404).json({message: "Product not found"})
    }
})

router.post("/:cid/add-products", async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        let cart = await carts.getById(cid);
        cart.products = [...cart.products, ...products]; // Agregar los nuevos productos
        await carts.save(cart);
        return res.json({ message: "Products added to cart", data: cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/:cid/products/:pid",async(req,res)=>{
     const {cid,pid} = req.params
     const {quantity} = req.body
     let cart = await carts.getById(cid)
     let product = cart.products
     let existsPindex = product.findIndex((producto) => producto.id === pid);
     if(existsPindex!== -1){
     product[existsPindex].quantity = quantity
     let updatedCart = await carts.save(cart);
    console.log(updatedCart)
     const productsWithDetails = [];
            for (const item of updatedCart.products) {
                const productDetails = await products.getById(item.id);
                productsWithDetails.push({
                    product: productDetails,
                    quantity: item.quantity
                });
            }
         
    return res.json({ message: "Product updated" });


     }else{
      return res.status(404).json({message: "Product not found"})
     }
})


router.delete("/:cid",async(req,res)=>{
    const {cid} = req.params
    let cart = await carts.getById(cid)
    cart.products = []
    await carts.save(cart);
    return res.json({message: "Cart updated"})
})

export default router;
