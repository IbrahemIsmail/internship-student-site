const mongoose= require("mongoose");
const internSchema=new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	created: {type: Date, default: Date.now},
	applications: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Application"
		}
	],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	chosen: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Application"
	}
});

module.exports =mongoose.model("Intern", internSchema);