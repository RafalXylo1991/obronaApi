require('dotenv').config();
const express = require('express')
const  bodyParser = require("body-parser")
const connect = require("./src/sqlDatabase.js")

const  userRouters = require("./routes/users.js")

const app = express();
const port = 4000;

app.use(bodyParser.json())
app.use("/", userRouters);

app.listen(port, ()=>{console.log("Server has started"); connect.connect()})