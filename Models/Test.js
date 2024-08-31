import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
    
    AppliedID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Applied"
    },
    testForJobID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Job"
    },
    testGivenBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Candidate"
    },
    testQuestionSet:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"QuestionSet"
    },
    testAnswerSet:{
        type:Array,
        default:[]
    },
    testStatus:{
        type:String,
        enum:['Asigned','Completed','Cancelled'],
        default:'Asigned'
    },
    testScore:{
        type: String,
        default: '0'
    },
    testStartTime:{
        type: Date,
        default: Date.now()

    },
    testEndTime:{
        type: Date,

    }

},
{
    timestamps:true
})

export const Test = mongoose.model('Test',TestSchema)