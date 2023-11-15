import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils/utils.js"
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import realTimeRouter from "./routes/fileRoutes/realTimeProducts.router.js";
import loginRouter from "./routes/dbRoutes/login.router.js"
import signupRouter from "./routes/dbRoutes/signup.router.js"
import {Server} from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import methodOverride from 'method-override';
import bodyParser from 'body-parser'; 
import MongoStore from "connect-mongo"
import session from "express-session";
import sessionRouter from "./routes/dbRoutes/session.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import ticketRouter from "./routes/dbRoutes/ticket.router.js";
import mockingRouter from "./routes/mocking.router.js"
import { addLogger } from "./utils/logger/logger.js";
import transporter from "./utils/mailer/mailer.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import userRouter from "./routes/dbRoutes/user.router.js";



dotenv.config();
export const app = express();
const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
const MONGO_URL = process.env.MONGO_URL

const connection = mongoose.connect(MONGO_URL)
initializePassport();

const SwaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion del proyecto",
      description: "Curso Backend - CoderHouse",
    },
  },
  apis: ["./docs/**/*.yaml"],
};

const specs = swaggerJsdoc(SwaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl:100,
    }),
    secret: "codersecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(addLogger);

const environment = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Base de datos conectada");
  } catch (error) {
    console.log(error);
  }
};

environment();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));
app.use(express.static("public"));
app.engine("handlebars", handlebars.engine({runtimeOptions: {
  allowProtoPropertiesByDefault: true,
  noEscape: true
}
}));
app.set('views','./views');
app.set("view engine","handlebars");
app.use(express.static("public", {
  setHeaders: (res, path) => {
    if (path.endsWith(".js")) {
      res.setHeader("Content-Type", "text/javascript");
    }
  }
}));


const socketServer = new Server(httpServer)
const NODE_ENV ="dev"
function auth(req, res, next) {
  if (NODE_ENV === 'test') {
    
    return next();
  }
  if (req.isAuthenticated()) {
    return next();
  }else{
    return res.status(401).json("error de autenticacion");
  }
}



app.use("/api/products",auth, productRouter);
app.use("/api/realtimeproducts", realTimeRouter(socketServer));
app.use("/api/carts",auth, cartRouter);
app.use("/", loginRouter)
app.use("/signup", signupRouter)
app.use("/api/session/", sessionRouter);
app.use("/api/tickets/", ticketRouter)
app.use("/api/testing",mockingRouter)
app.use("/api/users",userRouter)


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

app.get("/mail", async (req, res) => {
  const result = await transporter.sendMail({
    from: "Coder house 43385<pablolr73@gmail.com>",
    to: "pablolr73@gmail.com",
    subject: "Prueba",
    text: "Hola, esto es una prueba de envio de correo",
    html: `<div><h1>Hola, esto es una prueba de envio de correo</h1>
    </div>`,
    attachments: [],
  });

  res.send("Correo enviado");
});