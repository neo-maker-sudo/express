exports.fourofour = (req,res,next)=>{
    res.status(404).render('404',{pagetitle : '404 page', path:'',isAuthenticated : req.isLoggedIn});
}