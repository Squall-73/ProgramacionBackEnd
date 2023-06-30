import express from "express";
import{ ProductManager} from "./ProductManager.js";


const app = express();
const PORT = 8080;
const productManager = new ProductManager("products.json")

app.get("/products", async (req, res) => {
    const {limit} = req.query;
    try{
        let response = await productManager.getProducts();
        if(limit){
            let tempArray = response.filter((dat, index) => index < limit)
            res.json({data: tempArray, limit: limit,quantity: tempArray.length});
        }else{
        res.json({data: response, limit: false,quantity: response.length});
        }
    }catch(error){
        console.log(error)
    }
  });

  app.get("/products/:productId", async (req, res) => {
    let {productId} = req.params;
    try{
        let product = await productManager.getProductById(parseInt(productId));
        if(product){
            res.json({message: "success",data: product });
        }else{
        res.json({message:"The product does not exists" });
        }
    }catch(error){
        console.log(error)
    }
  });


app.listen(PORT, () => {
    console.log("Server running on port" + PORT);
  });