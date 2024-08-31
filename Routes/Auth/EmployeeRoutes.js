import express from "express"
import  { isEmail, getToken } from "../../utils/helper.js"
import bcrypt from 'bcrypt'
import { Employee } from "../../Models/Employee.js"
import passport from "passport"
import { CustomErrorHandler } from "../../utils/customErrorHandler.js"
export const EmployeeRoutes = express.Router()

EmployeeRoutes.post('/employee/register',async(req, res, next)=>{
    if(!req.body) {
        const err = new CustomErrorHandler("Request Body is missing",400)
        return next(err)
    }
    const {email, password, name, company, role} = req.body
    
    if( !password || !email || !name || !company  ){
        const err = new CustomErrorHandler("Invalid request body",402)
        return next(err)
        
    }

    try {
        let employeeExists = await Employee.findOne({email})

        if(employeeExists){
            const err = new CustomErrorHandler("User Already Exists",206)
            return next(err)
            
        }
        const hashedPassword = bcrypt.hashSync(password,12)
        const addedEmployee = await Employee.create({
            email,
            password: hashedPassword,
            name,
            company,
            role
        })
    
        if(!addedEmployee){
            const err = new CustomErrorHandler("Internal Server Error",500)
            return next(err)
    
        }
        
        const token = getToken(email,addedEmployee)
       
        res.cookie('connectId', token, {
            httpOnly: true, // Makes the cookie inaccessible to JavaScript (for security)
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
            maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (e.g., 24 hours)
            sameSite: 'strict', // Protects against CSRF attacks
        });
        return res.status(200).json({message:"Employee Registered Success"})
    } catch (error) {
        const err = new CustomErrorHandler(error,500)
        return next(err)
    }
})

EmployeeRoutes.post('/employee/login',async(req, res, next)=>{
    
    const {email, password} = req.body
    if(!req.body) {
        const err = new CustomErrorHandler("Request Body is missing",400)
        return next(err)
    }
    if(!email || !password ){
        const err = new CustomErrorHandler("Content is misssing",206)
        return next(err)
    
    }

    if(!isEmail(email)){
        const err = new CustomErrorHandler("Content is misssing",206)
        return next(err)
    }
    try {
        let employee
        employee = await Employee.findOne({email})

        
        const isMatched = bcrypt.compareSync(password, employee.password)

        if(!isMatched){
            const err = new CustomErrorHandler("Invalid Credentials",210)
            return next(err)
        }
        
        const token = getToken(employee.email,employee.toJSON())
        res.cookie('connectId', token, {
            httpOnly: true, // Makes the cookie inaccessible to JavaScript (for security)
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
            maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (e.g., 24 hours)
            sameSite: 'strict', // Protects against CSRF attacks
        });
        return res.status(200).json({message:"Employee logged in Successfully"})

    } catch (error) {
        const err = new CustomErrorHandler(error,404)
        return next(err) 
    }
})

EmployeeRoutes.post('/employee/logout',passport.authenticate('employee', { session:false }),async(req, res, next)=>{
    res.clearCookie('connectId', {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript (for security)
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
        sameSite: 'strict', // Protects against CSRF attacks
      });     
      return res.status(200).json({msg:"Employee logged out Successfully"})

})




