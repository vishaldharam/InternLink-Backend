import express from "express"
import passport from "passport"
import { Test } from "../../Models/Test.js" 
export const TestRouter = express.Router()

TestRouter.post('/addTest',passport.authenticate('candidate',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const { AppliedID , testForJobID, testQuestionSet  } = req.body


    if( !AppliedID || !testForJobID  || !testQuestionSet)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

    const appliedTest = await Test.findOne({AppliedID})
    if(appliedTest){
        return res.status(200).json({msg:"Test is Added Successfully", createdTest:appliedTest})
    }

    let createdTest
    try{
         createdTest = await Test.create({
            AppliedID,
            testForJobID,
            testGivenBy: req.user._id,
            testQuestionSet
        })
        
    }
    catch (err){
        res.status(404).json({err})
        return
    }
    if(!createdTest) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }

    res.status(200).json({msg:"Test is Added Successfully", createdTest})

    

})


TestRouter.post('/updateTest',passport.authenticate('candidate',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const {  testAnswerSet, testID, testScore, testStatus  } = req.body


    if( testAnswerSet.length === 0 || !testID  || !testScore || !testStatus)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

    let createdTest = await Test.findOneAndUpdate({_id:testID},{
            testAnswerSet,
            testScore,
            testStatus,
            testEndTime:new Date()
        })
        
    
   
    if(!createdTest) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }
    createdTest = await Test.findOne({_id:testID})
    res.status(200).json({msg:"Test is Updated Successfully", createdTest})

    

})

TestRouter.post('/cancelTest',passport.authenticate('candidate',{session:false}), async (req, res) => {
    if(!req.body){
        res.status(403).json({msg:"Invalid data"})
        return
    }

    const {  testID, testStatus  } = req.body


    if( !testID  || !testStatus)
            {
                res.status(403).json({msg:"Invalid data"})
                return
            }

    let createdTest = await Test.findOneAndUpdate({_id:testID},{
            
            testStatus
        })
        
    
   
    if(!createdTest) {
        res.status(404).json({msg:"Internal Server Error"})
        return
    }
    createdTest = await Test.findOne({_id:testID})
    res.status(200).json({msg:"Test is Cancelled Successfully", createdTest})

    

})


TestRouter.get('/getTest',passport.authenticate('employee',{session:false}), async (req, res) => {
    if(!req.body){
        return res.status(403).json({msg:"Invalid data"})
        
    }

    const {  AppliedID } = req.body


    if( !AppliedID )
            {
                return res.status(403).json({msg:"Invalid data"})
                
            }

    let test
    try {
            test = await Test.find({AppliedID})
            if(!test) {
                return res.status(404).json({msg:"Internal Server Error"})
            } 
    }
    catch(error){
        return res.status(500).json({msg:"Internal Server Error",error})

    }
   
    
    return res.status(200).json({msg:"Test is Fetched Successfully", test})

    

})

TestRouter.get('/getTestByCandidate',passport.authenticate('candidate',{session:false}), async (req, res) => {
    if(!req.body){
        return res.status(403).json({msg:"Invalid data"})
        
    }

    const {  AppliedID } = req.body


    if( !AppliedID )
            {
                return res.status(403).json({msg:"Invalid data"})
                
            }

    let test
    try {
            test = await Test.find({AppliedID})
            if(!test) {
                return res.status(404).json({msg:"Internal Server Error"})
            } 
    }
    catch(error){
        return res.status(500).json({msg:"Internal Server Error",error})

    }
   
    
    return res.status(200).json({msg:"Test is Fetched Successfully", test})

    

})


