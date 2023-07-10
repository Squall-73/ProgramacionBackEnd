import { Router } from "express";
import{ CartManager } from "../cartManager.js";


const router = Router();
const cartManager = new CartManager("carts.json")


router.get("/:cid", async (req, res) => {
    let {cid} = req.params;
    try{
        let cart = await cartManager.getCartById(parseInt(cid));
        if(cart){
            res.json({message: "success",data: cart });
        }else{
        res.status(404).json({message:"The cart does not exists" });
        }
    }catch(error){
        console.log(error)
    }
  });

router.post("/",async (req,res)=>{
    
    try{
        let cart = await cartManager.addCart();
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
    try{
        let data = await cartManager.getCartById(parseInt(cid));
        if(data){
            let cart = await cartManager.updateCart(parseInt(cid),parseInt(pid))
            res.json({message: "Cart updated", data:cart });
        }else{
            res.status(404).json({message:"The cart does not exists" });
        }
    }catch(error){
        console.log(error)
    }
});


export default router;
