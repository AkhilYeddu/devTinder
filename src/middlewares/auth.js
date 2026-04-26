const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) =>{
    try{
    // read the token from the cookie in req
    const cookie = req.cookies;
    const {token} = cookie
        // console.log("COOKIE:", req.cookies);
        // console.log("TOKEN:", token);
    if (!token || token === "undefined" || token === "null") {
             return res.status(401).send("Please Login!");
        }



    // validate the cookie
    const decodedData = await jwt.verify(token,"DEV@Tinder@05");
    const{ _id } = decodedData;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found!");
    }
    req.user = user;
    next()
    }   
   catch(err){
        res.status(400).send("ERROR : " + err.message);
    }

};


module.exports = {
    userAuth
}