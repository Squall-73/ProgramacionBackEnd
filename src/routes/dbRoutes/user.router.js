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

export default router;