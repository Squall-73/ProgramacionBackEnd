import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js"
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import {Server} from "socket.io";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
const socketServer = new Server(httpServer)

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.engine("handlebars", handlebars.engine());
app.set('views','./views');
app.set("view engine","handlebars");
app.use(express.static("./public"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

socketServer.on("connection", socket=>{
  socket.on('message', data=>{
    console.log(data);
  })
  console.log("New client connected")
})


