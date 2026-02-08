// This the starting point of our DevTinder Project
const express = require("express");
const app = express();
//short example
// app.use("/route",rh1, [rh2, rh3], rh4, rh5)

const{adminAuth, userAuth} = require("./middlewares/auth");

app.use("/admin",adminAuth); // authentication middleware
// app.use("/user",userAuth);

app.get("/user/login",(req,res)=>{
    res.send("User logged in")
})
app.get("/user",userAuth, (req,res)=>{
    res.send("User data");
})

app.get("/admin/getAllData",(req,res)=>{

    res.send("All data sent!");
   
})


app.get("/admin/deleteData",(req,res)=>{
    res.send("Data deleted!");
})

app.listen(3000, ()=>{
    console.log("Server running successfully on port 3000...");
})