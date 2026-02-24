const express = require("express")
const authRouter = express.Router()

const {validateSignUpData, validateLoginData} = require("../utils/validation")
const bcrypt = require("bcrypt");
const User = require("../models/user");


authRouter.post("/signup", async(req, res)=>{
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


authRouter.post("/login", async (req,res)=>{
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



module.exports = {
    authRouter
}
