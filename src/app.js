// This the starting point of our DevTinder Project
const express = require("express");
const app = express();
//short example
// app.use("/route",rh1, [rh2, rh3], rh4, rh5)



app.get("/getUserData",(req,res)=>{
    // try{
        throw new Error("cute error");
         res.send("User data through GET");
    // }
    // catch(err){
    //     res.status(500).send("Something went wrong");
    // }
   
})

// always should be written at last
app.use("/",(err,req,res,next)=>{
    if(err)
    {
        // Log your errors
        res.status(500).send("Something went wrong please contact the support team");
    }
})





app.listen(3000, ()=>{
    console.log("Server running successfully on port 3000...");
})