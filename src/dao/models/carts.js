import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
import { CustomError } from "../../utils/errorHandler/customError.js";
import { errorDictionary } from "../../utils/errorHandler/errorDictionary.js";

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
    if(cart){
    return cart;
    }else{
      throw new CustomError(errorDictionary.CARTS_NOT_FOUND, 404);
  } 
  }catch (error) {
    req.logger.error(error.message);
    req.logger.error(`Código de error: ${error.errorCode}`);
  }
  
};
cartsSchema.plugin(mongoosePaginate);
const cartsModel = mongoose.model(cartsCollection, cartsSchema, cartsCollection);

export default cartsModel;