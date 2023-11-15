import passport from "passport";
import local from "passport-local"
import User from "../dao/models/users.js";
import cartsModel from "../dao/models/carts.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import GithubStrategy from "passport-github2"
import * as dotenv from "dotenv"
import crypto from "crypto"
//import { addCartToFile } from "../controller/cart.controller.js";
import { CustomError } from "../utils/errorHandler/customError.js";
import { errorDictionary } from "../utils/errorHandler/errorDictionary.js";

dotenv.config()

const LocalStrategy = local.Strategy
const GithubClientId = process.env.GITHUB_CLIENT_ID
const GithubClientSecret = "51bc7cf27631161fa97ca9e82ff33efdafe11710"
const GithubURL = process.env.GITHUB_URL_CALLBACK

const intializePassport = async()=>{
    
    passport.use("register",new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"},async(req,mail,pass,done)=>{
            const {first_name,last_name,email,user,password,age} = req.body
            try{
                const userAccount = await User.findOne({email: email})
                if(userAccount){
                    throw new CustomError(errorDictionary.USER_ALREADY_EXIST, 409);
                }else{
                    const newCart = await cartsModel.create({});
                    const cartId = newCart._id;
                    /*const cartData = {
                        id: cartId, 
                        products: [],
                      };
                    await addCartToFile(cartData);*/
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        user,
                        age,
                        password: createHash(password),
                        role: "user",
                        cart: cartId,
                        last_connection:Date.now()
                    }
                    const result = await User.create(newUser)
                    return done(null,result)
                }
            }catch(err){
                req.logger.warning(err.message);
                req.logger.warning(`Código de error: ${err.errorCode}`);
                
            }
        }))
    
    passport.use("login",new LocalStrategy (async(email,password,done)=>{
            try{
                const user = await User.findOne({email: email})
                        
                if(!user){
                    throw new CustomError(errorDictionary.USER_NOT_EXIST, 409);
                }   
                const valid = isValidPassword(user.password,password)
             
                if(valid){
                        user.last_connection=Date.now()
                        await User.findByIdAndUpdate(user._id, user)
                        return done(null,user)
                    }else{
                        throw new CustomError(errorDictionary.WRONG_PASSWORD, 401);
                    }
                
            }catch(err){
                console.log(err.message);
                console.log(`Código de error: ${err.errorCode}`);
            }
        }))

    passport.use("github",new GithubStrategy({
        clientID : GithubClientId,
        clientSecret: GithubClientSecret,
        callbackURL: GithubURL
    },async(accessToken,refreshToken,profile,done)=>{
          try{
            console.log(profile)
           const user = await User.findOne({email: profile?.emails[0]?.value})
           if(!user){ 
            const newCart = await cartsModel.create({});
            const cartId = newCart._id;

            function splitFullName(fullName) {
                const lastIndex = fullName.lastIndexOf(" ");
                const firstName = fullName.substring(0, lastIndex);
                const lastName = fullName.substring(lastIndex + 1);
                return [firstName, lastName];
            }

            const [firstName, lastName] = splitFullName(profile.displayName);
            const newUser = {
                first_name: firstName,
                last_name: lastName,
                email: profile?.emails[0]?.value,
                age:18,
                user: profile.username,
                password: crypto.randomUUID(),
                role: "admin",
                cart: cartId,
                last_connection:Date.now()
            }
            
            console.log(newUser)
            const result = await User.create(newUser)

            done(null,result)
           }else{
            user.last_connection=Date.now()
            await User.findByIdAndUpdate(user._id, user)
            done(null,user)
           }
          }catch(err){
            done(err,null)
          }
    }))
 
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        done(null, user) 
    })
}

export default intializePassport