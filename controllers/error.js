exports.fourofour = (req,res,next)=>{
    res.status(404).render('404',{
        pagetitle : '404 page', 
        path:'',
        isAuthenticated : req.session.isLoggiedIn
    });
}

exports.get500 = (req,res,next)=>{
    console.log(req)
    res.status(500).render('500',{
        pagetitle : 'Error !!', 
        path:'',
        isAuthenticated : req.session.isLoggiedIn
        
    });
}