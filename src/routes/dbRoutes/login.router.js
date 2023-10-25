import { Router } from "express";

let router = Router();

router.get("", (req, res) => {
  res.render("login", {
    title: "Inicia sesion",
  });
});

export default router;