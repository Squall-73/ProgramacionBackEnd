import mongoose from "mongoose";
import chai from "chai";
import { describe, it, before, after } from "mocha";
import supertest from "supertest";
import dotenv from "dotenv";

dotenv.config();

const expect = chai.expect;
const MONGO_URL = "mongodb+srv://ppiazza:33242384Pp@ecommerce.x6tgjhj.mongodb.net/Ecommerce";
const requester = supertest("http://localhost:8080");


describe("Testing register", () => {
  describe("Testing user", () => {
    before(async () => {
      await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    it("must register a user", async () => {
      const mockUser = {
        first_name: "test",
        last_name: "user",
        email: "test@user.com",
        password: "1234",
        age: 18,
      };

      const response = await requester.post("/api/session/signup").send(mockUser);

      expect(response.status).to.equal(200); // Verifica que la respuesta sea 200 (OK)
      expect(response.body.status).to.equal("OK"); // Verifica el estado de la respuesta
      expect(response.body.message).to.equal("User created"); // Verifica el mensaje de la respuesta
      expect(response.body.user).to.exist; // Verifica que la información del usuario esté presente

      const registeredUser = response.body.user;
      expect(registeredUser.first_name).to.equal(mockUser.first_name); // Verifica el primer nombre
      expect(registeredUser.last_name).to.equal(mockUser.last_name); // Verifica el apellido
      expect(registeredUser.email).to.equal(mockUser.email); // Verifica el correo electrónico
 
    });

    after(async () => {
      await mongoose.connection.close();
    });
  });
});