// This the starting point of our DevTinder Project
const express = require("express");
const app = express();


// ************************** IMPORTANT *******************************
// app.use("/user",(req,res)=>{
//     res.send("HAAHAHHA ORDER MATTERS AND I OVERWRITE EVERYTHING!")
// })


// this will handle only GET calls to /user
app.get("/user",(req,res)=>{
    res.send({
        firstName : "Akhil",
        lastName : "Yeddu",
        mobileNumber : 8919562972
    })
})

// only post calls to /user
app.post("/user",(req,res)=>{
    res.send("Data successfully saved to the database!");
})

// only put calls to /user
app.put("/user",(req,res)=>{
    res.send("Data has been updated to the database!");
})

// only patch calls to /user
app.patch("/user", (req,res)=>{
    res.send("Data has been patched and updated to the database!");
})

// only delete calls to /user
app.delete("/user", (req,res)=>{
    res.send("Data has been deleted successfully from the database!");
})

// this will match all the HTTP Methods API calls to /test
app.use("/test",(req,res)=>{
    res.send("Hello this is test page!"); // THIS FUNCTION IS KNOWN AS REQUEST HANDLER
})

// app.use("/", (req,res)=>{
//     res.send("Hello this is homepagee!"); // THIS FUNCTION IS KNOWN AS REQUEST HANDLER
// })

app.listen(3000, ()=>{
    console.log("Server running successfully on port 3000...");
})