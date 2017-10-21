var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session")
var Passport = require("passport")
var LocalStategy = require("passport-local").Strategy;

var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/local";

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({ secret: "arcanine" }));
app.use(Passport.initialize());
app.use(Passport.session());


app.listen(process.env.PORT || 525);

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + '/views'))


Passport.use(new LocalStategy(function (username, password, done) {
    let user = {
        name: username,
        password: password
    }
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) throw err;
        db.collection("users").findOne({ name: user.name }, function (err, result) {
            if (err) throw err;
            if (result && result.password == user.password) {
                console.log(username + " signed in");
                return done(null, user);
            } else {
                console.log("Login failed")
                return done(null, false, { message: "Login Failed" })
            }
            db.close();
        });
    });

}));

app.post('/login',
    Passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);
app.get("/login", function (req, res) {
    res.render("login")
})

app.get("/", function (req, res) {
    res.send("Login success!!")
})

Passport.serializeUser(function (user, done) {
    done(null, user.name)
})
Passport.deserializeUser(function (username, done) {
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) throw err;
        db.collection("users").findOne({ name: username }, function (err, result) {
            if (err) throw err;
            if (result) {
                return done(null, result)
            } else {
                return (null, false)
            }
            db.close();
        });
    });
})
/*
app.get("/home", function (req, res) {
    res.render("index.ejs");
});


/*
app.post("/home", function (req, res) {
    let user = {
        name: req.body.username,
        password: req.body.password,
    }  
    
    MongoClient.connect(dbUrl, function(err, db) {
      if (err) throw err;
      
      db.collection("users").find(user).toArray(function(err, result) {
        if (err) throw err;
        if(result==''){
            console.log('No user data')
            res.redirect("/register");
        }
        else{

            res.render("home", { name: user.name, password: user.password, role: result[0].role});
        }
        console.log(result);
        db.close();
      });
    });
    
});

app.get("/register", function(req, res){
    res.render("sign_up");
});

app.post("/register",function(req, res){
    let user = {
        name: req.body.username,
        password: req.body.password,
        role: "nor"
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

app.post("/control_center", function(req, res){
    res.render("control_center");
})

*/
app.get("/test", function (req, res) {
    let user = {
        name: "amin",
        password: "admn",
    }

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) throw err;
        db.collection("users").findOne({ name: user.name }, function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result && resultresult.password == user.password) {
                console.log(result)
            } else {
                console.log("No user found")
            }
            db.close();
        });
    });

    res.send("Completed");
})