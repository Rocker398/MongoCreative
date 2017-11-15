var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
ImageURL: String,
Top: String,
Left: String
});

Schema.methods.delete = function(cb){
	console.log("in model delete");
	let id = this._id;
	mongoose.find({id}).remove().exec();
}

mongoose.model('Pins', Schema);