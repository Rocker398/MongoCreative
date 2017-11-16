var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Pins = mongoose.model('Pins');

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
console.log('Connected');
});

router.get('/pins', function(req, res, next) {
  Pins.find(function(err, pins) {
    if(err) { return next(err); }
    res.json(pins);
  });
});

router.post('/pins', function(req, res, next) {
  //console.log(req);
  var pin = new Pins(req.body);
	console.log("after line");
  pin.save(function(err, pin) {
    if(err) { return next(err); }
    res.json(pin);
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('pin', function(req,res, next, id){
	var query = Pins.findById(id);
	query.exec(function(err,pin){
		if(err) {return next(err)}
		if(!pin) { return next(new Error("cant find pin"));}
		req.pin = pin;
		return next();
	});
});

router.get('/pins/:pin', function(req, res) {
	res.json(req.pin);
});

router.delete('/pins/:pin', function(req, res, next) {
	console.log('in router delete');
	req.pin.remove();
	res.sendStatus(200);
	//req.pin.delete(function(err, pin){
	//	if(err) { return next(err) };
	//	res.json(pin);
	//});
});

router.param('top', function(req, res, next, top) {
	req.top = top;
	return next();
});

router.param('left', function(req, res, next, left) {
	req.left = left;
	return next();
});

router.put('/pins/:pin/:top/:left', function(req, res, next) {
	console.log('in router put');
	Pins.update({_id: req.pin._id}, {
    		Top: req.top, 
    		Left: req.left
	}, function(err, numberAffected, rawResponse) {
   		//handle it
	})
	res.sendStatus(200);
});

module.exports = router;
