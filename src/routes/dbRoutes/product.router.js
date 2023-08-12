import { Router } from "express";
import Products from "../../dao/dbManager/productManager.js";


const router = Router();
const products = new Products()

router.get("/", async (req, res) => {
    const {limit, page, filter,sort, cartId, addedToCart} = req.query;
    const perPage = limit || 10; 
    try{
        

        const sortOptions = {};
        if (sort === 'price') {
            sortOptions.price = 1;
        } else if (sort === '-price') {
            sortOptions.price = -1;
        }
        const options = {
            page: page || 1,
            limit: perPage,
            sort: sortOptions,
        };
        
        let response = await products.getAll(options, filter);
        const lastPageItemCount = response.totalDocs % perPage;  
        const added = addedToCart==='true'
        res.render("products",{response:response,
            products: response.docs.map(doc =>doc.toObject()),
            limit: perPage,
            totalPages: response.totalPages,
            currentPage: response.page,
            totalDocs: response.totalDocs,
            lastPageItemCount:lastPageItemCount,
            filter: filter,
            cartId:cartId,
            addedToCart: added,
            });
        
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
