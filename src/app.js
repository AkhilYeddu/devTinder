// This is the starting point of our DevTinder Project
const express = require("express");
const app = express();
const { connectDB } =  require("./config/database");

const cookieParser = require("cookie-parser");




app.use(express.json());
app.use(cookieParser());

const {authRouter} = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/requests");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);



connectDB().then(()=>{
    console.log("Connected to the database!");
    app.listen(3000, ()=>{
    console.log("Server running successfully on port 3000...");
})
}).catch(err=>{
    console.error("Some error occured!");
})




