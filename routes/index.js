var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('index.pug', {title: 'Vacation Destinations'});
});

module.exports = router;