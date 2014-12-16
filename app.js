var express = require("express"),
  bodyParser = require("body-parser"),
  db = require("./models"),
  passport = require("passport"),
  session = require("cookie-session"),
  app = express();

var Zillow = require('node-zillow');
var zillow = new Zillow('X1-ZWz1dzv5l0hkaz_6h6e1');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
//End of dependencies

/*
  What is the session?
  It is the object that lives in our app
    and records relevant info about users
    who are signed in
*/
app.use(session( {
  secret: 'thisismysecretkey',
  name: 'chocolate chip',
  // this is in milliseconds
  maxage: 3600000
  })
);

// get passport started
app.use(passport.initialize());
app.use(passport.session());

/*
SERIALizING
Turns relevant user data into a string to be stored as a cookie
*/
passport.serializeUser(function(user, done){
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

/*
DeSERIALizing
Taking a string and turns into an object
  using the relevant data stored in the session
*/
passport.deserializeUser(function(id, done){
  console.log("DESERIALIZED JUST RAN!");
  db.user.find({
      where: {
        id: id
      }
    })
    .then(function(user){
      done(null, user);
    },
    function(err) {
      done(err, null);
    });
});

// HOME PAGE
app.get("/", function (req, res) {
  res.render("index");
});

// WHEN SOMEONE WANTS THE SIGNUP PAGE
app.get("/users/register", function (req, res) {
  res.render("users/register");
});

// WHEN SOMEONE  SUBMITS A SIGNUP PAGE
app.post("/users", function (req, res) {
  console.log("POST /users");
  var newUser = req.body.user;
  console.log("New User:", newUser);
  // CREATE a user and secure their password
  db.user.createSecure(newUser.email, newUser.password_digest, newUser.firstName, newUser.lastName, newUser.phone,
    function () {
      // if a user fails to create make them signup again
      res.redirect("/");
    },
    function (err, user) {
      // when successfully created log the user in
      // req.login is given by the passport
      req.login(user, function(){
        // after login redirect show page
        console.log("Id: ", user.id)
        res.redirect("/");
      });
    })
});

// WHEN SOMEONE WANTS THE LOGIN PAGE
app.get("/login", function (req, res) {
  res.render("users/login");
});

// AUTHENTICATING A USER
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get("/logout", function (req, res) {
  // LOG OUT
  req.logout();
  res.redirect("/");
});

app.get("/", function (req, res) {
  console.log(req.user)
  // REQ.USER IS THE USER CURRENTLY LOGGED IN

  if (req.user) {
    res.render("site/index", {user: req.user});
  } else {
    res.render("site/index", {user: false});
  }
});

app.get("/users/login", function (req, res) {
  res.render("users/login");
});

// Create a handler to respond to GET requests
// to our search page ("/search").
app.get('/search', function(req,res) {
    var address = req.query.address;
    var city = req.query.city;
    var state = req.query.state;
    var zip = req.query.zip;
    var params = { address: address, city: city, state: state, zip: zip}
    console.log(params);
    var x = zillow.getDeepSearchResults(params); 
    console.log(x);
    var z = x.then(function(results) {
      var price = results.valueOf().response[0].results[0].result[0].zestimate[0].amount[0]._;
      console.log(price);
      var sqft = results.valueOf().response[0].results[0].result[0].finishedSqFt[0];
      console.log(sqft);
      var numRooms = results.valueOf().response[0].results[0].result[0].bedrooms[0];
      console.log(numRooms);
      var bathrooms = results.valueOf().response[0].results[0].result[0].bathrooms[0];
      console.log(bathrooms);
      var year = results.valueOf().response[0].results[0].result[0].yearBuilt[0];
      console.log(year);
      var soldDate = results.valueOf().response[0].results[0].result[0].lastSoldDate[0];
      console.log(soldDate);
      var soldPrice = results.valueOf().response[0].results[0].result[0].lastSoldPrice[0]._;
      console.log(soldPrice);

      res.render('users/show', {amount:price, bedrooms:numRooms, bathrooms:bathrooms, sqft:sqft, year:year, soldDate: soldDate, soldPrice:soldPrice});
    })
    console.log(z);
});

app.get("users/show", function (req, res) {
  res.render("users/show");
});

db.sequelize.sync().then(function() {
  var server = app.listen(3000, function() {
    console.log(new Array(51).join("*"));
    console.log("\t LISTENING ON: \n\t\t localhost:3000");
    console.log(new Array(51).join("*")); 
  });
});