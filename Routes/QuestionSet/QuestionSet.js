import express from "express"
import passport from "passport"
import { QuestionSet } from "../../Models/QuestionSet.js"
 
import mongoose from "mongoose"
import { Job } from "../../Models/Job.js"
import { Applied } from "../../Models/Applied.js"
import { Test } from "../../Models/Test.js"
export const QueSetRouter = express.Router()

QueSetRouter.post('/addQuestionSet',passport.authenticate('employee',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const { setJobId, setQuestions } = req.body


    if( !setJobId || setQuestions.length === 0)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

    let createdQuestionSet
    try{
         createdQuestionSet = await QuestionSet.create({
            setPostedBy: req.user._id,
            setJobId,
            setQuestions
        })
        
    }
    catch (err){
        res.status(404).json({err})
        return
    }
    if(!createdQuestionSet) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"QuestionSet is Added Successfully", createdQuestionSet})

    

})

QueSetRouter.post('/editQuestionSet',passport.authenticate('employee',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const {  setQuestions , _id } = req.body


    if( setQuestions.length === 0 || !_id)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

    let createdQuestionSet = await QuestionSet.findOne({_id})
    if(!createdQuestionSet){
        res.status(403).json({msg:"This Set is no longer belongs to you"})
                return
    }
    try{
         createdQuestionSet = await QuestionSet.findOneAndUpdate({_id},{
            setQuestions
        })
        
    }
    catch (err){
        res.status(404).json({err})
        return
    }
    if(!createdQuestionSet) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"QuestionSet is Edited Successfully", createdQuestionSet})

    

})


QueSetRouter.post('/getQuestionSet',passport.authenticate('candidate',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const { setID, jobID } = req.body

    if( !setID || !jobID)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

   try {
    const createdQuestionSet = await QuestionSet.findOne({
        _id:setID
    })
    if(createdQuestionSet.length === 0) {
        res.status(404).json({msg:"No Question set available for this Job"})
        return
    }
    const isAppliedBefore = await Applied.findOne({
        applyBy:req.user._id,
        applyForJobID:jobID
    })

    if(isAppliedBefore) {
        return res.status(200).json({msg:"QuestionSets is Fetched Successfully", createdQuestionSet, applyForJob: isAppliedBefore})
    }

    //Apply for job route,
    const applyForJob = await Applied.create({
        applyBy:req.user._id,
        applyForJobID:jobID,

    })

    res.status(200).json({msg:"QuestionSets is Fetched Successfully", createdQuestionSet, applyForJob})
   } catch (error) {
    res.status(500).json({error})
   }

    

})

QueSetRouter.delete('/deleteQuestionSets',passport.authenticate('employee',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const { _id } = req.body

    if( !_id)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

    const createdQuestionSet = await QuestionSet.find({
        _id
    })

    if(!createdQuestionSet){
        res.status(404).json({msg:"This question set is no longer exists"})
        return
    }
    await QuestionSet.deleteOne({_id})
    res.status(200).json({msg:"QuestionSets is Deleted Successfully", createdQuestionSet})

    

})


QueSetRouter.post('/getAppliedStatus',passport.authenticate('candidate',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const { jobID } = req.body

    if(!jobID)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

   try {
   
    const checkApplied = await Applied.findOne({
        applyBy:req.user._id,
        applyForJobID:jobID
    })

    if(!checkApplied){
        return res.status(200).json({msg:"QuestionSets is Fetched Successfully", status:false})

    }

    const isAppliedBefore = await Test.findOne({
        AppliedID: checkApplied._id,
    })

    if(isAppliedBefore){

        return res.status(200).json({msg:"QuestionSets is Fetched Successfully", status:true})
    }


    return res.status(200).json({msg:"QuestionSets is Fetched Successfully", status:false})

   
   

   } catch (error) {
    res.status(500).json({error})
   }

    

})