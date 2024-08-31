import express from "express"
import  { isEmail, getToken } from "../../utils/helper.js"
import bcrypt from 'bcrypt'
import { Candidate } from "../../Models/Candidate.js"
import passport from "passport"
import { CustomErrorHandler } from "../../utils/customErrorHandler.js"
export const CandidateRoutes = express.Router()

CandidateRoutes.post('/candidate/register',async(req, res, next)=>{
    if(!req.body) {
        const err = new CustomErrorHandler("Request Body is missing",400)
        return next(err)
    }
    const { password, email, firstName, middleName, lastName} = req.body
    
    if( !password || !email || !firstName || !middleName || !lastName){
        // res.status(402).json({err:"Invalid request body"})
        // return
        const err = new CustomErrorHandler("Invalid request body",402)
        return next(err)
        

    }

    try {
        
        const userExists = await Candidate.findOne({email})

        if(userExists){
            const err = new CustomErrorHandler("User Already Exists",206)
            return next(err)
            
        }
    
        const hashedPassword = bcrypt.hashSync(password,12)
    
        const addedUser = await Candidate.create({
            email,
            password: hashedPassword,
            firstName,
            middleName,
            lastName
        })
    
        if(!addedUser){
            const err = new CustomErrorHandler("Internal Server Error",500)
            return next(err)
    
        }
        const token = getToken(email,addedUser)
        res.clearCookie('connectId', {
            httpOnly: true, // Makes the cookie inaccessible to JavaScript (for security)
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
            sameSite: 'strict', // Protects against CSRF attacks
          });  
    
        
        return res.status(200).json({message:"User Registered Success"})
    
    
    } catch (error) {
        const err = new CustomErrorHandler(error,500)
        return next(err)
    }
})

CandidateRoutes.post('/candidate/login',async(req, res, next)=>{

    if(!req.body) {
        const err = new CustomErrorHandler("Request Body is missing",400)
        return next(err)
    }
    const {email, password} = req.body
    
    if(!email || !password ){
        const err = new CustomErrorHandler("Content is misssing",206)
        return next(err)
    }
   
    if(!isEmail(email)){

        const err = new CustomErrorHandler("Invalid Email",206)
        return next(err)
    }
   
    try {
        
        const user = await Candidate.findOne({email})
        const isMatched = bcrypt.compareSync(password, user.password)
 
        if(!isMatched){
            const err = new CustomErrorHandler("Invalid Credentials",210)
            return next(err)
        }
        


        const token = getToken(user.email,user.toJSON())
        const temp = user.toJSON()
        delete temp.password
        // res.cookie('connectId', token, {
        //     httpOnly: true, // Makes the cookie inaccessible to JavaScript (for security)
        //     secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
        //     maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (e.g., 24 hours)
        //     sameSite: 'strict', // Protects against CSRF attacks
        //   });
        return res.status(200).json({status:"ok",msg:"User logged in Successfully",user:temp,token:token})
    
        
 
    } catch (error) {
        const err = new CustomErrorHandler(error,404)
        return next(err)
    }


})

CandidateRoutes.post('/candidate/logout',passport.authenticate('candidate',{ session: false}),
    async(req, res, next)=>{
        res.clearCookie('connectId', {
            httpOnly: true, // Makes the cookie inaccessible to JavaScript (for security)
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
            sameSite: 'strict', // Protects against CSRF attacks
          });         
    return res.status(200).json({msg:"User logged out Successfully"})

    




})




