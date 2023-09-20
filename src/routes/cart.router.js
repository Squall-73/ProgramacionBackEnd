import { Router } from "express";
import Carts from "../dao/dbManager/cartManager.js";
import {getAll, getById, save, saveProduct, update, deleteCart, removeProduct} from "../controller/cart.controller.js";


const router = Router();
const carts = new Carts();


router.get("/", getAll);
router.get("/:cid", getById);
router.post("/",save);
router.post("/:cid/product/:pid",saveProduct);
router.delete("/:cid/products/:pid",removeProduct)
router.put("/:cid/products/:pid",update)
router.delete("/:cid",deleteCart)

export default router;
