import express from "express";
import cors from "cors"
import { config } from "dotenv";
import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import { Candidate } from "../Models/Candidate.js";
import { Employee } from "../Models/Employee.js";
import { Admin } from "../Models/Admin.js";
import { CandidateRoutes } from "../Routes/Auth/CandidateRoutes.js";
import { EmployeeRoutes } from "../Routes/Auth/EmployeeRoutes.js";
import { AdminRoutes } from "../Routes/Auth/AdminRoutes.js";
import { CourseRoute } from "../Routes/Courses/CourseRoutes.js";
import { InternshipRouter } from "../Routes/Internship/InternshipRoute.js";
import { JobRouter } from "../Routes/Jobs/JobsRoutes.js";
import { QueSetRouter } from "../Routes/QuestionSet/QuestionSet.js";
import { TestRouter } from "../Routes/Tests/Test.js";
import { AutomatedResumeRouter } from "../Routes/Resume/AutomatedResume.js";
import { GlobalErrorHandler } from "../Middlware/globalMiddleware.js";
import cookieParser from "cookie-parser";
export const app = express();
app.use(cookieParser())
// app.use(cookieParser)
// app.use(cookieParser)
//set the custom path for dotenv
config({
    path: './config.env'
})

app.use(express.urlencoded({ extended:true, limit: '100mb'}))
app.use(express.json());
  
  app.use(cors({
    origin: '*', // Your frontend URL
    credentials: true
  }));
    

//allow req by the proxy server (loadbalancer)
app.set('trust proxy',1)

  



//Rate limiter for incoming request.
const token = Array(100).fill('T');
var time = new Date().getTime()

 const rateLimiter = (req, res, next) => {
  
    if(token.length && new Date().getTime() - time < 60000) {
        token.pop()
        next()
    }
    else {
        if(new Date().getTime() - time >= 60000){
            var len = token.length
            for(let i = 0; i < 100 - len ; i++) {
                token.push('T')
            }

            time = new Date().getTime();
            rateLimiter(req, res, next)
        }

        else {

            res.status(429).json({msg:`Service not available due to excess requests ! try after ${(60000 - (new Date().getTime()))/1000 } sec`})
        }
    }
}

app.use(rateLimiter)

//Strategy for Candidate request...

//passport jwt setup.
let candidateOpts = {}
candidateOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
candidateOpts.secretOrKey = process.env.JWT_SECRET_KEY

//Register a strategy for later use when authenticating requests. 
//The name with which the strategy is registered is passed to authenticate().
passport.use('candidate', new Strategy(candidateOpts, async(jwt_payload, done)=> {
    try {
        
        const user = await Candidate.findOne({_id: jwt_payload.identifier})
        if(user){
            done(null, user)
        }
        else{
            done(null, false)
        }
    }
    catch (err) {
        done(err, false)
    }
    }))
    
app.get('/', (req, res) => {
    res.send("hii")
})
//Strategy for employee request

const employeeOpts = {}
employeeOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
employeeOpts.secretOrKey = process.env.JWT_SECRET_KEY

passport.use('employee',new Strategy(employeeOpts, async(jwt_payload, done) => {
    const employee = await Employee.findOne({_id:jwt_payload.identifier})
    try {
        if(employee){
            done(null, employee)
        }
        else{
            done(null, false)
        }
    }
    catch (err) {
        done(err, false)
    }
}))


//Strategy for admin
const adminOpts = {}
adminOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
adminOpts.secretOrKey = process.env.JWT_SECRET_KEY

passport.use('admin',new Strategy(adminOpts, async(jwt_payload, done) => {
    const admin = await Admin.findOne({_id:jwt_payload.identifier})
    try {
        if(admin){
            done(null, admin)
        }
        else{
            done(null, false)
        }
    }
    catch (err) {
        done(err, false)
    }
}))


app.use('/auth',CandidateRoutes)

app.use('/auth',EmployeeRoutes)

app.use('/auth',AdminRoutes)

app.use('/course',CourseRoute)

app.use('/internship',InternshipRouter)

app.use('/job',JobRouter)

app.use('/questionSet',QueSetRouter)

app.use('/test',TestRouter)

app.use('/resume',AutomatedResumeRouter)

app.get("*",(req, res, next)=> {
    const err = new Error("URL is not valid")
    err.statusCode = 404
    err.status = "Failed"
    next(err)
})

//Handling the Errors using Global Error handler
app.use(GlobalErrorHandler)