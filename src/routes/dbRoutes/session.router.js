import { Router } from "express";
import cartsModel from "../../dao/models/carts.js";
import passport from "passport";
import UserDTO from "../../dao/DTOs/user.dto.js";
import { cartDAO, productDAO } from "../../dao/index.js";
import { addLogger } from "../../utils/logger/logger.js";


const router = Router();


router.post("/login",passport.authenticate("login", {failureRedirect: "/failLogin"}),
  async (req, res) => {
 
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart,
      role: req.user.role
    };

    if(req.user.role ==="admin"){req.session.admin = true};
   
    const cartId = req.user.cart._id;
    res.status(200).json({
      status: "OK",
      message: "User logged in",
      user: req.session.user,
      cartId: cartId,
    });
  });


  router.post("/signup", passport.authenticate("register", {
    failureRedirect: "/failRegister"
  }), async (req, res) => {
    try {
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        cart: req.user.cart,
        role: req.user.role,
      };
  
      console.log(req.session.user);
  
      res.status(200).json({
        status: "OK",
        message: "User created",
        user: req.session.user,
        cartId: req.user.cart,
      });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({
        status: "Error",
        message: "Error creating user",
        error: err.message,
      });
    }
  });

  router.get("/failLogin", async (req, res) => {
    console.log("failed strategy");
    res.send({ error: "failed" });
  });
  
  router.get("/failRegister", async (req, res) => {
    console.log("failed strategy");
    res.send({ error: "failed" });
  });
router.get("/github",passport.authenticate('github',{scope:['user:email']}),async(req,res)=>{})

router.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/"}),
async(req,res)=>{
    const newCart = await cartsModel.create({});
    const cartId = newCart.id;
    if(req.user.role ==="admin"){req.session.admin = true}else{req.session.admin=false};
    req.user.cart = cartId;
    req.login(req.user, async (err) => {
      if (err) {
        console.error("Error during login:", err);
        return res.redirect("/");
      }

      res.redirect(`/api/products?cartId=${cartId}`);
    });
})

router.post("/logout",async  (req, res) => {

  const cartId = req.session.passport.user.cart


  await cartsModel.findByIdAndUpdate(cartId, { products: [] });
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ respuesta: "error" });
    }
    res.status(200).json({ respuesta: "ok" });
  });
});

router.get("/current", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    let userDTO = new UserDTO(user);
    return res.render("current", {
      title: "User",
      user: userDTO
    });
  } else {
    return res.render("error", {
      title: "Error",
      message: "No estás autenticado"
    });
  }
});

router.get("/newProduct",async(req, res)=>{
  if (req.isAuthenticated()) {
    res.render("newProduct")
  }
})

router.get("/purchase",async(req,res)=>{
  const user=req.user;
  const userId=user.id
  const cartId = req.user.cart
  const cart = await cartDAO.getById(cartId)
  const detailProducts = []
  const noStock = []

 
  for(let i=0;i<cart.products.length;i++){
    const productID=cart.products[i].id
    const detail = await productDAO.getById(productID)
    const quantity= cart.products[i].quantity
    const cost= detail.price*quantity
    if(detail.stock>=quantity){
      detailProducts.push({
      product: detail,
      quantity: quantity,
      cost:cost,
    });
    }else{
      noStock.push({
        product: detail,
        quantity: quantity
      })
    }
  
    
  }

  
  if (req.isAuthenticated() && detailProducts.length>0) {
    res.render("purchase", {
      user: userId,
      cart: cartId,
      detailProducts: detailProducts,
      products: JSON.stringify(detailProducts),
      noStockProduct: JSON.stringify(noStock)
    })
  }else{
    res.render("error", {
      message: "No hay suficiente stock para los productos en su carrito.",
    });
  }
})

router.get('/loggerTest', addLogger, (req, res) => {
  
  req.logger.debug('Esto es un mensaje de depuración.');
  req.logger.info('Esto es un mensaje informativo.');
  req.logger.warning('Esto es una advertencia.');
  req.logger.error('Esto es un error.');
  req.logger.fatal('Esto es un error fatal.');

  res.send('Prueba de registros completada.');
});


export default router;