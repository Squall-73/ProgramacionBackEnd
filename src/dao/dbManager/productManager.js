import productsModel from "../models/products.js";
import mongoose from "mongoose";

export default class Products {
    async getAll(options, filter){
        try{
            const filterQuery = filter ? { code: new RegExp(`^${filter}[0-9]{4}$`, 'i') } : {};
            const response= await productsModel.paginate(filterQuery,options);
            
            return response;

        }catch(error){
            console.log(error);
            throw new Error("error fetching products")
        }
    
    }

    async getById(id){
        const objectId = new mongoose.Types.ObjectId(id);
        return await productsModel.findOne(objectId);
    }

    async getByCode(code){
        return await productsModel.findByCode(code);
    }

    async save(data) {
        const respuesta = productsModel.create(data);
        return respuesta;
      }
    
    async update(id, data){
        const respuesta = productsModel.findByIdAndUpdate(id, data);
        return respuesta;
    };
    
    async delete(id){
    const respuesta = productsModel.findByIdAndDelete(id);
    return respuesta;
    };  
}
