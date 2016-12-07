var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://audrey:audrey@ds127958.mlab.com:27958/tripplanner', ['destinations']);

// get all destinations
router.get('/destinations', function (req, res, next) {
  db.destinations.find(function (err, destinations) {
    if (err) {
      res.send(err);
    }
    res.json(destinations);
  });
});

// get single destination
router.get('/destination/:id', function (req, res) {
  db.destinations.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, function (err, destination) {
    if (err) {
      res.send(err);
    }
    res.json(destination);
  });
});

// save new destination
router.post('/destination', function (req, res) {
  var destination = req.body;
  if (!destination.date || !destination.location) {
    res.status(400);
    res.json({
      "error": "Bad data"
    });
  } else {
    db.destinations.save(destination, function (err, destination) {
      if (err) {
        res.send(err);
      }
      res.json(destination);
    });
  }
});

// update destination
router.put('/destination/:id', function (req, res, next) {
  var destination = req.body;
  var updatedDestination = {};

  if (destination.location) {
    updatedDestination.location = destination.location;
  }
  if (destination.createDate) {
    updatedDestination.createDate = destination.createDate;
  }

  if (!updatedDestination) {
    res.status(400);
    res.json({
      "error": "Bad data"
    });
  } else {
    db.destinations.update({
      _id: mongojs.ObjectId(req.params.id)
    }, updatedDestination, {}, function (err, destination) {
      if (err) {
        res.send(err);
      }
      res.json(destination);
    });
  }
});

// delete destination
router.delete('/destination/:id', function (req, res, next) {
  db.destinations.remove({
    _id: mongojs.ObjectId(req.params.id)
  }, function (err, destination) {
    if (err) {
      res.send(err);
    }
    res.json(destination);
  });
});

module.exports = router;