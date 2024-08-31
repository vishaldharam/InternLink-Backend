import mongoose from "mongoose";

const AppyForJobsSchema = new mongoose.Schema({
    applyBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Candidate"
    },
    applyForJobID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Job"
    },
    applyStatus:{
        type:String,
        enum:['Applied','Accepted','Rejected'],
        default:'Applied'
    },
    applyDate:{
        type: Date,
        default: Date.now()

    }

},
{
    timestamps:true
})

export const Applied = mongoose.model('Applied',AppyForJobsSchema)