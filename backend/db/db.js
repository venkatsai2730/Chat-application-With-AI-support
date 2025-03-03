import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
function connect() {
    
    mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,})
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch(err => {
            console.log(err);
        })
}

export default connect;