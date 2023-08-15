import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const cartsCollection = "Carts";

const cartsSchema = new mongoose.Schema({
  user: String,

  products: {
    type: [{id: String,
            quantity: Number}],
    default: [],
  }
});

cartsSchema.plugin(mongoosePaginate);
const cartsModel = mongoose.model(cartsCollection, cartsSchema, cartsCollection);

export default cartsModel;