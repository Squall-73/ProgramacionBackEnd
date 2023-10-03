import {Router} from "express";
import { generateProduct } from "../mocking/products.js";

const router = Router();

router.get('/mockingproducts',async(req,res)=>{
    let products=[]
    for(let i=0;i<100;i++){
        products.push(generateProduct())
    }
    console.log(products)
    res.render("mockingProduct", {products:products})
})

export default router;