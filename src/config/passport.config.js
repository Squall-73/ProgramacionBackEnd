import passport from "passport";
import local from "passport-local"
import User from "../dao/models/users.js";
import { createHash, isValidPassword } from "../utils.js";
import GithubStrategy from "passport-github2"
import * as dotenv from "dotenv"
import crypto from "crypto"

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
                    return done(null,false,{message: "Tu usuario ya existe"})
                }else{
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        user,
                        age,
                        password: createHash(password),
                    }
                    const result = await User.create(newUser)
                    return done(null,result)
                }
            }catch(err){
                return done(err)
            }
        }))

    passport.use("login",new LocalStrategy (async(email,password,done)=>{
            try{
                const user = await User.findOne({email: email})
                             
                if(!user){
                    return done(null,false,{message: "Tu usuario no existe"})
                }
                const valid = isValidPassword(user.password,password)
                if(valid){
                        return done(null,user)
                    }else{
                        return done(null,false,{message: "Contraseña incorrecta"})
                    }
                
            }catch(err){
                return done(err)
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
            const newUser = {
                first_name: profile.displayName,
                last_name: profile.displayName,
                email: profile?.emails[0]?.value,
                age:18,
                user: profile.username,
                password: crypto.randomUUID()
            }
            const result = await User.create(newUser)
            done(null,result)
           }else{
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
        let user = await User.findById(id)
        done(null, user) 
    })
}

export default intializePassport