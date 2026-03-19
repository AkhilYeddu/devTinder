const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const connectionRequestSchema = new Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User", //reference to the user collection
        required : true
    },

    toUserId:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },

    status: {
        type : String,
        enum : {
            values : ["interested", "ignored", "accepted", "rejected"],
            message : `{VALUE} is incorrect status type`

        }
    }
},{
    timestamps : true
})

connectionRequestSchema.index({fromUserId : 1, toUserId : 1}); //compound indexing

connectionRequestSchema.pre("save", function(){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to SELF");
    }
    
});

module.exports = mongoose.model("ConnectionRequest",connectionRequestSchema);
