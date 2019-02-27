var express =       require('express'),
    app =           express(),
    bodyParser =    require('body-parser'),
    LocalShop =     require("./models/shop"),
    Events =        require("./models/events"),
    Comment =       require("./models/comments"),
    seedDB =        require("./seeds"),
    passport =      require("passport"),
    LocalStrategy = require('passport-local'),
    User =       require("./models/user");
    //Require Mongoose ODM(1) 
    mongoose =      require("mongoose");

//Connect to Database(2)
mongoose.connect("mongodb://localhost:27017/ecca", { useNewUrlParser: true });
seedDB();

//Action models(5)
// LocalShop.create(
//     {
//         name: 'Fletchers Bottle Shop', 
//         service: 'Convenience store', 
//         image: 'https://fletcherhillsbottleshop.com/wp-content/uploads/2018/03/welcome-to-the-bottleshop.jpg',
//         address: '2447 Fletcher Pkwy, El Cajon, CA 92020',
//         phone: 619469-8410 
//     }, function(err, localshop) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log('Newly Created Local Shop: ');
//             console.log(localshop);
//         }
//     }
// )

// Event.create(
//     {
//         name: 'Dinner and a Concert', 
//         date: 'May 8 through September 25', 
//         image: 'https://www.cityofelcajon.us/Home/ShowPublishedImage/1363/635597815567530000',
//         address: 'Prescott Promenade',
//         website: "www.hauntfest.org" 
//     }, function(err, event) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log('Newly Created Event: ');
//             console.log(event);
//         }
//     }
// )

//------------------- ^ Database ^ -----------------------

//Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

//Passport Config
app.use(require("express-session")({
    secret: "This is the secret page for the user",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Routes
app.get('/', function(req, res) {
    res.render('landing.ejs');
});

app.get('/localshops', function (req, res) {
    //Action model from mongoose to call all Local Shops(5b)
    LocalShop.find({}, function(err, shops) {
        if(err) {
            console.log(err);
        } else {
            res.render('shops/localshops.ejs', { shops:shops });
        }
    });  
});

app.post('/localshops', function(req, res) {
    //get data from form and add to localshops array
    let name = req.body.name;
    let service = req.body.service;
    let image = req.body.image;
    let address = req.body.address;
    let phone = req.body.phone;

    LocalShop.create({
        name, 
        service, 
        image, 
        address,
        phone
    }, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            //redirect back to localshops page
            res.redirect('/localshops');
        }
    });
});

app.get('/localshops/new', function(req, res) {
    //This route contains the data that will be provided for the new local shop...
    res.render('shops/newLocalShop.ejs')
})

app.get('/localshops/:id', function (req, res) {
    //find the localShop with provided ID
    LocalShop.findById(req.params.id).populate("comments").exec( function(err, newShop) {
            if(err) {
                console.log(err);
            } else {
            //render show template with that shop
                res.render("shops/show", { shops:newShop })
            }
        }) 
})


// ------------Events------------
app.get('/events', function (req, res) {
    
    Events.find({}, function(err, events) {
        if(err) {
            console.log(err);
        } else {
            res.render('events/events', { events:events });
        }
    });
});

app.get('/events/new', function(req, res) {
    //This route contains the data that will be provided for the new local shop...
    res.render('events/newEvent.ejs')
})

app.post('/events', function(req, res) {
    //get data from form and add to localshops array
    var name = req.body.name;
    var date = req.body.date;
    var image = req.body.image;
    var address = req.body.address;
    var website = req.body.website;

    Event.create({
        name, 
        date, 
        image, 
        address,
        website
    }, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            //redirect back to localshops page
            res.redirect('events/events');
        }
    });
});


app.get("/events/:id", function(req, res) {
   Events.findById(req.params.id, function(err, event) {
       if(err) {
           console.log(err);
       } else {
           res.render('events/show', { events:event });
       }
   });
});

app.get("/events/:id/comments/new", ( req, res ) => {
    Events.findById(req.params.id, function(err, event) {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/newEvent', { events:event } )
        }
    })
});

app.post("/events/:id/comments", function(req, res) {
    Events.findById(req.params.id, function(err, event) {
        if(err) {
            console.log(err);
            res.redirect('events/events');
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    //connect comment to store
                    event.comments.push(comment);
                    event.save();
                    //redirect to show page. 
                    res.redirect(`/events/${event._id}`); 
                }
            })
        }
    })
})


// ------------Comment Routes--------------
app.get("/localshops/:id/comments/new", isLoggedIn, function(req,res) {
    LocalShop.findById(req.params.id, function(err, foundShop) {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', { shop: foundShop });
        }
    })
})

app.post("/localshops/:id/comments", isLoggedIn, function(req, res) {
    //lookup store using id.
    LocalShop.findById(req.params.id, function(err, shop) {
        if(err){
            console.log(err);
            res.redirect('shops/localshops');
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    //connect comment to store
                    shop.comments.push(comment);
                    shop.save();
                    //redirect to show page. 
                    res.redirect(`/localshops/${shop._id}`); 
                }
            })
        }
    })
})

//Auth Routes
//Show register form
app.get('/register', function(req, res) {
    res.render('register');
})

//Handle Sign Up Logic 
app.post('/register', function(req, res) {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password), function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('shops');
        });
    };
});


//Show Login Form
app.get('/login', function(req, res) {
    res.render('login');
})
//Handling Login Logic
app.post('/login', passport.authenticate("local", {
    successRedirect: "localshops",
    failureRedirect: "login",
}), function(req, res) {});


//Logout Route 
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/landing');
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    res.redirect('/login');
}


app.listen(app.get('port'), function() {
    console.log('Server is running');
});