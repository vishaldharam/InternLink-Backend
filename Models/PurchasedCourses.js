import mongoose from "mongoose";

const PurchasedCoursesSchema = new mongoose.Schema({
    purchasedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
      },
      courseID: {
        type: String,
        ref: 'Course',
        required: true
      },
      paymentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
      },
      status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active'
      },
      // Add any additional fields as necessary
    
},
{
    timestamps:true
})

export const PurchasedCourse = mongoose.model('PurchasedCourse',PurchasedCoursesSchema)