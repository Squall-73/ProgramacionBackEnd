import { Router } from "express";
import Users from "../../dao/dbManager/userManager.js";
import { cartDAO } from "../../dao/index.js";

let router = Router();
let user=new Users();


router.get("/api/", async (req, res) => {
    try{
        res.render("home");
    }catch(error){
        console.log(error)
    }
});

router.post("/api/login", async (req,res) =>{
try{
    let userQuantity = (await user.getAll()).length;
    let newUserName = "User " + (userQuantity+1);
    let newUser = await user.save({userName: newUserName});
    let newCart = await cartDAO.save({user:newUser});
    let cartId = newCart._id;
    res.redirect(`/api/products?cartId=${cartId}`);
    
}catch(error){
    console.log(error)
}

})

export default router;