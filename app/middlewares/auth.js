const authorizeUser = (permittedRoles)=>{
    return (req,res,next)=>{
        if(permittedRoles.includes(req.user.role)){
             next()
        }else{
            return res.status(403).json({error:'Not Authorized for this route'})
        }
    }
}

module.exports = {authorizeUser}