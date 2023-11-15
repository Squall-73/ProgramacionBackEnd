import mongoose from "mongoose";


let userCollection = "users";

let userSchema = new mongoose.Schema({
  first_name: { type: String,  max: 100 },
  last_name: { type: String,  max: 100 },
  email: { type: String,  max: 100, unique: true },
  password: { type: String, max: 100 },
  age: { type: Number,  max: 100 },
  role: { type: String, max: 100,default: "user"},
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" } ,
  documents:{type: [{name: String, reference: String}], default:[]},
  last_connection: {type: Date, default:1/1/1900},
  identificationDoc:{type: Boolean, default: false}, //Se vuelve true cuando se sube la identificacion
  addressDoc:{type: Boolean, default: false},//Se vuelve true cuando se sube la documentacion de dirección
  accountDoc:{type: Boolean, default: false},//Se vuelve true cuando se sube la documentación de cuenta
});



userSchema.statics.findByEmail = async function (email) {
  return this.findOne({email});
}
let User = mongoose.model(userCollection, userSchema);
export default User;