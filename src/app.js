import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js"
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import realTimeRouter from "./routes/realTimeProducts.router.js";
import {Server} from "socket.io";


const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});


app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.engine("handlebars", handlebars.engine());
app.set('views','./views');
app.set("view engine","handlebars");
app.use(express.static("./public"));

const socketServer = new Server(httpServer)

app.use("/api/products", productRouter);
app.use("/api/realtimeproducts", realTimeRouter(socketServer));
app.use("/api/carts", cartRouter);

httpServer.on("error",(error)=>{
  console.log("Error:" + error)
})


socketServer.on("connection", (socket) => {

    console.log("New client Connected");
   
    socket.on("addProduct", (newProduct) => {
   
    console.log("New product received:", newProduct);
     
    saveProducts(newProduct);
   
    socketServer.emit("addProduct", newProduct);
   
  });
 

});
