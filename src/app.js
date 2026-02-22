// This is the starting point of our DevTinder Project
const express = require("express");
const app = express();
const { connectDB } =  require("./config/database");
const User = require("./models/user");
const {validateSignUpData, validateLoginData} = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const user = require("./models/user");
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());


//creating a post api
app.post("/signup", async(req, res)=>{
    try{
    // validate the data
    validateSignUpData(req)
    const {firstName, lastName, emailId, password} = req.body;
    console.log(password)
    // encrypt the password
    const passwordHash = await bcrypt.hash(password,10);
    console.log(passwordHash);

    
    // creating an instance of the User model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password : passwordHash
    });


        await user.save()
        res.send("User added successfully!");
    }
    catch(err){
        res.status(400).send(err.message)
    }
    

    
})

app.post("/login", async (req,res)=>{
    try{
        
        validateLoginData(req);
        const{emailId, password} = req.body;
        // check if emailId is present or not
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Email ID not found in the Database.");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){

            const token = await user.getJWT();
            res.cookie("token",token,{
                expires : new Date(Date.now() + 1 * 3600000)
            });
            res.send("Welcome User!");
            
        }
        else{
            throw new Error("Wrong password, please try again");
        }
        
    }
    
    catch(err){
        res.status(400).send(err.message);
    }
})

app.get("/profile",userAuth, async (req, res)=>{

    try{
        const { user } = req;


    // get the userData from the hiddenID
    res.send(user)
    }
    catch(err){
        res.status(400).send("ERROR "+ err.message);
    }
    
})

app.post("/sendConnectionRequest", userAuth, async(req, res)=>{
    const user = req.user;
    console.log("Sending a connection request!");

    res.send(user.firstName + " sent a Connection Request!");
})

connectDB().then(()=>{
    console.log("Connected to the database!");
    app.listen(3000, ()=>{
    console.log("Server running successfully on port 3000...");
})
}).catch(err=>{
    console.error("Some error occured!");
})




