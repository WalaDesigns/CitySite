let mongoose =  require("mongoose"),
    Shop = require("./models/shop"),
    Comment = require("./models/comments"),
    Event = require("./models/events");

var data = [
    {
        name: "David Hollingsworth",
        image: "https://images.unsplash.com/photo-1462058294476-57b85c9f2bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
        description: "This is the best career path ever.",
    },
    {
        name: "Mike Meyers",
        image: "https://images.unsplash.com/photo-1532364984483-9d783cec4349?ixlib=rb-1.2.1&dpr=1&auto=format&fit=crop&w=525&q=60",
        description: "This is the best career path ever. I have a lot of faith in this career.",
    },
    {
        name: "Jason Borhese",
        image: "https://images.unsplash.com/photo-1414016642750-7fdd78dc33d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
        description: "This is the best career path ever. Yeewwww",
    },
];


var dataEvents = [
    {
        name: "Halloween",
        date: Date.now(),
        image: "https://images.unsplash.com/photo-1462058294476-57b85c9f2bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
        address: 'Spooky St. 123456',
        website: 'www.halloween.com',
        description: "Hi new description Halloween.",
    },
    {
        name: "Christmas",
        date: Date.now(),
        image: "https://images.unsplash.com/photo-1462058294476-57b85c9f2bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
        address: 'Jolly St. 123456',
        website: 'www.cmas.com',
        description: "Hi new description Christmas.",
    },
    {
        name: "New Years",
        date: Date.now(),
        image: "https://images.unsplash.com/photo-1462058294476-57b85c9f2bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
        address: 'New St. 123456',
        website: 'www.resolution.com',
        description: "Hi new description New Years.",
    },
];



function seedDB(){

// ------------  EVENTS  -------------

    //Remove all Shops
    Event.remove({}, function(err) {
        if(err) {
            console.log(err);
        } 
        console.log('removed all Events!');
        //Remove comments
        Comment.remove({}, function(err) {
            if(err) {
                console.log(err);
            }
            console.log('All comments Removed!');
        });
        
        dataEvents.forEach(function(seed) {
            //Create Event
            Event.create(seed, function(err, event) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Event has been created!');
                    //Create a comment...
                    Comment.create(
                        {
                            text: "This is Event comment.",
                            author: "Rick",
                        }, function(err, comment) {
                            if(err) {
                                console.log(err);
                            } else{
                                event.comments.push(comment);
                                event.save();
                                console.log("Created new comment");
                            }
                        }
                    );
                }
            });
        });
    });



// ------------  SHOPS  -------------

    //Remove all shops
    Shop.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("removed all shops");
        //Remove comments
        Comment.remove({}, function(err) {
            if(err) {
                console.log(err);
            }
            console.log('removed comments');
        });
        //Add New Shops
        data.forEach(function(seed){
            Shop.create(seed, function(err, shop) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("added a Shop");
                    //Create a comment
                    Comment.create(
                        {
                            text: "This is my first comment and I'll feel proud when I see it.",
                            author: "Aid",
                        }, function(err, comment) {
                            if(err) {
                                console.log(err);
                            } else {
                                shop.comments.push(comment);
                                shop.save();           
                                console.log("Created new comment");
                            }
                        }
                    );
                }
            });
        });        
    });
};




module.exports = seedDB;