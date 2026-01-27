const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;


// Async function to connect database
const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected!");
    } catch(error) {
        console.log("Error while connecting database", error);
    }
}



module.exports = connectDb;
