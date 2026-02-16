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
        const users = await User.findOne({emailId:userEmail});
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

// get user BY ID
app.get("/userId",async (req,res)=>{
    try{
        const id = req.body._id;
        const users = await User.findById({_id: id})

    if(users.length === 0){
        res.status(400).send("Users not found");
    }
    else{
        res.send(users);
    }

    }catch(err)
    {
        res.status(400).send("Something went wrong")
    }
    
})

// deleting a User by ID
app.delete("/user",async (req, res)=>{
    try{
        const userId = req.body.userId;
        const user = await User.findByIdAndDelete(userId);
        // const user = await User.findByIdAndDelete({_id:userId}); this also works in the same way
        res.send("User deleted successfully! ");



    }catch(err)
    {
        res.status(400).send("Something went wrong")
    }
})

// updating a user into the database
app.patch("/user/:userId",async(req, res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    console.log(data)
    try{
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills"
        ]
        const isUpdateAllowed = Object.keys(data).every((key)=> ALLOWED_UPDATES.includes(key));
        console.log(isUpdateAllowed)
        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        if(data?.skills?.length > 10){
            throw new Error("Skills cannot be more than 10")
        }    
        await User.findByIdAndUpdate({_id : userId},data,{
            returnDocument : "before",
            runValidators : true
        });
        res.send("User updated successfully!");
    }catch(err)
    {
        res.status(400).send("UPDATE FAILED  " + err.message)
    }
    
})

//creating a post api
app.post("/signup", async(req,res)=>{
    // logic to add data into the database

    
    // creating an instance of the User model
    const user = new User(req.body);

    try{
        await user.save()
        res.send("User added successfully!");
    }
    catch(err){
        res.status(400).send(err.message)
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




