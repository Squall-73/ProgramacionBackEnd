import { Router } from "express";
import Users from "../../dao/dbManager/userManager.js";
import Carts from "../../dao/dbManager/cartManager.js";

const router = Router();
const user=new Users();
const cart=new Carts();

router.get("/api/", async (req, res) => {
    try{
        res.render("home");
    }catch(error){
        console.log(error)
    }
});

router.post("/api/login", async (req,res) =>{
try{
    const userQuantity = (await user.getAll()).length;
    const newUserName = "User " + (userQuantity+1);
    const newUser = await user.save({userName: newUserName});
    const newCart = await cart.save({user:newUser});
    const cartId = newCart._id;
    res.redirect(`/api/products?cartId=${cartId}`);
    
}catch(error){
    console.log(error)
}

})

export default router;