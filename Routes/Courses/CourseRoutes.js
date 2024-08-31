import passport from "passport";
import { Course } from "../../Models/Course.js";
import express from "express"
import { PurchasedCourse } from "../../Models/PurchasedCourses.js";

export const CourseRoute = express.Router()

CourseRoute.get('/addCourse', passport.authenticate('admin',{ session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const {courseID, courseName, courseTechStack, courseDescription, courseDuration, coursePrice, 
        courseOffer} = req.body

    if(!courseID || !courseName || !courseTechStack || !courseDescription || 
            !courseDuration || !coursePrice || !courseOffer)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }
    const isExists = await Course.findOne({courseID})


    // console.log(isExists)
    // res.send(isExists)
    // return
    if(isExists) {
        res.status(403).json({msg:"You have published this course before"})
        return
    }

    const createdCourse = await Course.create({
        courseID,
        courseName,
        courseTechStack,
        courseDescription,
        courseDuration,
        publishedBy:req.user._id,
        coursePrice,
        courseOffer
    })
    
    if(!createdCourse) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"Course is Created Successfully", createdCourse})

    

    
})

CourseRoute.get('/editCourse', passport.authenticate('admin',{ session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const {courseID, courseName, courseTechStack, courseDescription, courseDuration, coursePrice, 
        courseOffer} = req.body

    if(!courseID || !courseName || !courseTechStack || !courseDescription || 
            !courseDuration || !coursePrice || !courseOffer)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }
    const isExists = await Course.findOne({courseID})


    // console.log(isExists)
    // res.send(isExists)
    // return
    if(!isExists) {
        res.status(403).json({msg:"Permission Denied"})
        return
    }

    const createdCourse = await Course.findOneAndDelete({courseID},{
        courseName,
        courseTechStack,
        courseDescription,
        courseDuration,
        publishedBy:req.user._id,
        coursePrice,
        courseOffer
    })
    
    if(!createdCourse) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"Course is Updated Successfully", createdCourse})

    

    
})


CourseRoute.delete('/deleteCourse', passport.authenticate('admin',{ session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const { courseID } = req.body

    if(!courseID)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }
    const isExists = await Course.findOne({courseID})

    if(!isExists) {
        res.status(403).json({msg:"Permission Denied"})
        return
    }

   await Course.deleteOne({courseID})
    
  
    res.status(200).json({msg:"Course is Deleted Successfully"})

    

    
})

CourseRoute.post('/buyCourse', passport.authenticate('candidate',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }
    const { courseID , paymentID } = req.body

    if(!courseID || !paymentID)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

    const purchaseCourse = await PurchasedCourse.create({
        purchasedBy:req.user._id,
        courseID,
        paymentID,

    })



    if(!purchaseCourse) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({ msg:"Course purchased successfully!"})
})



CourseRoute.post('/editPurchasedCourse', passport.authenticate('candidate',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }
    const { paymentID, status } = req.body

    if(!paymentID || !status)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

    const purchaseCourse = await PurchasedCourse.findOneAndUpdate({paymentID},{
       status
    })

    

    if(!purchaseCourse) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({ msg:"Course purchased updated successfully!"})
})

CourseRoute.get('/getPurchasedCourse',passport.authenticate('candidate',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }
    const { purchasedBy } = req.body

    if(!purchasedBy)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

    const purchaseCourse = await PurchasedCourse.find({purchasedBy}).sort({ createdAt:-1})

    

    if(!purchaseCourse) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({ msg:"Course Purchased fetched successfully!", PurchasedCourse: purchaseCourse})
})

CourseRoute.get('/getCourses', async (req, res) => {
   


   try {
    const courses = await Course.find()
    res.status(200).json({ msg:"Course Fetched successfully!", Courses:courses})
   }
   catch(err){
    return res.status(404).json({msg:"Internal Server Error"})
    
   }

})

CourseRoute.get('/getLatestCourses', async (req, res) => {
   


    try {
     const courses = await Course.find().sort({ createdAt: -1}).limit(6)
     res.status(200).json({ msg:"Course Fetched successfully!", Courses:courses})
    }
    catch(err){
     return res.status(404).json({msg:"Internal Server Error"})
     
    }
 
 })
 

