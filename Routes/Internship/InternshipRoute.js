import express from "express"
import passport from "passport"
import { Job } from "../../Models/Job.js"
import { Applied } from "../../Models/Applied.js"

export const InternshipRouter = express.Router()

InternshipRouter.post('/add',passport.authenticate('employee',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }
    console.log(req.body)

    const {isInternship, jobType, jobRole, jobCompany, jobStipend, jobPerks, jobCity, jobStream , jobExperienceNeed, 
        jobDescription, noOfOpenings, lastDateToApply, jobQuestionSets } = req.body

    if( !jobType || !jobRole || !jobStipend || !jobCompany || !jobCity || !jobStream || !jobExperienceNeed
         || !jobDescription || !noOfOpenings || !lastDateToApply || jobQuestionSets.length === 0)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

    const isExists = await Job.find({ jobRole, postedBy:req.user._id})

    if(isExists.length > 0){
        res.status(403).json({msg:"Same Internship is already added by you"})
        return
    }

    const createdInternship = await Job.create({
        isInternship, 
        jobType, 
        jobRole, 
        jobCompany,
        jobStipend, 
        jobPerks, 
        jobCity, 
        jobStream , 
        jobExperienceNeed, 
        jobDescription, 
        postedBy: req.user._id,
        noOfOpenings, 
        lastDateToApply,
        jobQuestionSets
    })
    
    if(!createdInternship) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"Internship is Added Successfully", createdInternship})

    

})

InternshipRouter.get('/getAddedInternships',passport.authenticate('employee',{session:false}), async (req, res) => {
    
    const findInternships = await Job.find({postedBy:req.user._id}).sort({ createdAt: -1 })

    if(findInternships.length === 0) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"Internships Fetched Successfully", AddedInternships: findInternships})

    

})

InternshipRouter.get('/getLatestInternships', async (req, res) => {
    
    const findInternships = await Job.find({isInternship:true}).sort({ createdAt: -1}).limit(6)

    if(findInternships.length === 0) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"Internships Fetched Successfully", LatestInternships:findInternships})

    

})

InternshipRouter.get('/getAllInternships', async (req, res) => {
    
    const findInternships = await Job.find({isInternship:true}).sort({ createdAt: -1})

    if(findInternships.length === 0) { 
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"Internships Fetched Successfully", AllInternships:findInternships})

    

})

InternshipRouter.delete('/delete',passport.authenticate('employee',{session:false}), async (req, res) => {
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
        res.status(403).json({msg:"You have no longer access to this Internship"})
        return
    }

    await Job.deleteOne({_id:jobID})
    

    res.status(200).json({msg:"Internship is Deleted Successfully"})

    

})

InternshipRouter.post('/applyForJobs',passport.authenticate('candidate',{session: false}), async (req, res) => {

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

    const applyInternship = await Applied.create({
        applyForJobID,
        applyBy:req.user._id,
        applyStatus
    })

    if(!applyInternship){
        res.status(404).json({msg:"Internal Server Error"})
    }
    

    res.status(200).json({msg:"Successfully applied for the internship", applyInternship})

    

})

InternshipRouter.get('/getApplieds',passport.authenticate('candidate',{session: false}), async (req, res) => {

  
    const AppliedInternship = await Applied.find({applyBy:req.user._id}).sort({ createdAt: -1 })

    if(AppliedInternship.length === 0){
        res.status(404).json({msg:"You have not applied for any Internships"})
    }
    

    res.status(200).json({msg:"Applied Internships Fetched Successfully", AppliedInternship})

    

})

InternshipRouter.post('/changeApplyStatus',passport.authenticate('employee',{session: false}), async (req, res) => {

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

    const applyInternship = await Applied.findById(applyID)

    if(!applyInternship){
        res.status(404).json({msg:"Internal Server Error"})
    }
    

    res.status(200).json({msg:"Successfully Change the Status Applied Internship", applyInternship})

    

})




