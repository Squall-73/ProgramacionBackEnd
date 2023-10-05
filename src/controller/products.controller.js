import { productDAO } from "../dao/index.js";
import passport from "passport";
import { CustomError } from "../utils/errorHandler/customError.js";
import { errorDictionary } from "../utils/errorHandler/errorDictionary.js";

async function getAll(req, res){
    const {limit, page, filter,sort, cartId, addedToCart} = req.query;
    const perPage = limit || 10; 

    const isAdmin = req.user.role;
  
    try{
        const sortOptions = {};
        if (sort === 'price') {
            sortOptions.price = 1;
        } else if (sort === '-price') {
            sortOptions.price = -1;
        }
        const options = {
            page: page || 1,
            limit: perPage,
            sort: sortOptions,
        };
        
        let response = await productDAO.getAll(options, filter);
        const lastPageItemCount = response.totalDocs % perPage;  
        const added = addedToCart==='true'
        if(response){
        if(response.docs){
       if(isAdmin==="admin"){
        res.render("productsAdmin",{response:response,
        products: response.docs.map(doc =>doc.toObject()),
        limit: perPage,
        totalPages: response.totalPages,
        currentPage: response.page,
        totalDocs: response.totalDocs,
        lastPageItemCount:lastPageItemCount,
        filter: filter,
        cartId:cartId,
        addedToCart: added,
        });}else{
        res.render("products",{response:response,
            products: response.docs.map(doc =>doc.toObject()),
            limit: perPage,
            totalPages: response.totalPages,
            currentPage: response.page,
            totalDocs: response.totalDocs,
            lastPageItemCount:lastPageItemCount,
            filter: filter,
            cartId:cartId,
            addedToCart: added,
            });
        }}else{
            res.render("fileproducts",{
                products: response,
                limit: perPage,
                totalPages: response.totalPages,
                currentPage: response.page,
                totalDocs: response.totalDocs,
                lastPageItemCount:lastPageItemCount,
                filter: filter,
                cartId:cartId,
                addedToCart: added,})
        }
        }else{
            throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
        }    
    }catch(error){
        console.error(error.message);
        console.error(`Código de error: ${error.errorCode}`);
    }
}

async function getById(req, res){
    let {pid} = req.params;
    try{
        let product = await productDAO.getById(pid);
        if(product){
            res.render("productById",{message: "success",product: Object.assign({}, product) });
        }else{
            throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
        }
    }catch(error){
        console.error(error.message);
        console.error(`Código de error: ${error.errorCode}`);
    }
}

async function save(req,res){
    const{title, description, price, thumbnail, code, stock}=req.body;

    if(!title||!description||!price||!code||!stock){
        return res.status(400).json({message: "Missing data"});
    }
    try{
        const product = await productDAO.getByCode(code);
        if(!product){
            productDAO.save({title, description, price, thumbnail, code, stock});
            const newProduct = {title, description, price, thumbnail, code, stock}

            res.render('productAdded', { productData: newProduct });
        }else{
            throw new CustomError(errorDictionary.PRODUCT_ALREADY_EXIST, 409);
        }
    }catch(error){
        console.error(error.message);
        console.error(`Código de error: ${error.errorCode}`);
    }
}

async function update(req,res){
    try{
        const{pid}=req.params;
        const {title, description, price, thumbnail, code, stock} = req.body;
        const product = await productDAO.getById(pid);
        if(product){
            let updatedProduct= await productDAO.update(pid,{title, description, price, thumbnail, code, stock})
            res.json({message:"Product updated", data: updatedProduct});
        }else{
            throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
        }
    }catch(error){
        console.error(error.message);
        console.error(`Código de error: ${error.errorCode}`);
    }
}

async function deleteProduct(req,res){
    try{
        let {pid}=req.params;
        let product = await productDAO.getById(pid);
        if(product){
            product.status=false;
            await product.save();
            res.json({message:"Product deleted", data: product});
        }else{
            throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
        }
    }catch(error){
        console.error(error.message);
        console.error(`Código de error: ${error.errorCode}`);
    }
}

async function activateProduct(req,res){
    try{
        let {pid}=req.params;
        let product = await productDAO.getById(pid);
        if(product){
            product.status=true;
            await product.save();
            res.json({message:"Product activated", data: product});
        }else{
            throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
        }
    }catch(error){
        console.error(error.message);
        console.error(`Código de error: ${error.errorCode}`);
    }
}

export {getAll, getById, save, update, deleteProduct, activateProduct}