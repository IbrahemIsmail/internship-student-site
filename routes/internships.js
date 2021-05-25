const express = require("express"),
	  router  = express.Router(),
	  mw      = require("../middleware"),
	  User    = require("../models/user"),
	  Intern  = require("../models/internships");

router.get("/", function(req, res){
	Intern.find({}, function(err, allInternships){
		if(err){
			console.log(err);
		}
		else{
			res.render("internships/index", {interns: allInternships});
		}
	});
});
router.get("/id=:id", function(req, res){
	Intern.findById(req.params.id).populate("applications").exec(function(err, foundIntern){
		if(err || !foundIntern){
			console.log(err);
			req.flash("error", "Internship Not Found");
			return res.redirect("back");
		}
		else{
			User.findOne({username: foundIntern.author.username}, (err, foundUser)=>{
				if(err || !foundIntern){
					console.log(err);
					req.flash("error", "Internship Not Found");
					return res.redirect("back");
				}
				else{
					res.render("internships/show", {intern: foundIntern, user: foundUser});
				}
			});
		}
	});
});
router.get("/new", mw.isLoggedInAndCompany, function(req, res){
	res.render("internships/new");
});
router.post("/", mw.isLoggedIn, function(req, res){
	const name        = req.body.name,
	      image       = req.body.image,
		  price       = req.body.price,
	      description = req.body.description,
		  author      = {id:req.user._id,
						 username:req.user.username};
		Intern.create({
			name: name,
			image: image,
			price: price,
			description: description,
			author: author
		}, function(err, intern){
		if(err){
			console.log("Error: "+err);
		}
		else{
			res.redirect("/internships");
		}
	});
});
router.get("/id=:id/edit", mw.authUser, function(req, res){
	Intern.findById(req.params.id, function(err, foundIntern){
		res.render("internships/edit", {intern: foundIntern});
	});
});



router.put("/id=:id", mw.authUser, function(req, res){
	Intern.findByIdAndUpdate(req.params.id, req.body.intern,  function(err, upIntern){
		if(err){
			console.log(err);
			res.redirect("/internships");
		}
		else{
			res.redirect("/internships/id="+req.params.id);
		}
	});
});
router.delete("/id=:id", mw.authUser, function(req, res){
	Intern.findByIdAndRemove(req.params.id, function(err, upIntern){
		if(err){
			console.log(err);
			res.redirect("/internships");
		}
		else{
			req.flash("success", "Internship Deleted");
			res.redirect("/internships");
		}
	});
});


module.exports = router;


