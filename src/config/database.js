const mongoose = require("mongoose");

const connectDB = async()=>{
    // this returns a promise
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
}

// this is a promise

module.exports = {connectDB};

//mongodb+srv://AkhilYeddu:g5IKWRvqhNTtTCSm@namastenode.qy44lqw.mongodb.net/