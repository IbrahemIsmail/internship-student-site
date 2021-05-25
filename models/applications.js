const mongoose = require("mongoose");

const ApplicationSchema = mongoose.Schema({
	text: String,
	created: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String 
	}
});


module.exports = mongoose.model("Application", ApplicationSchema);