import productsModel from "../models/products.js";
import mongoose from "mongoose";
import { errorDictionary } from "../../utils/errorHandler/errorDictionary.js";
import { CustomError } from "../../utils/errorHandler/customError.js";

export default class Products {
    async getAll(options, filter){
        try{
            const filterQuery = filter ? { code: new RegExp(`^${filter}[0-9]{4}$`, 'i') } : {};
            const response= await productsModel.paginate(filterQuery,options);
            if(response){
            return response;
            }else{
                throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
            }
        }catch(error){
            console.error(error.message);
            console.error(`Código de error: ${error.errorCode}`);          
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
