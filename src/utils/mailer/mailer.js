import nodemailer from "nodemailer";
import * as dotenv from "dotenv"

dotenv.config();
const user= process.env.mail
const pass=process.env.mailpass
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: user,
      pass: pass,
    },
  });
  
export default transporter