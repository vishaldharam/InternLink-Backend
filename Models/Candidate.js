import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    middleName:{
        type: String,
    },
    lastName:{
        type: String,
        required: true
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    isSubscribed:{
        type: Boolean,
        default: false
    },
    age:{
        type:String,
    }


},
{
    timestamps:true
})

export const Candidate = mongoose.model('Candidate',CandidateSchema)