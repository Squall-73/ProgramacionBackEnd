import mongoose from "mongoose";
import assert from "assert";
import * as dotenv from "dotenv"
import Carts from "../src/dao/dbManager/cartManager.js";
import { describe, it, before } from "mocha";

import supertest from "supertest"

dotenv.config();
const Assert = assert.strict

const MONGO_URL = "mongodb+srv://ppiazza:33242384Pp@ecommerce.x6tgjhj.mongodb.net/Ecommerce"
const requester = supertest(`${window.location.origin}`)


describe("Testing carts Router", () => {
  describe("Testing carts",() =>{
    let carts;
    let user;
    before(async () => {
      await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
   
      carts = new Carts();

    });
  
    it("El endpoint /api/carts/ GET must return carts as an array", async () => {
      const result = await carts.getAll();
      
      Assert.strictEqual(Array.isArray(result), true);
    });
    it("El endpoint /api/carts/ POST must save a cart", async () => {
      
      const response = await requester
      .post("/api/carts/")
      .send();
      
      assert.strictEqual(response.status, 200);
      assert.ok(response.ok);
    });
   
    after(async () => {
      await mongoose.connection.close();
    });
  })});