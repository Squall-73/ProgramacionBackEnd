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


cartsSchema.statics.getByIdWithProducts = async function (cartId) {
  try {
    const cart = await this.findById(cartId).populate("products.id");
    return cart;
  } catch (error) {
    throw new Error("Can't get cart with products");
  }
};
cartsSchema.plugin(mongoosePaginate);
const cartsModel = mongoose.model(cartsCollection, cartsSchema, cartsCollection);

export default cartsModel;