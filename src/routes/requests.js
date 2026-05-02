const express = require("express")
const requestRouter = express.Router()

const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
// const sendEmail = require("../utils/sendEmail");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored", "interested"]
        //Addon
        const toUser = await User.findById(toUserId);
        if (!allowedStatus.includes(status)){
            return res.status(400).json({
                message : "Invalid status type: " + status
            });
        }

        if(!toUser){
            res.status(400).json({message : "User not found"})
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId, toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ]
        })

        if(existingConnectionRequest){
            res.status(400).json({message : "Invalid connection request! A connection request already exists between these users."});
        }

        



        // create a instance on the ConnectionRequest Model
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        // const emailRes = await sendEmail.run("You have got a new friend request from " + req.user.firstName,"YO THIS IS MESSAGE'S BODY");
        // console.log(emailRes);
        res.json({
            message : `${req.user.firstName}, you sent ${status} to  ${toUser.firstName}`,
            data
        })

    }catch(err){
       res.status(400).send("ERROR : " + err.message)
    }
})

requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const allowedStatus = ["accepted","rejected"];
        const {status, requestId} = req.params;

        // validate status
        if(!allowedStatus.includes(status)){
            res.status(400).json({message : "Invalid Status!"});
        }

        // validate request Id
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        })

        if(!connectionRequest){
            res.status(400).json({message: "Connection request not found!"});
        }

        // if found,
        connectionRequest.status =  status;
        const fromUser = await User.findById(connectionRequest.fromUserId);

        const data = await connectionRequest.save();
        res.json({message : `${loggedInUser.firstName}, you ${status} request of ${fromUser.firstName}`,
        data});
        

        
    }catch(err){
        res.status(400).send("ERROR : "+err.message)
    }
})
module.exports = {
    requestRouter
}