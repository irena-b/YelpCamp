const express = require('express');
//we will use express router and change app.get to router.get and so on
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', function (req, res) {
    res.render('landing')
});

//AUTH Routes
//show register form
router.get("/register", function(req, res){
    res.render('register')
})
//handle sign up logic
router.post('/register', function(req, res){
    let newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render('register')
        }
        passport.authenticate('local') (req, res, function(){
            res.redirect('/campgrounds')
        })
    });
});
//show login form
router.get('/login', function(req, res){
    res.render('login');
});
//handling login logic by MIDDLEWARE so it is like app.post('/login', middleware, callback)
router.post('/login', passport.authenticate('local', 
{
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req,res){
    
})
//add lodout route
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/campgrounds')
})
//that is the function MIDLEWHERE to check if user is logged in=> now we can use it whenever it needed
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

module.exports = router;
