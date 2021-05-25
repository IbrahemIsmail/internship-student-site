const middlewareObj = {},
	  Intern        = require("../models/internships"),
	  User          = require("../models/user"),
	  Application   = require("../models/applications");

middlewareObj.authUser = function(req, res, next){
	if(req.isAuthenticated()){
		Intern.findById(req.params.id, function(err, foundIntern){
		if(err || !foundIntern){
			req.flash("error", "Internship Not Found");
			res.redirect("back");
		}
		else{
			if(foundIntern.author.id.equals(req.user._id)){
			   next();
			   } else{
				   req.flash("error", "You Don't Have Permission To Do That");
				   res.redirect("back");
			   }	
		}
	});
	} else{
		req.flash("error", "Please Log In First");
		res.redirect("back");
	}
}

middlewareObj.authUser2 = function(req, res, next){
	if(req.isAuthenticated()){
		User.findOne({username: req.params.username}, function(err, foundUser){
		if(err || !foundUser){
			req.flash("error", "User Not Found");
			res.redirect("back");
		}
		else{
			if(foundUser.username == (req.user.username)){
			   next();
			   } else{
				   req.flash("error", "You Don't Have Permission To Do That");
				   res.redirect("back");
			   }	
		}
	});
	} else{
		req.flash("error", "Please Log In First");
		res.redirect("back");
	}
}

middlewareObj.authComment = function(req, res, next){
	if(req.isAuthenticated()){
		Application.findById(req.params.applicationId, function(err, found){
		if(err || !found){
			req.flash("error", "Application Not Found");
			res.redirect("back");
		}
		else{
			if(found.author.id.equals(req.user._id)){
			   next();
			   } else{
				   req.flash("error", "You Don't Have Permission To Do That");
				   res.redirect("back");
			   }	
		}
	});
	} else{
		req.flash("error", "Please Log In First");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Log In First");
	res.redirect("/login")
}

middlewareObj.isLoggedInAndCompany = function(req, res, next){
	if(req.isAuthenticated() && req.user.type == "Company"){
		// console.log(req);
		return next();
	}
	else if(!req.isAuthenticated()){
		req.flash("error", "Please Log In First");
		res.redirect("/login")
	}
	else if(req.user.type != "Company"){
		req.flash("error", "You are not authenticated to do that");
		res.redirect("/internships")
	}
	
}

// middlewareObj.isLoggedIn2 = function(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	else{
// 		res.redirect("back");
// 	}
// }

module.exports = middlewareObj;