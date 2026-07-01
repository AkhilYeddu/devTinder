// This is the starting point of our DevTinder Project
require("dotenv").config();
require("./utils/cronJob");
const express = require("express");
const app = express();
const { connectDB } =  require("./config/database");
const cors = require("cors")
const cookieParser = require("cookie-parser");
const http = require("http");


app.use(cors({
    origin: [
        "https://dev-tinder-web-rho-puce.vercel.app",
        "http://localhost:5173"
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const {authRouter} = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/requests");
const {userRouter} = require("./routes/user");
const { paymentRouter } = require("./routes/payment");
const initializeSocket = require("./utils/socket");


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",paymentRouter);


const server = http.createServer(app);

initializeSocket(server);




connectDB().then(()=>{
    console.log("Connected to the database!");
    server.listen(process.env.PORT, ()=>{
    console.log("Server running successfully on port 3000...");
})
}).catch(err=>{
    console.error("Some error occured!: " + err.message);
})



