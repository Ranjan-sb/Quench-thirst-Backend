const jwt = require('jsonwebtoken')
const authorizeUser = (permittedRoles)=>{
    return (req,res,next)=>{
        if(permittedRoles.includes(req.user.role)){
             next()
        }else{
            return res.status(403).json({error:'Not Authorized for this route'})
        }
    }
}

const authenticateUser = async(req,res,next)=>{
    const token = req.headers['authorization']
    if(!token){
        res.status(401).json({error:"token is required"})
    }
    try{
        const tokenData = jwt.verify(token,process.env.SECRET_KEY)
        const user = {
            id : tokenData.id,
            role : tokenData.role
        }
        req.user = user
        next()
    } catch(error){
        console.log(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

module.exports = {
    authorizeUser,
    authenticateUser
}