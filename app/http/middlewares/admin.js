function isAdmin(req, res, next){
    if(req.isAuthenticated() && req.user.role === 'admin'){
        return next()
    }
    return res.redirect('/login')
}

module.exports = isAdmin