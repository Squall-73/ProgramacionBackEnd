import mongoose from "mongoose";

const cartsCollection = "Carts";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [{id: String,
            quantity: Number}],
    default: [],
  }
});
const cartsModel = mongoose.model(cartsCollection, cartsSchema, cartsCollection);

export default cartsModel;
