
exports.getLogin = (req,res,next)=>{
    const isLoggedIn = req.get('Cookie').trim().split('=')[1]
    console.log(req.session.isLoggedIn)
    res.render('auth/login',{
        pagetitle : 'Login page',
        path : '/login',
        isAuthenticated : isLoggedIn
    })
}

exports.postLogin = (req,res,next)=>{
    // res.setHeader('Set-Cookie','loggedIn=true; httponly');
    req.session.isLoggedIn = true;
    res.redirect('/');
}