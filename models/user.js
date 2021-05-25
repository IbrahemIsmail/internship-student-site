const mongoose              = require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	fullName: {type: String, default: ""},
	phoneNumber: {type: Number, default: 0},
	email: {type: String, default: ""},
	about: {type: String, default: ""},
	website: {type: String, default: ""},
	type: {type: String, default: ""},
	location: String,
	internshipApplications: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Intern"
		}	
	],
	socials: {
		github: {type: String, default: '-'},
		twitter: {type: String, default: '-'},
		instagram: {type: String, default: '-'},
		facebook: {type: String, default: '-'},
	}
	
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);