var express = require("express");
var app = express();
var mongoose = require("mongoose");
var body_parser = require("body-parser");
var cors = require("cors");

mongoose.connect(
  "mongodb+srv://maxtron_coder:san78hul@app.9xipmzn.mongodb.net/?retryWrites=true&w=majority"
);

var schema_one = mongoose.Schema({
  user: String,
  timeadded: String,
  ms: String,
  message: String,
});

var schema_two = mongoose.Schema({
  user: String,
  pass: String,
});

var model_one = new mongoose.model("messages", schema_one);
var model_two = new mongoose.model("users", schema_two);

app.use(cors());
app.use(express.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "\\build"));

app.get("/*", (req, res) => {
  res.sendFile("index.html");
});

app.post("/add", (req, res) => {
  var message = req.body.msg;
  var user = req.body.user;
  var date = new Date();
  model_one.create({
    user: user,
    message: message,
    ms: `${date.getMilliseconds()}`,
    timeadded: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}}`,
  });
});

app.post("/getmsgs", (req, res) => {
  model_one.find({}, (err, data) => {
    res.send(data);
  });
});

app.post("/sign", (req, res) => {
  var name = req.body.name;
  var pass = req.body.pass;
  model_two.create({ user: name, pass: pass });
  res.send("Account Created !");
});
app.post("/login", (req, res) => {
  var name = req.body.name;
  var pass = req.body.pass;
  model_two.find({}, (err, users) => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].user == name && users[i].pass == pass) {
        res.send("Login successful");
        break;
      }
      if (i == users.length - 1) {
        res.send("Account not found");
      }
    }
  });
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static(__dirname + "\\client\\build"));
}

app.listen(process.env.PORT || 6001);
