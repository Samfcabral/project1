/**
 * Simple Node.js script that uses the Browse Schools method
 *  of the GreatSchools API
 *  http://www.greatschools.org/api/docs/browseSchools.page
 */
var app = express();
var util = require('util');

// API Key.
var schoolId = '1yg7scs9gq1xffo5fvblrgxx y';

// API URL components.
var state = 'MD';
var city = 'Baltimore';
var type = 'public';
var level = 'high-schools';
var limit = 1;

// Build path to API resource.
var path = '/schools/' + state + '/' + city + '/' + type + '/' + level;

// Add parameters to request.
path += '?key=' + schoolId + '&limit=' + limit;

var options = {
	host: 'api.greatschools.org',
	path: path,
	method: 'GET' 
}

var xml = '';

app.get(options, function(response) {
	response.on('data', function(chunk){
		xml += chunk;
	});
	response.on('end', function(){
		util.puts(xml);
	});
});

