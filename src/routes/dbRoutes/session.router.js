import { Router } from "express";
import User from "../../dao/models/users.js";
import cartsModel from "../../dao/models/carts.js";

const router = Router();

function auth(req, res, next) {
  console.log(req.session);
  if (req.session?.user && req.session?.admin) {
    return next();
  }
  return res.status(401).json("error de autenticacion");
}

router.post("/login", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  const result = await User.find({
    email: username,
    password,
  });
  console.log(result);
  if (result.length === 0)
    return res.status(401).json({
      respuesta: "error",
    });
  else {
    const newCart = await cartsModel.create({

    });

    req.session.user = username;
    req.session.admin = true;
    const cartId = newCart.id;
    console.log(cartId)
    res.status(200).json({
      respuesta: "ok",
      cartId: cartId,
    });
  }
});

router.post("/signup", async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;

  const result = await User.create({
    first_name,
    last_name,
    age,
    email,
    password,
  });

  if (result === null) {
    return res.status(401).json({
      respuesta: "error",
    });
  } else {
    req.session.user = email;
    req.session.admin = true;
    res.status(200).json({
      respuesta: "ok",
    });
  }
});

router.post("/logout", (req, res) => {
  
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ respuesta: "error" });
    }
    res.status(200).json({ respuesta: "ok" });
  });
});

export default router;