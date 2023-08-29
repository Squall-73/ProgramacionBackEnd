import { Router } from "express";
import User from "../../dao/models/users.js";
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
    };

    req.session.admin = true;

    const newCart = await cartsModel.create({});
    const cartId = newCart.id;
    console.log(req.session.user)
    console.log(cartId)
    res.status(200).json({
      status: "OK",
      message: "User logged in",
      user: req.session.user,
      cartId: cartId,
    });
  });


router.post("/signup", passport.authenticate("register", {failureRedirect: "/failRegister"}),
  async(req,res)=>{
    req.session.user = req.user;
    req.login(req.user, async (err) => {
      if (err) {
        console.error("Error during login:", err);
        return res.redirect("/");
      }
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
      };
  
        const newCart = await cartsModel.create({});
        const cartId = newCart.id;
      console.log(req.session.user)  
      console.log(cartId) 
      res.status(200).json({
        status: "OK",
        message: "User created",
        user: req.session.user,
        cartId: cartId,
      });
    });
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

    req.session.user = req.user;
    req.login(req.user, async (err) => {
      if (err) {
        console.error("Error during login:", err);
        return res.redirect("/");
      }
        const newCart = await cartsModel.create({});
        const cartId = newCart.id;
      res.redirect(`/api/products?cartId=${cartId}`);
    });
})

router.post("/logout", (req, res) => {
  
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ respuesta: "error" });
    }
    res.status(200).json({ respuesta: "ok" });
  });
});

export default router;