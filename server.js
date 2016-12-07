var port = 1337;
var port2 = 1338;
var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

var fs = require('fs');
var options = {
	key : fs.readFileSync('server/server.key'),
	cert : fs.readFileSync('server/server.crt')
};

var app = express();
app.set('view engine', 'pug');

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/github', express.static(__dirname + '/github'));

app.post('/update', function(req, res) {
	console.log("got a post");
	var sys = require('sys');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { sys.puts(stdout); }
	exec("sh github/update.sh", puts);
});

app.use('/', function(req, res) {
  res.render('index', {title: 'Vacation Destinations'});
	console.log("app.use test");
});

// REST routes
app.get('/destinations', function(req, res){

});

app.post('/destinations', function(req, res){

});

app.get('/destinations/:id', function(req, res){

});

app.post('/destinations/:id', function(req, res){

});

app.delete('/destinations/:id', function(req, res){

});

// // Connect to the database before starting the application server.
// mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
//   if (err) {
//     console.log(err);
//     process.exit(1);
//   }

https.createServer(options, app).listen(port, function(){
	console.log('Server running at https://localhost:' + port);
});