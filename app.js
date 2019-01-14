const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yelp_camp');

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

//schema setup

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
})
//compile in model
const Campground = mongoose.model("Campground", campgroundSchema);
Campground.create(
    {name: "Salmon Creec", image: 'https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1541405226/campground-photos/wdzo9tcuyf0pljoh67nn.jpg'
}, function(err, campground){
    if(err) {console.log(err)}
    else{console.log(campground)}
}
)
//we move array of our camps out due to hoisting
let campgrounds = [
    {name: "Salmon Creec", image: 'https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1541405226/campground-photos/wdzo9tcuyf0pljoh67nn.jpg'},
    {name: "The best Camp", image: 'https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg'},
    {name: "Mountain View", image: 'http://www.gobroomecounty.com/files/hd/Campground1.jpg'},

]

app.get('/', function(req, res){
    res.render('landing')
});

app.get('/campgrounds', function(req, res){
    //get all campgrounds from DataBase
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else{
            res.render('campgrounds', {campgrounds: allCampgrounds});
        }
    })
});

app.get('/campgrounds/new', function(req, res){
    res.render('new.ejs')
})
//post for adding new camps
app.post('/campgrounds', function(req, res){
//get data from form and add to campgrounds array
   let image = req.body.image;
   let name = req.body.name;
   let newCampground = {name: name, image: image}; 
   campgrounds.push(newCampground);
//redirect back to campgrounds page
res.redirect('/campgrounds')
})

app.listen(3001, ()=>{
    console.log('Yelp Camp is running on 3001')
});