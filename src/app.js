// This is the starting point of our DevTinder Project
require("dotenv").config();
const express = require("express");
const app = express();
const { connectDB } =  require("./config/database");
const cors = require("cors")

const cookieParser = require("cookie-parser");
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());

const {authRouter} = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/requests");
const {userRouter} = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);



connectDB().then(()=>{
    console.log("Connected to the database!");
    app.listen(process.env.PORT, ()=>{
    console.log("Server running successfully on port 3000...");
})
}).catch(err=>{
    console.error("Some error occured!: " + err.message);
})



