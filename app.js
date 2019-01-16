const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser:true });

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

//schema setup

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String, 
    description: String
})
//compile in model
const Campground = mongoose.model("Campground", campgroundSchema);
// Campground.create(
//     {name: "The best Camp", 
//     image: 'https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg',
//     description: "No water, no bath! But cool cux no peeple"
// }, function(err, campground){
//     if(err) {console.log(err)}
//     else{console.log(campground)}
// }
// )
//we move array of our camps out due to hoisting
let campgrounds = [
    {name: "Salmon Creec", image: 'https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1541405226/campground-photos/wdzo9tcuyf0pljoh67nn.jpg'},
    {name: "The best Camp", image: 'https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg'},
    {name: "Mountain View", image: 'http://www.gobroomecounty.com/files/hd/Campground1.jpg'},

]

app.get('/', function(req, res){
    res.render('landing')
});

//INDEX route to show our campgrounds
app.get('/campgrounds', function(req, res){
    //get all campgrounds from DataBase
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else{
            //то есть здесь раньше мы рендерили campgrounds из массива es.render('campgrounds', {campgrounds: сampgrounds});
            res.render('campgrounds', {campgrounds: allCampgrounds});
        }
    })
});
//NEW show form to create new cmpground
app.get('/campgrounds/new', function(req, res){
    res.render('new.ejs')
});
//POST for adding new camps
app.post('/campgrounds', function(req, res){
//get data from form and add to campgrounds array
   let image = req.body.image;
   let name = req.body.name;
   let description = req.body.description;

   let newCampground = {name: name, image: image, description: description}; 
//we don't need this line anymore cuz now we use mongodb   campgrounds.push(newCampground);
//create new campground and save it to db также как мы делали до этого выше
Campground.create(newCampground, function (err, newlyCreated){
    if(err){
        console.log(err);//here we need to make err page
    } else{
//redirect back to campgrounds page
        res.redirect('/campgrounds')
    }
})
})

//page with more info for every different camp with id
app.get('/campgrounds/:id', function(req, res){
    //find the campground with provided ID with new method findbyID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
//render show template with that campground
res.render('show', {campground: foundCampground})
        }
    });
    
});

app.listen(3001, ()=>{
    console.log('Yelp Camp is running on 3001')
});