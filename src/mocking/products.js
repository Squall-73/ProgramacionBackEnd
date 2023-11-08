import {faker} from '@faker-js/faker/locale/en'



export const generateProduct=()=>{
    return{
        title:faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: codeGenerator(),
        stock: faker.number.int({max:100})
    }
}

export function codeGenerator() {
    const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
  
    // Generar las primeras cuatro letras aleatorias
    for (let i = 0; i < 4; i++) {
      const randomletter = letter.charAt(Math.floor(Math.random() * letter.length));
      code += randomletter;
    }
  
    // Generar los últimos cuatro dígitos aleatorios
    const randomNumber = Math.floor(Math.random() * 10000);
    const randomNumberString = randomNumber.toString().padStart(4, '0');
  
    code += randomNumberString;
  
    return code;
  }
  