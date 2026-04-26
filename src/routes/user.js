const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();

const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { connect, connection } = require("mongoose");

const USER_SAFE_DATA = ["firstName", "lastName", "about", "photoUrl" ,"age", "skills","gender"]

// GET All the connections of the loggedIn User.
userRouter.get("/user/connections",userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
    
        const connectionRequest = await ConnectionRequest.find({
            $or : [
                { fromUserId : loggedInUser._id, status : "accepted"},
                { toUserId : loggedInUser._id, status : "accepted"}
            ]
        }).populate("fromUserId",["firstName", "lastName", "about", "photoUrl" ,"age", "skills","gender"])
            .populate("toUserId",["firstName", "lastName", "about", "photoUrl" ,"age", "skills","gender"])


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

userRouter.get("/user/feed",userAuth, async(req,res)=>{
    try{

        // Users should see all the cards except:
        // 1) His Own Card
        // 2) His Connections
        // 3) Ignored People
        // 4) Already sent the connection request


        const loggedInUser = req.user;

        const page = parseInt(req.query.page || 1);
        let limit = parseInt(req.query.limit || 10); //setting default as 10
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        
        //Find all connection requests (sent + received)
        const connectionRequest = await ConnectionRequest.find({
            $or: [{fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId")
        // .populate("fromUserId",["firstName"])
        // .populate("toUserId",["firstName"]);

        const hideUsersFromFeed = new Set();

        connectionRequest.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        //get the valid users now
        const users = await User.find({
            $and : [
                {_id : {$nin : Array.from(hideUsersFromFeed)} },
                {_id : {$ne : loggedInUser._id}}
            ]
            
        }).select(USER_SAFE_DATA)
          .skip(skip)
          .limit(limit)

        res.send(users)
    }catch(err){
        res.status(400).send(err.message)
    }
})
module.exports = {
    userRouter
};