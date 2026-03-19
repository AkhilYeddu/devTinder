const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");
const { connect, connection } = require("mongoose");

const USER_SAFE_DATA = ["firstName", "lastName", "about", "photoUrl" ,"age", "skills"]

// GET All the connections of the loggedIn User.
userRouter.get("/user/connections",userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
    
        const connectionRequest = await ConnectionRequest.find({
            $or : [
                { fromUserId : loggedInUser._id, status : "accepted"},
                { toUserId : loggedInUser._id, status : "accepted"}
            ]
        }).populate("fromUserId",["firstName", "lastName"])
            .populate("toUserId", ["firstName", "lastName"])


        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({data: data});
        
      
    }catch(err){
        res.status(400).json({message : "ERROR: " + err.message})
    }
})

// GET All the pending connection requests for the loggedIn User (pending = interested)
userRouter.get("/user/requests",userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId", USER_SAFE_DATA)

        res.json({message : "Data fetched successfully",
            data : connectionRequest,
        })

    }catch(err){
        res.status(400).json({message : "ERROR: " + err.message})
    }
})
module.exports = {
    userRouter
};