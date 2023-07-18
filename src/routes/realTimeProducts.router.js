import { Router } from "express";
import{ ProductManager} from "../manager/ProductManager.js";
import {Server} from "socket.io";


const router = Router();
const productManager = new ProductManager("products.json")
//export default function (socketServer){
router.get("/", async (req, res) => {
    
    try{
        let response = await productManager.getProducts();
        
        res.render("realTimeProducts",{products: response});
        
    }catch(error){
        console.log(error)
    }
});

/*router.post("/",async (req,res)=>{
    
    const{title, description, price, thumbnail, code, stock}=req.body;

    if(!title||!description||!price||!code||!stock){
        return res.status(400).json({message: "Missing data"});
    }
    try{
        let product = await productManager.addProduct(title, description, price, thumbnail, code, stock);
        if(product){
            res.json({message: "success",data: req.body });
            socketServer.emit("NewProduct", product );
           

        }else{
            res.status(409).json({message:"The product code already exists" });
        }
    }catch(error){
        console.log(error)
    }
});
return router;
}*/

export default router
