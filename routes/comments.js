const express = require('express');
//we will use express router and change app.get to router.get and so on
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// ===================
// COMMENTS ROUTES
//====================
router.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res) {
    //find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
})
//post request to comments

router.post('/campgrounds/:id/comments', isLoggedIn,function (req, res) {
    //lookup campground using id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            //create new comment and we dont need to create new variables, everything we have in our object req.body.comment
            //connect new comment to campground
            //redirect to campground showpage
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username =  req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })

});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}
module.exports = router;
