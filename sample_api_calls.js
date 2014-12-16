//SAMPLE REQUESTS


//Below is an example of calling the API for the address for the exact address match "2114 Bigelow Ave", "Seattle, WA": 

var request = require('request');
request('http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=<X1-ZWz1dzv5l0hkaz_6h6e1>&address=2114+Bigelow+Ave&citystatezip=Seattle%2C+WA', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) 
  }
})

//SAMPLE REQUEST FOR GET ZESTIMATE
request('http://www.zillow.com/webservice/GetZestimate.htm?zws-id=<"X1-ZWz1dzv5l0hkaz_6h6e1">&zpid=48749425', function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	console.log(body) 
  }
})

//Below is an example of calling the API with the zpid only

request('http://www.zillow.com/webservice/GetZestimate.htm?zws-id=<ZWSID>&zpid=X1-ZWz1dzv5l0hkaz_6h6e1', function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	console.log(body) 
  }
})

//Below is an example of calling the API with the zpid only

request('http://www.zillow.com/webservice/GetZestimate.htm?zws-id=<X1-ZWz1dzv5l0hkaz_6h6e1>&zpid=X1-ZWz1dzv5l0hkaz_6h6e1', function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	console.log(body) 
  }
})


//ZILLOW zws-id
//X1-ZWz1dzv5l0hkaz_6h6e1

//Have to use node-zillow 
//npm install node-zillow
//npm install q
//var q = require('q')
//var Zillow = require('node-zillow')
//var zillow = new Zillow('X1-ZWz1dzv5l0hkaz_6h6e1')
//var params = { address: '20301 West Country Club Drive Apt 627', city: 'Aventura', state: 'FL', zip: '33180'}
//var x = zillow.getDeepSearchResults(params)
//var z = x.then(function(results) { return results; })
//var housePrice = z.valueOf().response[0].results[0].result[0].zestimate[0].amount



//var Zillow = require('node-zillow')
//var zillow = new Zillow('X1-ZWz1dzv5l0hkaz_6h6e1')
//var params = { address: '20301 West Country Club Drive Apt 627', city: 'Aventura', state: 'FL', zip: '33180'}
//var x = zillow.getDeepSearchResults(params)
//var z = x.then(function(results) {
//          res.render('/view', {amount: results.valueOf().response[0].results[0].result[0].zestimate[0].amount});
//        })
//var housePrice = z

app.get('/route', function(req,res) {
  var params = { address: '20301 West Country Club Drive Apt 627', city: 'Aventura', state: 'FL', zip: '33180'}
var x = zillow.getDeepSearchResults(params)
var z = x.then(function(results) {
          res.render('/view', {amount: results.valueOf().response[0].results[0].result[0].zestimate[0].amount});
        })
})



//Using promises
// var promise = request();
// promise.then(console.log, console.error);

// var fs_readFile = Q.denodify(fs.readFile)
// var promise = fs_readFile('myfile.txt')
// promise.then(console.log, console.error)
