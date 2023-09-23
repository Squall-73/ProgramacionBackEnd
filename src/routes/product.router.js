import { Router } from "express";
import { getAll, getById, save, update, deleteProduct, activateProduct } from "../controller/products.controller.js";

const router = Router();
router.get("/",getAll);
router.get("/:pid",getById);
router.post("/",save);
router.put("/:pid",update);
router.put("/:pid/activate",activateProduct)
router.delete("/:pid",deleteProduct)
export default router;
