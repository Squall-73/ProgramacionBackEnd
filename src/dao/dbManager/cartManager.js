import cartsModel from "../models/carts.js";
import mongoose from "mongoose";

export default class Carts {
    async getAll(){
    return await cartsModel.find({}).lean();
    }

    async getById(id){
        const objectId = new mongoose.Types.ObjectId(id);
        return await cartsModel.findOne(objectId);
    }

    async save(data) {
        const respuesta = cartsModel.create(data);
        return respuesta;
    }
    
    async update(id, data){
        const respuesta = cartsModel.findByIdAndUpdate(id, data);
        return respuesta;
    };

    async delete(id){
    const respuesta = cartsModel.findByIdAndDelete(id);
    return respuesta;
    };  
}
