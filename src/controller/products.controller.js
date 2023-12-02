import { productDAO } from "../dao/index.js";
import passport from "passport";
import { CustomError } from "../utils/errorHandler/customError.js";
import { errorDictionary } from "../utils/errorHandler/errorDictionary.js";
import transporter from "../utils/mailer/mailer.js"
async function getAll(req, res){
    let {limit, page, filter,sort, cartId, addedToCart} = req.query;
    let perPage = limit || 10; 

    let isAdmin = req.user.role;
  
    try{
        let sortOptions = {};
        if (sort === 'price') {
            sortOptions.price = 1;
        } else if (sort === '-price') {
            sortOptions.price = -1;
        }
        let options = {
            page: page || 1,
            limit: perPage,
            sort: sortOptions,
        };
        
        let response = await productDAO.getAll(options, filter);
        let lastPageItemCount = response.totalDocs % perPage;  
        let added = addedToCart==='true'
        if(response){
        if(response.docs){
       if(isAdmin.toLowerCase() ==="admin"){
        
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
        role:req.user.role,
        email:req.user.email,
        
        });}else{
            let premium=false;
            if(req.user.role==="premium"){ premium=true}
            
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
            userId:req.user.id,
            role:req.user.role,
            email:req.user.email,
            premium:premium,
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
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
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
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
    }
}

async function save(req,res){
    let{title, description, price, thumbnail, code, stock}=req.body;
    let email = req.user.email
    if(!title||!description||!price||!code||!stock){
        return res.status(400).json({message: "Missing data"});
    }
    try{
        let product = await productDAO.getByCode(code);
        if(!product){
            let data={title, description, price, thumbnail, code, stock,owner: email}
            productDAO.save(data);
            let newProduct = {title, description, price, thumbnail, code, stock, email}

            res.render('productAdded', { productData: newProduct });
        }else{
            throw new CustomError(errorDictionary.PRODUCT_ALREADY_EXIST, 409);
        }
    }catch(error){
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
    }
}

async function update(req,res){
    try{
        let{pid}=req.params;
        let {title, description, price, thumbnail, code, stock} = req.body;
        let product = await productDAO.getById(pid);
        if(product){
            let updatedProduct= await productDAO.update(pid,{title, description, price, thumbnail, code, stock})
            res.json({message:"Product updated", data: updatedProduct});
        }else{
            throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
        }
    }catch(error){
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
    }
}

async function deleteProduct(req,res){
    try{
        let {pid}=req.params;
        let product = await productDAO.getById(pid);
        if(product){
            await sendProductDeletedEmail(product.owner, product.title);
            await productDAO.delete(pid)
            res.json({message:"Product deleted", data: product});
        }else{
            throw new CustomError(errorDictionary.PRODUCTS_NOT_FOUND, 404);
        }
    }catch(error){
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
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
        req.logger.warning(error.message);
        req.logger.warning(`Código de error: ${error.errorCode}`);
    }
}

async function sendProductDeletedEmail(email, product) {
      
    const mailOptions = {
      from: 'pablolr73@gmail.com',
      to: email,
      subject: 'Tu producto ' + product + ' ha sido eliminado',
      text: 'Hola, lamentamos informarte que tu producto ' + product + ' ha sido eliminado. Si tienes alguna pregunta, contáctanos.'
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
      } else {
        console.log('Correo electrónico enviado:', info.response);
      }
    });
  }

export {getAll, getById, save, update, deleteProduct, activateProduct}