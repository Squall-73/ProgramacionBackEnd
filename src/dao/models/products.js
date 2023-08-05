import mongoose from "mongoose";

const productsCollection = "Products";

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: Array,
  status: {
    type: Boolean,
    default: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

productsSchema.statics.findByCode = async function (code) {
  return this.findOne({code});
}
const productsModel = mongoose.model(productsCollection, productsSchema, "Products");

export default productsModel;
