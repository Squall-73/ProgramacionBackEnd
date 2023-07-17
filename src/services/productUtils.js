import fs from "fs";
import path from "path";
import { __dirname } from "../utils.js";

export function obtenerListaDeProductos() {
  const filePath = path.join(__dirname, "./products.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContent);

  return data;
}

export function saveProducts({
  name,
  price,
  thumbnail,
  description,
  title,
}) {
  const filePath = path.join(__dirname, "./products.json");
  const fileContent = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContent);

  data.push({
    name: name,
    price: price,
    thumbnail: thumbnail,
    description: description,
    title: title,
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}