const jwt=require('jsonwebtoken');
module.exports=function(req,res,next){
    const authheader= req.header('Authorization');
    if (!authheader){
        return res.status(401).json({error:"Authorization denied"})
    }
    try{
        const token= authheader.split(' ')[1];
        if (!token){
            return res.status(401).json({error:"Token missing"})

        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.userId=decoded.user.id;
        next();
    }
    catch(error){
        res.status(401).json({error:"Token is not valid"})
    }
}