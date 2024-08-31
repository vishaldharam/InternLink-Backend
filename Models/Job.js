import mongoose from "mongoose";



const JobSchema = new mongoose.Schema({
    isInternship:{
        type: Boolean,
        default:false
    },
    jobType: {
        type: String,
        required: true,
        default:"full-time"
    },
    jobRole:{
        type: String,
        required: true
    },
    jobCompany:{
        type: String,
        required: true
    },
    jobStipend:{
        type: String,
    },
    jobPackage:{
        type: String,
    },
    jobPerks:{
        type: Array,
        default:[]
    },
    jobCity : {
        type: String
    },
    jobStream:{
        type: String,
        required: true,
        
    },
    jobExperienceNeed:{
        type: String,
        required: true
    },
    jobDescription:{
        type: String,
        required: true
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Employee"

    },
    noOfOpenings:{
        type: String,
        default: 1
    },
    noOfApplied: {
        type: String,
        default: 0
    },
    lastDateToApply:{
        type: String,
        required: true
    },
    jobQuestionSets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionSet'
        }
    ]

},
{
    timestamps:true
})

export const Job = mongoose.model('Job',JobSchema)