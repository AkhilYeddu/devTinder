const adminAuth = (req,res,next)=>{
    console.log("Auth is getting checked!!");
    const token = "akhil";
    const isAuthorized = token === "akhil";
    if(!isAuthorized)
    {
        res.status(401).send("Unauthorized request");
    }
    else{
        next()
    }
};

const userAuth = (req,res,next)=>{
    const token = "purvi";
    const isAuthorized = token === "purvi";
    if(!isAuthorized)
    {
        res.status(401).send("Unauthorized request");
    }
    else{
        next()
    }
};




module.exports = {
    adminAuth,
    userAuth
}