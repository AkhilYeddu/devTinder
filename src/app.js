// This the starting point of our DevTinder Project
const express = require("express");
const app = express();

const { connectDB }=  require("./config/database");
const User = require("./models/user")

//creating a post api
app.post("/signup", async(req,res)=>{
    // logic to add data into the database
    
    // creating an instance of the User model
    const user = new User({
        firstName: "Akhil",
        lastName: "Yeddu",
        emailId : "akhilkiu10@gmail.com",
        password : "Ajayakki@ 05"
    })

    try{
        await user.save()
        res.send("User added successfully!");
    }
    catch(err){
        res.send("something went wrong, user hasn't been inserted")
    }
    

    
})

connectDB().then(()=>{
    console.log("Connected to the database!");
    app.listen(3000, ()=>{
    console.log("Server running successfully on port 3000...");
})
}).catch(err=>{
    console.error("Some error occured!");
})




