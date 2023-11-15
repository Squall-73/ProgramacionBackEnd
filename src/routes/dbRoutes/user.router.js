import { Router } from "express";
import User from "../../dao/models/users.js";
import Users from "../../dao/dbManager/userManager.js";
import multer from 'multer'
import { __dirname } from "../../utils/utils.js";
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
      if (file.fieldname === 'profileImage') {
        uploadPath = path.join(__dirname, '/../uploads/profiles/');
      } else if (file.fieldname === 'productImage') {
        uploadPath = path.join(__dirname, '/../uploads/products/');
      } else if (file.fieldname === 'document') {
        uploadPath = path.join(__dirname, '/../uploads/documents/');
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
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

    console.log(path.join(__dirname, '/../uploads/documents/'))
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
    
  console.log(user.identificationDoc)
    await User.findByIdAndUpdate(userId, user);
    if(user.identificationDoc && user.addressDoc && user.accountDoc ){
        user.role="premium"
        await User.findByIdAndUpdate(userId, user);
      res.sendStatus(200);
    }
    else{
        return res.render("error", {
            title: "Error",
            message: "No se ha terminado de cargar la documentación"
          });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send('Error interno');
  }
  });
  

export default router;