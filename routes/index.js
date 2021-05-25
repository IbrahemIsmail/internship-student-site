const express  = require("express"),
	  router   = express.Router(),
	  passport = require("passport"),
	  mw       = require("../middleware"),
	  Intern   = require("../models/internships"),
	  User     = require("../models/user");


router.get("/", function(req, res){
	res.render("home");
});


router.get("/user=:username", (req, res)=>{
	// if(currUser){
		User.findOne({username: req.params.username}, (err, foundUser)=>{
			if(err){
				console.log(err);
			}
			else{
				Intern.find({_id: {$in: foundUser.internshipApplications}}, (err, foundInterns)=>{
					res.render("profile/index", {user: foundUser, internships: foundInterns});
				});
			}
		});	
	// }
});

router.get("/view=:username", (req, res)=>{
	User.findOne({username: req.params.username}, (err, foundUser)=>{
		res.render("profile/outsider", {user: foundUser});
	});
});

router.put("/user=:username", mw.authUser2, function(req, res){
	// console.log(req.body.user);
	User.findOneAndUpdate({username: req.params.username}, req.body.user,  function(err, upUser){
		if(err){
			console.log(err);
			res.redirect("/internships");
		}
		else{
			// console.log(upUser);
			res.redirect("user="+req.params.username);
		}
	});
});

router.get("/register", function(req, res){
	res.render("register");
});
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username, type: "Student"}), req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome "+ user.username);
			res.redirect("/internships");
		});
	});
});
router.get("/login", function(req, res){
	res.render("login");
});
router.post("/login", passport.authenticate("local", {
	successRedirect: "/internships",
	failureRedirect: "/login"
	}), function(req, res){
	req.flash("success", "Logged in Successfully!");
});
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged Out Successfully!")
	res.redirect("/internships");
});




//////////////////////////COMPANY ROUTES
router.get("/compRegister", function(req, res){
	res.render("compRegister");
});
router.post("/compRegister", function(req, res){
	User.register(new User({username: req.body.username, type: "Company"}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.render("compRegister");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome "+ user.username);
			res.redirect("/internships");
		});
	});
});
// router.get("/compLogin", function(req, res){
// 	res.render("compLogin");
// });
// router.post("/compLogin", passport.authenticate("local", {
// 	successRedirect: "/internships",
// 	failureRedirect: "/compLogin"
// 	}), function(req, res){
// 	req.flash("success", "Logged in Successfully!");
// });
// router.get("/compLogout", function(req, res){
// 	req.logout();
// 	req.flash("success", "Logged Out Successfully!")
// 	res.redirect("/internships");
// });



module.exports = router;