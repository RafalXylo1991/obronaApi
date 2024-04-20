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
const port = 5000;

app.use(bodyParser.json())
app.use("/", userRouters);
app.use(express.static(path.join(__dirname, 'public')))

const transport = nodemailer.createTransport({
  host: "smtp.poczta.onet.pl",
  port: 465,
  auth: {
    user: "rafal.sieczkowski@onet.eu",
    pass: "Onet@fckgwrhqq2"
  }
});
var mailOptions = {
  from: 'rafal.sieczkowski@onet.eu',
  to: 'xylohunter1991@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};
/*
transport.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
*/
setInterval(() => {
  check.check();
}, 2000);

app.listen(port, () => { console.log("Server has started"); connect.connect() })