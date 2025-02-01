const express = require('express');
const cors = require('cors');
const mongo = require('mongoose');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.listen(port, () => console.log("Listening on port: ", port));

mongo.connect("mongodb://localhost:27017/SerpentsDB")
    .then(() => console.log("connected to mongoDB"))
    .catch((err) => console.log("error occurred during db connection: ", err));


