var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/local";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(process.env.PORT || 525);

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + '/views'))


app.get("/home", function (req, res) {
    res.render("index.ejs");
});


app.post("/home", function (req, res) {
    let user = {
        name: req.body.username,
        password: req.body.password
    }  
    
    MongoClient.connect(dbUrl, function(err, db) {
      if (err) throw err;
      
      db.collection("users").find(user).toArray(function(err, result) {
        if (err) throw err;
        if(result==''){
            console.log('No data')
            res.redirect("/register");
        }
        else{
            res.render("home", { name: user.name, password: user.password });
        }
        console.log(result);
        db.close();
      });
    });
    
});

app.get("/register", function(req, res){
    res.render("sign-up");
});

app.post("/register",function(req, res){
    let user = {
        name: req.body.username,
        password: req.body.password
    }  

    MongoClient.connect(dbUrl, function(err, db) {
        if (err) throw err;
        
        db.collection("users").insertOne(user, function(err, res) {
          if (err) throw err;
          console.log("1 user added");
          db.close();
        });
      });

      res.send("Regiter completed "+ user.name);
})
