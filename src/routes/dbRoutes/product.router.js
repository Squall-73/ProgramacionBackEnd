import { Router } from "express";
import Products from "../../dao/dbManager/productManager.js";



const router = Router();
const products = new Products()

router.get("/", async (req, res) => {
    const {limit} = req.query;
    try{
        let response = await products.getAll();
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
        let product = await products.getById(pid);
        if(product){
            res.render("productById",{message: "success",product: Object.assign({}, product) });
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
        const product = await products.getByCode(code);
        if(!product){
            let newProduct = await products.save({title, description, price, thumbnail, code, stock});
            res.json({message: "success",data: newProduct });
        }else{
            res.status(409).json({message:"The product code already exists" });
        }
    }catch(error){
        console.log(error)
    }
});

router.put("/:pid",async (req,res)=>{
    try{
        const{pid}=req.params;
        const {title, description, price, thumbnail, code, stock} = req.body;
        const product = await products.getById(pid);
        if(product){
            let updatedProduct= await products.update(pid,{title, description, price, thumbnail, code, stock})
            res.json({message:"Product updated", data: updatedProduct});
        }else{
            res.status(404).json({message:"The product does not exists"});
        }
    }catch(error){
        console.log(error)
    }
});

router.delete("/:pid",async(req,res)=>{
    try{
        let {pid}=req.params;
        let product = await products.getById(pid);
        if(product){
            product.status=false;
            await product.save();
            res.json({message:"Product deleted", data: product});
        }else{
            res.status(404).json({message:"The product does not exists"});
        }
    }catch(error){
        console.log(error)
    }
})
export default router;
