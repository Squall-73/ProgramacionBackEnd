import { Router } from "express";
import{ ProductManager} from "../manager/ProductManager.js";


const router = Router();
const productManager = new ProductManager("products.json")

router.get("/", async (req, res) => {
    
    try{
        let response = await productManager.getProducts();
        
        res.render("realTimeProducts",{products: response});
        
    }catch(error){
        console.log(error)
    }
});





export default router;
