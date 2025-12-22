
//Imports
const express = require("express");
const dotenv = require("dotenv");
const { connectToDatabase } = require("./config/dbConfig");



//Global Config
dotenv.config();


//APP
const app = express();

const PORT=process.env.PORT || 3000;


//Main Routes
app.get("/",(request,response)=>{
  response.send("Welcome To Our Backend ")
});



//Connect Cloud
connectToDatabase();

//SERVER connection
app.listen(PORT,function(){
  console.log(`Server is Running @ PORT: ${PORT}`)
})