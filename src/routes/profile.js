const express = require("express")
const profileRouter = express.Router()
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
profileRouter.get("/profile/view",userAuth, async (req, res)=>{

    try{
        const { user } = req;
    // get the userData from the hiddenID
    res.send(user)
    }
    catch(err){
        res.status(400).send("ERROR "+ err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
    try{
        const isValid = validateEditProfileData(req);
        if(!isValid){
            throw new Error("Invalid edit fields");
        }

        const { user } = req;
        Object.keys(req.body).forEach((key) => user[key] = req.body[key]);
        await user.save();

        res.json({message: `${user.firstName}, your profile has been updated successfully!`,
                    data : user
        });

    }catch(err){
        res.status(400).send("ERROR " + err.message);
    }
})


module.exports = {
    profileRouter
}