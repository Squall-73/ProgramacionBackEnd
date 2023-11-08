import mongoose from "mongoose";
import assert from "assert";
import * as dotenv from "dotenv"
import Products from "../src/dao/dbManager/productManager.js";
import { describe, it, before } from "mocha";
import {faker} from '@faker-js/faker/locale/en'
import { codeGenerator } from "../src/mocking/products.js";
import supertest from "supertest"

dotenv.config();
const Assert = assert.strict

const MONGO_URL = "mongodb+srv://ppiazza:33242384Pp@ecommerce.x6tgjhj.mongodb.net/Ecommerce"
const requester = supertest("http://localhost:8080")


describe("Testing products Router", () => {
  describe("Testing products",() =>{
    let products;
  
    before(async () => {
      await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      products = new Products();
    });
  
    it("El endpoint /api/products/ GET must return products as an array", async () => {
      const result = await products.getAll();
      
      Assert.strictEqual(Array.isArray(result.docs), true);
    });
    it("El endpoint /api/products/ POST must save a product", async () => {
      let productmock = { 
        title:faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: codeGenerator(),
        stock: faker.number.int({max:100})
      }
      const response = await requester
      .post("/api/products")
      .send(productmock);
      assert.strictEqual(response.status, 200);
      assert.ok(response.ok);
    });
    it("El endpoint /api/products/:pid/activate PUT must activate a product", async () => {
      let productmock = { 
        title:faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: codeGenerator(),
        stock: faker.number.int({max:100}),
        status:false
      }

      const response= await requester.put(`/api/products/${productmock._id}/activate`)
      assert.strictEqual(response.status, 200);
      assert.ok(response.ok);

      const product = await Products.findById(productmock._id);
      assert.strictEqual(product.status, true);


    });
    
    after(async () => {
      await mongoose.connection.close();
    });
  })});