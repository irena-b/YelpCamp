const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStartegy = require('passport-local')
    Campground = require('./models/campground'),
    seedDB = require('./seed'),
    Comment = require('./models/comment'),
    User = require('./models/user'); 
//require routes
const commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campground'),
    indexRoutes = require('./routes/index');

// seedDB(); //seed the database

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

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

let campgrounds = [{
        name: "Salmon Creec",
        image: 'https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1541405226/campground-photos/wdzo9tcuyf0pljoh67nn.jpg'
    },
    {
        name: "The best Camp",
        image: 'https://www.reserveamerica.com/webphotos/NH/pid270015/0/540x360.jpg'
    },
    {
        name: "Mountain View",
        image: 'http://www.gobroomecounty.com/files/hd/Campground1.jpg'
    },

]
//password cofiguration
app.use(require('express-session')({
    secret:'Nusha is the best cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    //currentUser = req.user чтобы мы не положили в res.locals будет доступно
    res.locals.currentUser = req.user;
    next();
})
//Use routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3001, () => {
    console.log('Yelp Camp is running on 3001')
});