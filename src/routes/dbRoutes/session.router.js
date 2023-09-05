import { Router } from "express";
import cartsModel from "../../dao/models/carts.js";
import passport from "passport";




const router = Router();


router.post("/login",passport.authenticate("login", {failureRedirect: "/failLogin"}),
  async (req, res) => {
 
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      cart: req.user.cart
    };

    req.session.admin = true;

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
    req.session.user = req.user;
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
    return res.render("current", {
      title: "User",
      user: user
    });
  } else {
    return res.render("error", {
      title: "Error",
      message: "No estás autenticado"
    });
  }
});


export default router;