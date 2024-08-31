import { error } from "console";
import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        
        await mongoose.connect(process.env.MONGO_URI)
       
    }
    catch(error){
        console.log("Cant connect to Mongoose DB",error)
        process.exit(1)
    }
}