const mongoose = require("mongoose");
const validator = require("validator");
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
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid: " + value );
            }
        }
        
    },
    password: {
        type : String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password: " + value );
            }
        }
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
        default : "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2558760599.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valid URL: " + value );
            }
        }
    },
    about: {
        type : String,
        default : "This is default About of the user!"
    },
    skills: {
        type : [String]
    }
    
}, {
    timestamps : true
})

module.exports = mongoose.model("User",userSchema);