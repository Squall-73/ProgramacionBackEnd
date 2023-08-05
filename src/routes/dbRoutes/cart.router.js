import { Router } from "express";
import Carts from "../../dao/dbManager/cartManager.js";


const router = Router();
const carts = new Carts();

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
            res.json({message: "success",cart:cart });
        }else{
        res.status(404).json({message:"The cart does not exists" });
        }
    }catch(error){
        console.log(error)
    }
});

router.post("/",async (req,res)=>{
    
    try{
        let cart = await carts.save(data);
        if(cart){
            res.json({message: "Cart created"});
        }else{
            res.status(400).json({message:"The cart couldn't be created" });
        }
    }catch(error){
        console.log(error)
    }
});
//TODO: post products en cart + chat
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
