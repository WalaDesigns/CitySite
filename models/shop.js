let mongoose = require("mongoose");

//Schema Setup(3)
let localShopSchema = new mongoose.Schema({
    name: String,
    service: String,
    image: String,
    address: String,
    phone: Number,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]
});

//Create Model from Schema(4)
module.exports = mongoose.model("LocalShop", localShopSchema);

