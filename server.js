var port = 1337;
var express = require('express');
var app = express();

app.set('view engine', 'pug')

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/github', express.static(__dirname + '/github'));

app.post('/update', function(req, res) {
	console.log("got a post");
	var sys = require('sys')
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { sys.puts(stdout) }
	exec("sh github/update.sh", puts);
});

app.use('/', function(req, res) {
    res.render('index', {title: 'test'});
});

app.listen(port);

console.log('Server running at http://localhost:' + port);
