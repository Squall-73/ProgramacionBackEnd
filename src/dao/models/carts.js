import mongoose from "mongoose";

const cartsCollection = "Carts";

const cartsSchema = new mongoose.Schema({
  products: {
    type: Array,
    default: [],
  }
});
const cartsModel = mongoose.model(cartsCollection, cartsSchema, "Carts");

export default cartsModel;
