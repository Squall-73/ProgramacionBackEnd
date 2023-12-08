import { Router } from "express";
import cartsModel from "../../dao/models/carts.js";
import passport from "passport";
import User from "../../dao/models/users.js";
import UserDTO from "../../dao/DTOs/user.dto.js";
import Users from "../../dao/dbManager/userManager.js";
import { cartDAO, productDAO } from "../../dao/index.js";
import { addLogger } from "../../utils/logger/logger.js";
import jwt from 'jsonwebtoken';
import transporter from "../../utils/mailer/mailer.js";
import { jwtSecret } from "../../config/config.js";
import { createHash, isValidPassword } from "../../utils/utils.js";

let router = Router();
let users = new Users();

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
   
    let cartId = req.user.cart._id;
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
    let newCart = await cartsModel.create({});
    let cartId = newCart.id;
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

  let cartId = req.session.passport.user.cart


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
    let user = req.user;
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
  let user=req.user;
  let userId=user.id
  let cartId = req.user.cart
  let cart = await cartDAO.getById(cartId)
  let detailProducts = []
  let noStock = []

 
  for(let i=0;i<cart.products.length;i++){
    let productID=cart.products[i].id
    let detail = await productDAO.getById(productID)
    let quantity= cart.products[i].quantity
    let cost= detail.price*quantity
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

router.get("/recover", async (req,res) => {
  res.render("resetPassword")
})
router.post("/recover", async (req, res) => {
  let { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.render("recover", {
        title: "Recuperar Contraseña",
        error: "Usuario no encontrado",
      });
    }

   
    let token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: '1h', 
    });
    
      res.locals.mailSent = true;
      // La solicitud fue exitosa, ahora envía el correo electrónico al usuario
      let mailOptions = {
        from: 'pablolr73@gmail.com', // Tu dirección de correo electrónico
        to: email, // La dirección de correo electrónico del usuario
        subject: 'Recuperación de contraseña',
        text: `Haz clic en el siguiente enlace para recuperar tu contraseña: ${window.location.origin}/api/session/reset-password/${token}`,
      };
      // Envía el correo electrónico
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Error al enviar el correo electrónico:', error);
        } else {
          console.log('Correo electrónico enviado:', info.response);
          res.redirect(`${window.location.origin}?mailSent=true`)
        }
      });
    
  } catch (error) {
    console.error(error);
    return res.render("error", {
      title: "Error",
      message: "Hubo un problema al procesar su solicitud",
    });
  }
});

router.get("/reset-password/:token", async (req, res) => {
  let token = req.params.token;
  
  try {
    return res.render("newPass", {
      title: "Restablecer Contraseña",
      token: token,
    });
  } catch (error) {
    
    return res.redirect(`${window.location.origin}/api/session/recover`);
  }
});

router.post("/reset-password/", async (req, res) => {
  let { token, password, password2 } = req.body;
  
  try {
    let decoded = jwt.verify(token, jwtSecret);
    let userId = decoded.userId;
    
    if (password !== password2) {
      return res.render("resetPassword", {
        title: "Restablecer Contraseña",
        token: token,
        error: "Las contraseñas no coinciden",
      });
    }
    
    let user = await User.findById(userId);
    let lastpass = user.password;
    let hashedpass = createHash(password);

    if (isValidPassword(lastpass, password)) {
      console.log("La contraseña no puede ser igual a la anterior");
      return res.status(400).render("resetPassword", {
        title: "Restablecer Contraseña",
        token: token,
        error: "La contraseña no puede ser igual a la anterior",
      });
    } else {
      console.log("Contraseña actualizada");
      user.password = hashedpass;
      await user.save();
      res.redirect(`${window.location.origin}`);
    }
  } catch (error) {
    return res.redirect(`${window.location.origin}/api/session/recover`);
  }
});


router.get("/updateProduct", async (req, res) => {
  let{email,role}=req.query
  let options={limit:100};
  let response = await productDAO.getAll(options);
  let lastPageItemCount = response.totalDocs % options.limit; 
  let filteredResponse = response.docs.filter(item => item.owner === email)

  res.render("updateProduct",{
        response:response,
        products: filteredResponse,
        limit: options.limit,
        totalPages: response.totalPages,
        currentPage: response.page,
        totalDocs: response.totalDocs,
        lastPageItemCount:lastPageItemCount,
        
      })})

router.delete("/deleteuser/:uid", async (req,res)=>{
  const {uid} = req.params
  try{
  await User.findByIdAndDelete(uid)
  res.sendStatus(200)
  }catch{
    res.sendStatus(403)
  }
})
  
export default router;