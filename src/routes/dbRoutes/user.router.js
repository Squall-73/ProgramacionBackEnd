import { Router } from "express";
import User from "../../dao/models/users.js";
import Users from "../../dao/dbManager/userManager.js";
import multer from 'multer'
import transporter from "../../utils/mailer/mailer.js";
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
  
  router.get("/allusers", async (req, res) => {
    
    let allUser = await users.getAll()
    allUser.forEach(user => {
      user.isAdmin = user.role === 'admin';
    });
    const serializedAllUser = JSON.stringify(allUser);
    res.render("users",{allUser, serializedAllUser})})
    
    
  router.post("/:userId/changerole", async (req, res) => {
    const { userId } = req.params;

    try {
        let user = await User.findById(userId);
        if(user.role==="user"){
          user.role="premium"
        }else if(user.role==="premium"){
          user.role="user"
        }
        await user.save()
        res.status(200).json({ message: "Rol de usuario actualizado exitosamente" });
    } catch (error) {
        
        res.status(500).json({ error: "Error al cambiar el rol del usuario" });
    }
  });

  router.delete("/:userId/delete", async (req, res) => {
    const { userId } = req.params;

    try {
        let user = await User.findByIdAndRemove(userId);
        res.status(200).json({ message: "Rol de usuario eliminado exitosamente" });
    } catch (error) {
        
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
  });

  router.delete("/delete",async (req,res)=>{
    const {allUser} = req.body
    const twoHoursAgo = new Date();
    try{
      twoHoursAgo.setDate(twoHoursAgo.getDate() - 2);
      const deletionPromises = allUser.map(async (element) => {
        if (new Date(element.last_connection) < twoHoursAgo) {
          let userId = element._id;
          await sendAccountDeletedEmail(element.email);
          await User.findByIdAndRemove(userId);
        }
      });
  
      await Promise.all(deletionPromises)
      res.sendStatus(200);
    } catch (error) {
        
      res.status(500).json({ error: "Error al eliminar usuarios" });
  }
    

    
  })
  
  async function sendAccountDeletedEmail(email) {
      
    const mailOptions = {
      from: 'pablolr73@gmail.com',
      to: email,
      subject: 'Tu cuenta ha sido eliminada',
      text: 'Hola, lamentamos informarte que tu cuenta ha sido eliminada por inactividad. Si tienes alguna pregunta, contáctanos.'
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
      } else {
        console.log('Correo electrónico enviado:', info.response);
      }
    });
  }

export default router;