import jwt from 'jsonwebtoken'

    const isEmail = (email) => {
        const regex = /^[a-zA-Z0-9_.+\-]+[\x40][a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
        return(regex.test(email))
    }

    const getToken = (email, user)=>{
       return jwt.sign({identifier : user._id},process.env.JWT_SECRET_KEY)
    }

    

export  { isEmail, getToken}
