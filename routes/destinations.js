var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://audrey:audrey@ds127958.mlab.com:27958/tripplanner', ['destinations']);

router.get('/destinations', function (req, res, next) {
  db.destinations.find(function (err, destinations) {
    if (err) {
      res.send(err);
    }
    res.json(destinations);
  });
});

/*
app.post('/destinations', function(req, res){

});

app.get('/destinations/:id', function(req, res){

});

app.post('/destinations/:id', function(req, res){

});

app.delete('/destinations/:id', function(req, res){

});

app.post('/update', function(req, res) {
	console.log("got a post");
	var sys = require('sys');
	var exec = require('child_process').exec;
	function puts(error, stdout, stderr) { sys.puts(stdout); }
	exec("sh github/update.sh", puts);
});*/
module.exports = router;