var express = require("express"),
  bodyParser = require("body-parser"),
  db = require("./models"),
  passport = require("passport"),
  session = require("cookie-session"),
  app = express();

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
Turns relevant user data into a string to be 
  stored as a cookie
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

// WHEN SOMEONE WANTS THE SIGNUP PAGE
app.get("/sign_up", function (req, res) {
  res.render("users/sign_up");
});

// HOME PAGE
app.get("/", function (req, res) {
  res.render("index");
});

// Create a handler to respond to GET requests
// to our search page ("/search").
app.get('/search', function(req, res){

  // Grab the address title from the URL query string.
  var address = req.query.address;
  // Grab the address title from the URL query string.
  var citystatezip = req.query.citystatezip;

  // Build the URL that we're going to call.
  // SAMPLE call from ZILLOW http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=<ZWSID>&address=2114+Bigelow+Ave&citystatezip=Seattle%2C+WA
  var url = "http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=<X1-ZWz1dzv5l0hkaz_6h6e1>&address=" + address + "citystatezip="+ citystatezip;

  // Call the OMDB API searching for the movie.
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      // The body is a big string of JSON. We want to
      // turn it into an Object so we can more easily
      // dig into it.
      var obj = JSON.parse(body);
      console.log(body);

      // Render a template (results.ejs) and pass it
      // the search results and call them "movieList".
      //http://localhost:3000/show?movieID=tt0301357
      res.render("users/show", {adressList: obj.Search});
    }
  });
});

app.get("/users/show", function (req, res) {
  res.render("users/show");
});

app.get("/users/login", function (req, res) {
  res.render("users/login");
});

app.get("/users/register", function (req, res) {
  res.render("users/register");
});


db.sequelize.sync().then(function() {
  var server = app.listen(3000, function() {
    console.log(new Array(51).join("*"));
    console.log("\t LISTENING ON: \n\t\t localhost:3000");
    console.log(new Array(51).join("*")); 
  });
});