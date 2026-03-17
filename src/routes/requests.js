const express = require("express")
const requestRouter = express.Router()

const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/send/:status/:toUserId", userAuth, async(req, res)=>{
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
        res.json({
            message : `${req.user.firstName} is ${status} in  ${toUser.firstName}`,
            data
        })

    }catch(err){
       res.status(400).send("ERROR : " + err.message)
    }
})
module.exports = {
    requestRouter
}