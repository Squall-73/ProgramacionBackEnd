import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const ticketCollection = "Tickets";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique:true,
  },
  purchase_datetime: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required:true,
  },
  purcharser: {
    type: String,
    required: true,
  }
});


ticketSchema.statics.findByCode = async function (code) {
  return this.findOne({code});
}


ticketSchema.plugin(mongoosePaginate);
const ticketModel = mongoose.model(ticketCollection, ticketSchema, ticketCollection);

export default ticketModel;