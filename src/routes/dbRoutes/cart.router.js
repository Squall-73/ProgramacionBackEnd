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
            
            res.json({message: "success",cart:productsWithDetails });
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


export default router;
