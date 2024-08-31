import mongoose from "mongoose";

const QuestionSetSchema = new mongoose.Schema({
    setPostedBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Employee"
    },
   setQuestions:{
        type: Array,
        required: true,
        default:[]
    },
    setPublishedDate:{
        type: Date,
        default: Date.now()
    }

},
{
    timestamps:true
})

export const QuestionSet = mongoose.model('QuestionSet',QuestionSetSchema)