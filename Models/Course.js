import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    courseID: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    courseTechStack:{
        type: Array,
        required: true,
        default:[]
    },
    courseDescription:{
        type: String,
        required: true
    },
    courseDuration:{
        type: String,
        required: true
    },
    publishedBy:{
        type: String,
        required: true
    },
    coursePrice:{
        type: String,
        required: true
    },
    courseOffer:{
        type: String,
        default: 0
    },
    publishedDate:{
        type: Date,
        default: Date.now()
    }

},
{
    timestamps:true
})

export const Course = mongoose.model('Course',CourseSchema)