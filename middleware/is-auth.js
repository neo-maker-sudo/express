module.exports = (req,res,next)=>{
    if(!req.session.isLoggiedIn){
        return res.redirect('/login');
    }
    next();
}