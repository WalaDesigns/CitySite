let mongoose = require('mongoose');

let eventSchema = new mongoose.Schema({
    name: String, 
    date: String, 
    image: String,
    address: String,
    website: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]
});


module.exports = mongoose.model("Events", eventSchema);