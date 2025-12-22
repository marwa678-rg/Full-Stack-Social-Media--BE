
//Imports
const express = require("express");
const dotenv = require("dotenv");



//Global Config
dotenv.config();


//APP
const app = express();

const PORT=process.env.PORT || 3000;


//Main Route
app.get("/",(request,response)=>{
  response.send("Welcome To Our Backend ")
})

//SERVER
app.listen(PORT,function(){
  console.log(`Server is Running @ PORT: ${PORT}`)
})