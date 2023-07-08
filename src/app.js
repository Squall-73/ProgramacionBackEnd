import express from "express";
import productRouter from "./router/product.router.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use("/api/products", productRouter);


app.listen(PORT, () => {
    console.log("Server running on port" + PORT);
  });