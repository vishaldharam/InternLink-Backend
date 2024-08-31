import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
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
    company:{
        type: String,
        required:true
    },
    role:{
        type: String,
    },
    isBlocked:{
        type: Boolean,
        default: false
    }


},
{
    timestamps:true
})

export const Employee = mongoose.model('Employee',EmployeeSchema)