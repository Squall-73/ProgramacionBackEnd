import { Router } from "express";
import User from "../../dao/models/users.js";
import Users from "../../dao/dbManager/userManager.js";
import multer from 'multer'

import path from "path"

let router = Router();
let users = new Users();

router.get("/updateUser", async (req, res) => {
    const userId = req.query.user
    const cartId= req.query.cartId
    
    res.render("updateUser",{ userId: userId,user:req.user, cartId: cartId})})
    
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath = '';
      
      if (file.fieldname.toLowerCase().includes('profileImage')) {
        uploadPath = path.join(process.cwd(), 'uploads', 'profiles');
      } else if (file.fieldname.toLowerCase().includes('productImage')) {
        uploadPath = path.join(process.cwd(), 'uploads', 'products');
      } else if (file.fieldname.toLowerCase().includes('document')) {
        uploadPath = path.join(process.cwd(), 'uploads', 'documents');
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' +  req.params.userId.toString()+ file.originalname );
    }
  });
  const upload = multer({ storage: storage });
  
router.post('/:userId/documents', upload.fields([
    { name: 'identificationDocument', maxCount: 1 },
    { name: 'addressDocument', maxCount: 1 },
    { name: 'accountDocument', maxCount: 1 }
  ]), async (req, res) => {
    const userId = req.params.userId;
    const uploadedDocuments = req.files;
    
    try{
    let user = await User.findById(userId);
    const keys = Object.keys(uploadedDocuments);

    
    keys.forEach(key => {
        const fileArray = uploadedDocuments[key];
        const file = fileArray[0];
        if (key === 'identificationDocument') {
            user.identificationDoc = true;
          } else if (key === 'addressDocument') {
            user.addressDoc = true;
          } else if (key === 'accountDocument') {
            user.accountDoc = true;
          }
      })
    
  
    await User.findByIdAndUpdate(userId, user);
    if (user.identificationDoc && user.addressDoc && user.accountDoc) {
      user.role = "premium";
      await User.findByIdAndUpdate(userId, user);
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: 'Error interno' });
  }
  });
  

export default router;