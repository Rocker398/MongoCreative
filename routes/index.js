var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pins = mongoose.model('Pins');

router.get('/pins', function(req, res, next) {
  Pins.find(function(err, pins) {
    if(err) { return next(err); }
    res.json(pins);
  });
}

router.post('/pins', function(req, res, next) {
  var pin = new Pin(req.body);
  pin.save(function(err, pin) {
    if(err) { return next(err); }
    res.json(pin);
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
