//SAMPLE REQUESTS


//SAMPLE REQUEST FOR GET DEEP SEARCH RESULTS
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

Below is an example of calling the API for the address for the exact address match "2114 Bigelow Ave", "Seattle, WA": 
http

request('http://www.zillow.com/webservice/GetZestimate.htm?zws-id=<ZWSID>&zpid=X1-ZWz1dzv5l0hkaz_6h6e1', function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	console.log(body) 
  }
})


//Below is a sample call to the API for zpid 48749425:
//http://www.zillow.com/webservice/GetZestimate.htm?zws-id=<ZWSID>&zpid=X1-ZWz1dzv5l0hkaz_6h6e1

//http://www.zillow.com/webservice/GetSearchResults.htm

// "http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=<X1-ZWz1dzv5l0hkaz_6h6e1>&address=" + address + "citystatezip="+ citystatezip;