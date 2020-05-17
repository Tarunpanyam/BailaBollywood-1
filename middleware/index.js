 var middlewareObj = {};

//Middleware
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.isLoggedIn1 = function (req, res, next) {
    if (req.user) {
        return res.redirect("/");
    }
    next();
}

middlewareObj.isAdmin = function(req,res,next){
    if(req.isAuthenticated()){
        let user = req.user.username;
        if(user.localeCompare("BailaBollywood Admin")==0)
        {   console.log("Admin Logged IN");
            return next();}
    }
    console.log("You are not authorised");
    req.flash("error", "You are not authorised to do that");
    res.redirect("/");

}



module.exports = middlewareObj;
