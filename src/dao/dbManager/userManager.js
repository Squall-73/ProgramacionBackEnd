import usersModel from "../models/users.js";
import mongoose from "mongoose";

export default class Users {
    async getAll(){
        return await usersModel.find({}).lean();
    }

    async getUserNameById(id){
        let objectId = new mongoose.Types.ObjectId(id);
        let user = await usersModel.findOne(objectId);
        return user
    }
    async getById(id){
        let objectId = new mongoose.Types.ObjectId(id);
        return await usersModel.findOne(objectId);
    }

    async save(data) {
        let respuesta = usersModel.create(data);
        return respuesta;
      }
    
    async update(id, data){
        let respuesta = usersModel.findByIdAndUpdate(id, data);
        return respuesta;
    };
    
    async delete(id){
    let respuesta = usersModel.findByIdAndDelete(id);
    return respuesta;
    };  
}
