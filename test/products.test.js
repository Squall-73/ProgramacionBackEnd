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
const requester = supertest(`${window.location.origin}`)


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
    
    
    after(async () => {
      await mongoose.connection.close();
    });
  })});