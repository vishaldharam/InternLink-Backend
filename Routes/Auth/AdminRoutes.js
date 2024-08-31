import { Admin } from "../../Models/Admin.js";
import express from "express"
import  { isEmail, getToken } from "../../utils/helper.js"
import bcrypt from 'bcrypt'
import passport from "passport"
export const AdminRoutes = express.Router()

AdminRoutes.post('/admin/register',async(req, res)=>{
    const {email, password, name, role} = req.body
    
    if( !password || !email || !name || !role ){
        res.status(400).json({err:"Invalid request body"})
        return
    }

    let adminExists = await Admin.findOne({email})

    if(adminExists){
        res.status(202).json({err:"Admin Already Exists"})
        return
    }




    const hashedPassword = bcrypt.hashSync(password,12)

    const addedAdmin = await Admin.create({
        email,
        password: hashedPassword,
        name,
        role
    })

    if(!addedAdmin){
        res.status(400).json({err:"Internal Server Error"})
        return
    }
    const token = getToken(email,addedAdmin)


    const adminToReturn = {...addedAdmin.toJSON(), token}

    delete adminToReturn.password

    res.status(200).json(adminToReturn)

    return




})

AdminRoutes.post('/admin/login',async(req, res)=>{
    const {email, password} = req.body
    
    if(!email || !password ){
        res.status(400).json({err:"Invalid request body"})
        return
    }
    let admin
    if(!isEmail(email)){
        res.status(400).json({err:"Invalid Email Format"})
        return
    }
    admin = await Admin.findOne({email})

    
    const isMatched = bcrypt.compareSync(password, admin.password)

    if(!isMatched){
        res.status(400).json({err:"Invalid email or Password"})
        return
    }
    
    const token = getToken(admin.email,admin.toJSON())
    res.status(200).json({msg:"Admin logged in Successfully",token})

    return




})

AdminRoutes.post('/admin/logout',passport.authenticate('admin', { session:false }),async(req, res)=>{
    
    res.status(200).json({msg:"Admin logged out Successfully"})

    return




})




