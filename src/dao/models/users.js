import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const usersCollection = "Users";

const usersSchema = new mongoose.Schema({
    userName:{ type: String,
                required: true},
});

usersSchema.plugin(mongoosePaginate);
const usersModel = mongoose.model(usersCollection, usersSchema, usersCollection);

export default usersModel;
