import usersModel from "../models/users.js";
import mongoose from "mongoose";

export default class Users {
    async getAll(){
        return await usersModel.find({}).lean();
    }

    async getUserNameById(id){
        const objectId = new mongoose.Types.ObjectId(id);
        const user = await usersModel.findOne(objectId);
        return user
    }
    async getById(id){
        const objectId = new mongoose.Types.ObjectId(id);
        return await usersModel.findOne(objectId);
    }

    async save(data) {
        const respuesta = usersModel.create(data);
        return respuesta;
      }
    
    async update(id, data){
        const respuesta = usersModel.findByIdAndUpdate(id, data);
        return respuesta;
    };
    
    async delete(id){
    const respuesta = usersModel.findByIdAndDelete(id);
    return respuesta;
    };  
}
