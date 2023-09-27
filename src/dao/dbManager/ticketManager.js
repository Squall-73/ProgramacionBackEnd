import ticketModel from "../models/ticket.js";
import mongoose from "mongoose";

export default class Tickets {
    
    async getAll(){
    return await ticketModel.find({}).lean();
    }

    async getById(id){
        const objectId = new mongoose.Types.ObjectId(id);
        return await ticketModel.findOne(objectId);
    }

    async save(data) {
        const respuesta = ticketModel.create(data);
        return respuesta;
    }
    
    async delete(id){
    const respuesta = ticketModel.findByIdAndDelete(id);
    return respuesta;
    };  

    async getByCode(code){
        return await ticketModel.findByCode(code)
    }

 }
