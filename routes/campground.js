const express = require('express');
//we will use express router and change app.get to router.get and so on
const router = express.Router();
const Campground = require('../models/campground')
//INDEX route to show our campgrounds
router.get('/campgrounds', function (req, res) {
    //get all campgrounds from DataBase
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err)
        } else {
            //то есть здесь раньше мы рендерили campgrounds из массива es.render('campgrounds', {campgrounds: сampgrounds});
            res.render('campgrounds/campgrounds', {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    })
});
//NEW show form to create new cmpground
router.get('/campgrounds/new', function (req, res) {
    res.render('campgrounds/new')
});
//POST for adding new camps
router.post('/campgrounds', function (req, res) {
    //get data from form and add to campgrounds array
    let image = req.body.image;
    let name = req.body.name;
    let description = req.body.description;

    let newCampground = {
        name: name,
        image: image,
        description: description
    };
    //we don't need this line anymore cuz now we use mongodb   campgrounds.push(newCampground);
    //create new campground and save it to db также как мы делали до этого выше
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err); //here we need to make err page
        } else {
            //redirect back to campgrounds page
            res.redirect('/campgrounds')
        }
    })
})

//page with more info for every different camp with id
router.get('/campgrounds/:id', function (req, res) {
    //find the campground with provided ID with new method findbyID and then when we created commentSchema we use populate method
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render('campgrounds/show', {
                campground: foundCampground
            })
        }
    });
});

module.exports = router;