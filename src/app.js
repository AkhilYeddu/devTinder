// This the starting point of our DevTinder Project
const express = require("express");
const app = express();

// app.use((req,res)=>{
//     res.send("Hello from the server!"); // THIS FUNCTION IS KNOWN AS REQUEST HANDLER
// })



app.use("/test",(req,res)=>{
    res.send("Hello this is test page!"); // THIS FUNCTION IS KNOWN AS REQUEST HANDLER
})

app.use("/hello", (req,res)=>{
    res.send("Hello hello hello!"); // THIS FUNCTION IS KNOWN AS REQUEST HANDLER
})

app.use("/", (req,res)=>{
    res.send("Hello this is homepage!"); // THIS FUNCTION IS KNOWN AS REQUEST HANDLER
})

app.listen(3000, ()=>{
    console.log("Server running successfully on port 3000...");
})