require('dotenv').config();
const express = require('express')
const https = require('https')
const bodyParser = require("body-parser")
const path = require('path')
const nodemailer = require("nodemailer");
const check = require("./jobs/send.js")
const connect = require("./src/sqlDatabase.js")
const userRouters = require("./routes/users.js")

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use("/", userRouters);
app.use(express.static(path.join(__dirname, 'public')))

setInterval(() => {
  check.check();
}, 2000);

app.listen(port, () => { console.log("Server has started"); connect.connect() })