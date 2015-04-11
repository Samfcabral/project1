var express = require("express"),
  bodyParser = require("body-parser"),
  db = require("./models"),
  passport = require("passport"),
  session = require("cookie-session"),
  request = require("request"),
  app = express();

var Zillow = require('node-zillow');
var zillow = new Zillow('X1-ZWz1dzv5l0hkaz_6h6e1');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
//End of dependencies

//Session
app.use(session({
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
passport.serializeUser(function (user, done) {
  console.log("SERIALIZED JUST RAN!");
  done(null, user.id);
});

/*
DeSERIALizing
Taking a string and turns into an object
  using the relevant data stored in the session
*/
passport.deserializeUser(function (id, done) {
  console.log("DESERIALIZED JUST RAN!");
  db.user.find({
    where: {
      id: id
    }
  })
    .then(function (user) {
      done(null, user);
    },
      function (err) {
        done(err, null);
      });
});

// HOME PAGE
app.get("/", function (req, res) {
  console.log(req.user);
  res.render("index", {currentUser: req.user});
});

// WHEN SOMEONE WANTS THE SIGNUP PAGE
app.get("/register", function (req, res) {
  if (!req.user) {
    res.render("users/register", {currentUser: req.user});
  } else {
    res.redirect("/", {currentUser: req.user});
  }
});

app.get("/users/:id", function (req, res) {
  console.log("USERSSS SHOW");
  req.user.getWatchlists().then(function (list) {
    res.render("users/profile", {watchlist: list});
  });
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
        // after login redirect to home
        console.log("Id: ", user.id)
        res.redirect("/");
      });
    });
});

// WHEN SOMEONE WANTS THE LOGIN PAGE
app.get("/login", function (req, res) {
  if (req.user) {
    console.log("App Login Get");
    res.redirect("/");
  } else {
    console.log("App Login Get Else");
    res.render("users/login", {currentUser: req.user});
  }
});

// AUTHENTICATING A USER
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Logout User
app.get("/logout", function (req, res) {
  // LOG OUT
  req.logout();
  res.redirect("/");
});

// Create a handler to respond to GET requests
// to our search page ("/search").
app.get('/search', function (req, res) {
  var address = req.query.address;
  var city = req.query.city;
  var state = req.query.state;
  var zip = req.query.zip;
  var params = { address: address, city: city, state: state, zip: zip};
  zillow.getDeepSearchResults(params)
    .then(function (results) {
      console.log("RECEIVING RESULTS");
      try {
        var price = results.valueOf().response[0].results[0].result[0].zestimate[0].amount[0]._;
        console.log(price);
        price = price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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
        soldPrice = soldPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        console.log(soldPrice);
        console.log("PARAMS", params.address);
        res.render('site/show', {currentUser: req.user, params: params, amount: price, bedrooms: numRooms, bathrooms: bathrooms, sqft: sqft, year: year, soldDate: soldDate, soldPrice: soldPrice});

      } catch (error) {
        res.redirect("/fail");
      }
    });
});

app.post("/watchlist", function (req, res) {
  if (req.user) {
    db.watchlist.create({
      street: req.body.watchlist.street,
      userId: req.user.id
    }).then(function (watchlist) {
      res.redirect("/users/" + req.user.id);
    });
  } else {
    res.redirect("/");
  }
});

app.get("/fail", function (req, res) {
  res.render("site/fail");
});

db.sequelize.sync().then(function () {
  var server = app.listen(process.env.PORT || 3000, function() {
    console.log(new Array(51).join("*"));
    console.log("\t LISTENING ON: \n\t\t localhost:3000");
    console.log(new Array(51).join("*")); 
  });
});
