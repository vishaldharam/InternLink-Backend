import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required:true
    }


},
{
    timestamps:true
})

export const Admin = mongoose.model('Admin',AdminSchema)