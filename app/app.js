<<<<<<< HEAD
"use strict";

//modules
=======
"use strict"

// module
>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
<<<<<<< HEAD
//routing
const home = require("./src/routes/home");

//app setting
=======


const home = require("./src/routes/home");

>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
<<<<<<< HEAD

app.use(bodyParser.urlencoded({extended:true}));

app.use("/", home);


=======
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", home);

>>>>>>> 7dcbefe48ecb63333c30afaea5c5c4ff34074ab3
module.exports = app;