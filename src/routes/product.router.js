import { Router } from "express";
import{ ProductManager} from "../manager/ProductManager.js";


const router = Router();
const productManager = new ProductManager("products.json")

router.get("/", async (req, res) => {
    const {limit} = req.query;
    try{
        let response = await productManager.getProducts();
        if(limit){
            let tempArray = response.filter((dat, index) => index < limit)
            res.render("home",{products: tempArray, limit: limit,quantity: tempArray.length});
        }else{
        res.render("home",{products: response, limit: false,quantity: response.length});
        }
    }catch(error){
        console.log(error)
    }
});



router.get("/:pid", async (req, res) => {
    let {pid} = req.params;
    try{
        let product = await productManager.getProductById(parseInt(pid));
        if(product){
            res.render("productById",{message: "success",product: product });
        }else{
        res.status(404).json({message:"The product does not exists" });
        }
    }catch(error){
        console.log(error)
    }
  });

router.post("/",async (req,res)=>{
    
    const{title, description, price, thumbnail, code, stock}=req.body;

    if(!title||!description||!price||!code||!stock){
        return res.status(400).json({message: "Missing data"});
    }
    try{
        let product = await productManager.addProduct(title, description, price, thumbnail, code, stock);
        if(product){
            res.json({message: "success",data: req.body });
        }else{
            res.status(409).json({message:"The product code already exists" });
        }
    }catch(error){
        console.log(error)
    }
});

router.put("/:pid",async (req,res)=>{
    const{pid}=req.params;
    try{
        let product = await productManager.getProductById(parseInt(pid));
        if(product){
            await productManager.updateProduct(parseInt(pid),req.body);
            product = await productManager.getProductById(parseInt(pid));
            res.json({message:"Product updated", data: product});
        }else{
            res.status(404).json({message:"The product does not exists"});
        }
    }catch(error){
        console.log(error)
    }
});

router.delete("/:pid",async(req,res)=>{
    const{pid}=req.params;
    try{
        let product = await productManager.getProductById(parseInt(pid));
        if(product){
            await productManager.deleteProduct(parseInt(pid));
            product = await productManager.getProductById(parseInt(pid));
            res.json({message:"Product deleted", data: product});
        }else{
            res.status(404).json({message:"The product does not exists"});
        }
    }catch(error){
        console.log(error)
    }
})
export default router;
