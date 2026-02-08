// This the starting point of our DevTinder Project
const express = require("express");
const app = express();
//short example
// app.use("/route",rh1, [rh2, rh3], rh4, rh5)

app.use("/user",[(req,res,next)=>{
    //route handler1
    console.log("handling the route user1");
    // we have to send response back or else it will be hanging around
    next()
    res.send("1st response");
    
},
 (req,res)=>{
    //route handler2
    console.log("handling the route user2");
    
    res.send("2nd response");
},(req,res)=>{
    //route handler3
    console.log("handling the route user3");
    res.send("3rd response");
}
,(req,res)=>{
    //route handler4
    console.log("handling the route user4");
    res.send("4rth response");
}
])


app.listen(3000, ()=>{
    console.log("Server running successfully on port 3000...");
})