const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName : {
        type: String,
        required : true,
        minLength : 4,
        maxLength : 50
        
    },
    lastName : {
        type: String,
        minLength : 4,
        maxLength : 50
    },
    emailId : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        trim : true
        
    },
    password: {
        type : String,
        required : true
    },
    age : {
        type : Number,
        min : 18
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error ("gender data is not valid");
            }
        }
    },
    photoUrl: {
        type : String,
        default : "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg"
    },
    about: {
        type : String,
        default : "This is default About of the user!"
    },
    skills: {
        type : [String],
        unique : true
    }
    
}, {
    timestamps : true
})

module.exports = mongoose.model("User",userSchema);