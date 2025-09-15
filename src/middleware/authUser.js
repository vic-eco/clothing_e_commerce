const authUser = (req, res, next)=>{
    if(!req.user || req.user.id != req.params.userId){
        return res.status(401).json({message: 'Unauthorized User'});
    }
    next();
}

module.exports = authUser;