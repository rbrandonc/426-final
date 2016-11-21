var port = 1337;
var express = require('express');
var app = express();

app.set('view engine', 'pug')

app.use('/css', express.static(__dirname + '/css'));
app.use('/images', express.static(__dirname + '/images'));

app.use('/', function(req, res) {
    res.render('index', {title: 'test'});
});

app.listen(port);

console.log('Server running at http://localhost:' + port);
