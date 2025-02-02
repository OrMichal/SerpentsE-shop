const express = require('express');
const cors = require('cors');
const mongo = require('mongoose');

const Product = require("./modules/Products");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.listen(port, () => console.log("Listening on port: ", port));

mongo.connect("mongodb://localhost:27017/SerpentDB")
    .then(() => console.log("connected to mongoDB"))
    .catch((err) => console.log("error occurred during db connection: ", err));


app.get("/GetProds", async (req, res) => {
    try {
        const prodQuerr = await Product.find();
        console.log(prodQuerr);
    
        return res.status(200).json(prodQuerr);
        
    } catch (err) {
        console.log(err);
        return;
    }
});