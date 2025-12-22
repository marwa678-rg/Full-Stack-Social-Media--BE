
//Imports
const mongoose = require("mongoose");
const dotenv= require("dotenv");

//Global Config
dotenv.config();

//data base connection 
async function connectToDatabase(){
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(`Mongo Cloud Connected successfully`)
    } catch (error) {
    console.log(error)
  }
}

module.exports={connectToDatabase}