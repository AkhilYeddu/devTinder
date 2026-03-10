const validator = require("validator");
function validateSignUpData(req){
    const {firstName, lastName , emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid!!");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("EmailID is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }

}

function validateLoginData(req){
    const {emailId, password} = req.body;
    if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }

}

function validateEditProfileData(req){
    const allowedEdits = [
        "firstName",
         "lastName",
          "emailId",
           "about",
            "photoUrl",
            "skills",
             "age",
              "gender"]
              
        const isAllowed = Object.keys(req.body).every((field) => allowedEdits.includes(field));
    return isAllowed;
}


module.exports = {
    validateSignUpData,
    validateLoginData,
    validateEditProfileData
}