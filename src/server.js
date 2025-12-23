
//Imports
const express = require("express");
const dotenv = require("dotenv");
const cors =require("cors");
const { default: rateLimit } = require("express-rate-limit");

//Internal Imports
const { connectToDatabase } = require("./config/dbConfig");
const authRoutes = require("./routes/authRoutes");


//Global Config
dotenv.config();


//APP
const app = express();


//Global Middlewares
app.use(express.json());
app.use(cors({
  origin:JSON.parse(process.env.PRODUCTION_ENV) ?
   process.env.CLIENT_ORIGIN : "*"}));

const PORT=process.env.PORT || 3000;

//Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit:100,
});
app.use(limiter);

//Main Routes
app.get("/",(request,response)=>{
  response.send("Welcome To Our Backend ")
});


//API Routes
app.use("/api/v1/auth",authRoutes)



//Connect Cloud
connectToDatabase();

//SERVER connection
app.listen(PORT,function(){
  console.log(`Server is Running @ PORT: ${PORT}`)
})