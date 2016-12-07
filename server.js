var port = 1337;
var port2 = 1338;
var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');

var fs = require('fs');
var options = {
	key : fs.readFileSync('server/server.key'),
	cert : fs.readFileSync('server/server.crt')
};

var app = express();

// view engine
//app.set('views', express.static(__dirname, '/views'));
app.set('view engine', 'pug');
app.engine('html', require('pug').renderFile);

// set static folders
app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/github', express.static(__dirname + '/github'));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var index = require('./routes/index');
var destinations = require('./routes/destinations');

app.use('/', index);
app.use('/api', destinations);

https.createServer(options, app).listen(port, function(){
	console.log('Server running at https://localhost:' + port);
});