import ProductManager from "./fileManager/ProductManager.js";
import Products from "./dbManager/productManager.js";
import CartManager from "./fileManager/cartManager.js";
import Carts from "./dbManager/cartManager.js";
import {PERSISTENCE} from "../config/config.js"
import dotenv from "dotenv";

dotenv.config();
const productPath = process.env.productPath;
const cartPath = process.env.cartPath;

export const productDAO = PERSISTENCE === "MONGO"  ? new Products() : new ProductManager(productPath);
export const cartDAO = PERSISTENCE === "MONGO"  ? new Carts() : new CartManager('E:/Programacion/Programacion Backend/Entregables/src/dao/fileJSON/carts.json');
