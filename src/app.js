// This the starting point of our DevTinder Project
const express = require("express");
const app = express();

const { connectDB }=  require("./config/database");
const User = require("./models/user")

app.use(express.json());


// /get API - get  user by Email
// app.get("/user", async (req,res)=>{
//     const userEmail = req.body.emailId;

//     try{
//         // gives an array of objects
//         const users = await User.find({emailId : userEmail});
//         if(users.length===0){
//             res.status(400).send("User not found");
//         }
//         else{
//             res.send(users);
//         }
        
//     }
//     catch(err){
//         res.status(400).send("Something went wrong");
//     }
    

// })

// findOne
app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;

    try{
        // gives an array of objects
        const users = await User.findOne({});
        if(users.length===0){
            res.status(400).send("User not found");
        }
        else{
            res.send(users);
        }
        
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
    

})

// /feed API  - get all users data from the database
app.get("/feed", async(req,res)=>{

    try{
        const users = await User.find({});
        if(users.length === 0){
            res.status(400).send("user not found");
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
    

})




//creating a post api
app.post("/signup", async(req,res)=>{
    // logic to add data into the database
    console.log(req.body);
    
    // creating an instance of the User model
    const user = new User(req.body);

    try{
        await user.save()
        res.send("User added successfully!");
    }
    catch(err){
        res.status(400).send("something went wrong, user hasn't been inserted")
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




