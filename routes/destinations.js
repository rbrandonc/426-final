var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://audrey:audrey@ds127958.mlab.com:27958/tripplanner', ['destinations']);
// https://mlab.com/databases/tripplanner/collections/destinations

// get all destinations
router.get('/destinations', function (req, res, next) {
  //console.log(req.query.uid);
  var request = req.body;

  db.destinations.find({
      "uid": req.query.uid
    },

    function (err, destinations) {
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
  if (!destination.dateCreated || !destination.nearbyLocationName || !destination.uid) {
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

  if (destination.nearbyLocationName) {
    updatedDestination.nearbyLocationName = destination.nearbyLocationName;
  }
  if (destination.dateCreated) {
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