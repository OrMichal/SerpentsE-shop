const mongo = require("mongoose");

const productScheme = new mongo.Schema({
    type: {type: String},
    name: {type: String},
    price: {type: Number}
}, {collection: "tbProducts"});

const product = mongo.model("product", productScheme);
module.exports = product;