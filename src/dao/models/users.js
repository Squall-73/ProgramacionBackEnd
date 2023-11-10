import mongoose from "mongoose";


let userCollection = "users";

let userSchema = new mongoose.Schema({
  first_name: { type: String,  max: 100 },
  last_name: { type: String,  max: 100 },
  email: { type: String,  max: 100, unique: true },
  password: { type: String, max: 100 },
  age: { type: Number,  max: 100 },
  role: { type: String, max: 100,default: "user"},
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" } 
});



userSchema.statics.findByEmail = async function (email) {
  return this.findOne({email});
}
let User = mongoose.model(userCollection, userSchema);
export default User;