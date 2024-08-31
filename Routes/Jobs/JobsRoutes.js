import express from "express"
import passport from "passport"
import { Job } from "../../Models/Job.js"
import { Applied } from "../../Models/Applied.js"

export const JobRouter = express.Router()

JobRouter.post('/addJob',passport.authenticate('employee',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }
    console.log(req.body)

    const { jobType, jobRole, jobPackage, jobPerks, jobCity, jobStream , jobExperienceNeed, 
        jobDescription, noOfOpenings, lastDateToApply } = req.body

    if( !jobType || !jobRole || !jobPackage  || !jobCity || !jobStream || !jobExperienceNeed
         || !jobDescription || !noOfOpenings || !lastDateToApply)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }
    const isExists = await Job.find({ jobRole, postedBy:req.user._id})

    if(isExists.length > 0){
        res.status(403).json({msg:"Same Internship is already added by you"})
        return
    }

    const createdJob = await Job.create({
        jobType, 
        jobRole, 
        jobPackage, 
        jobPerks, 
        jobCity, 
        jobStream , 
        jobExperienceNeed, 
        jobDescription, 
        postedBy: req.user._id,
        noOfOpenings, 
        lastDateToApply
    })
    
    if(!createdJob) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"Job is Added Successfully", createdJob})

    

})

JobRouter.get('/getAddedJobs',passport.authenticate('employee',{session:false}), async (req, res) => {
    
    const findJobs = await Job.find({postedBy:req.user._id}).sort({createdAt:-1})

    if(findJobs.length === 0) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"Jobs Fetched Successfully", AddedJobs:findJobs})

    

})

JobRouter.get('/getJobs', async (req, res) => {
    
    const findJobs = await Job.find().sort({createdAt:-1})

    if(findJobs.length === 0) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"Jobs Fetched Successfully", Jobs:findJobs})

    

})
JobRouter.post('/getJob', async (req, res) => {
    if(!req.body){
        res.status(404).json({msg:"Invalid Data"})
        return
    }

    const {jobID } = req.body

    if( !jobID)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }
    const isExists = await Job.findOne({_id:jobID})

    if(!isExists){
        res.status(403).json({msg:"You have no longer access to this Job Profile"})
        return
    }
    res.status(200).json({msg:"Jobs Fetched Successfully", job:isExists})



    

})

JobRouter.get('/getLatestJobs', async (req, res) => {
    
    const findJobs = await Job.find().sort({createdAt:-1}).limit(6)

    if(findJobs.length === 0) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"Jobs Fetched Successfully", LatestJobs:findJobs})

    

})

JobRouter.delete('/deleteJob',passport.authenticate('employee',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const {jobID } = req.body

    if( !jobID)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }
    const isExists = await Job.findOne({_id:jobID})

    if(!isExists){
        res.status(403).json({msg:"You have no longer access to this Job Profile"})
        return
    }

    await Job.deleteOne({_id:jobID})
    

    res.status(200).json({msg:"Job Profile is Deleted Successfully"})

    

})

JobRouter.post('/applyForJob',passport.authenticate('candidate',{session: false}), async (req, res) => {

    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const {applyForJobID,  applyStatus  } = req.body

    if( !applyForJobID  || !applyStatus) 
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }
    const isExists = await Applied.find({applyForJobID,applyBy:req.user._id})

    if(isExists.length > 0){
        res.status(403).json({msg:"You have already applied for this Internship"})
        return
    }

    const applyForJob = await Applied.create({
        applyForJobID,
        applyBy:req.user._id,
        applyStatus
    })

    if(!applyForJob){
        res.status(404).json({msg:"Internal Server Error"})
    }
    

    res.status(200).json({msg:"Successfully applied for the Job", applyForJob})

    

})

JobRouter.get('/getAppliedJobs',passport.authenticate('candidate',{session: false}), async (req, res) => {

  
    const appliedJobs = await Applied.find({applyBy:req.user._id}).sort({createdAt:-1})

    if(appliedJobs.length === 0){
        res.status(404).json({msg:"You have not applied for any Internships"})
    }
    

    res.status(200).json({msg:"Applied Internships Fetched Successfully", appliedJobs})

    

})

JobRouter.get('/getAppliedJobs',passport.authenticate('employee',{session: false}), async (req, res) => {

    const {applyForJobID} = req.body

    if(!applyForJobID){
        res.status(404).json({msg:"Invalid data"})
    }
    const appliedJobs = await Applied.findOne({applyForJobID})

    if(appliedJobs.length === 0){
        res.status(404).json({msg:"You have not applied for any Internships"})
    }
    

    res.status(200).json({msg:"Applied Internships Fetched Successfully", appliedJobs})

    

})
JobRouter.post('/changeApplyStatus',passport.authenticate('employee',{session: false}), async (req, res) => {

    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const {applyID,  applyStatus  } = req.body

    if( !applyID  || !applyStatus) 
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }
    const isExists = await Applied.find({_id:applyID})

    if(isExists.length === 0){
        res.status(403).json({msg:"Access Denied"})
        return
    }

    await Applied.findOneAndUpdate({_id:applyID},{
        applyStatus
    })

    const applyForJob = await Applied.findById(applyID)

    if(!applyForJob){
        res.status(404).json({msg:"Internal Server Error"})
    }
    

    res.status(200).json({msg:"Successfully Change the Status Applied Job", applyForJob})

    

})




