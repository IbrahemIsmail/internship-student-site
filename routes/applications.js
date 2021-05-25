const express     = require("express"),
	  router      = express.Router({mergeParams: true}),
      Intern      = require("../models/internships"),
	  User        = require("../models/user"),
	  mw          = require("../middleware"),
	  Application = require("../models/applications");
	  	  
// let thingy = true;

router.get("/new", mw.isLoggedIn, function(req, res){
	Intern.findById(req.params.id, function(err, foundIntern){
		if(err){
			console.log(err);
		}
		else{
			res.render("applications/new", {intern: foundIntern});
		}
	});
});
router.post("/", mw.isLoggedIn, function(req, res){
	Intern.findById(req.params.id, function(err, foundIntern){
		// Application.find((err, foundApplications)=>{
			
		// 	let apps = foundApplications.filter(val => val.author.username == req.user.username);
			
		// 	if(apps.length>0){
		// 		let appThingy = ''+apps[0]._id;
		// 		console.log(apps[0]._id);
		// 		for(let i=0;i<foundIntern.applications.length; i++){
		// 			// console.log(`is ${apps[0]._id} equals ${foundIntern.applications[i]} ?`)
		// 			let appThingyThingy = ''+foundIntern.applications[i];
		// 			if(!(appThingy.localeCompare(appThingyThingy))){
		// 				req.flash("error", "You can only apply once you greedy bastard");
		// 				return res.end();
		// 			} 
		// 		}
		// 	}
		// });
		// console.log(thingy);
		
		let myFunc = ()=>{
			let appThingy = ''+foundIntern._id;
			
			for(let i=0; i<req.user.internshipApplications.length; i++){
				
				let appThingy2 = ''+req.user.internshipApplications[i]; 
				
				if(!(appThingy.localeCompare(appThingy2))){
					return true;
				}
			}
			return false;
		}
		
		if(err){
			console.log(err);
			res.redirect("/internships");
		}
		else if(myFunc()){
			req.flash("error", "You can only apply once");
			res.redirect("/internships/id="+foundIntern._id);
		}
		else {
			Application.create(req.body.application, function(err, application){
				if(err){
					req.flash("error", "Something Went Wrong :(");
					console.log(err);
				}
				else{
					application.author.id= req.user._id;
					application.author.username = req.user.username;
					application.save();
					foundIntern.applications.push(application);
					foundIntern.save();
					
					User.findOne({username: req.user.username}, (err, foundUser)=>{
						if(err) console.log(err);
						else{
							foundUser.internshipApplications.push(foundIntern);
							foundUser.save();
						}
					});
					
					req.flash("success", "Added Application Successfully");
			        res.redirect("/internships/id="+foundIntern._id);
				}
			});
		}
	});
});
router.get("/:applicationId/edit", mw.authComment, function(req, res){
	Intern.findById(req.params.id, function(err, found){
		if(err || !found){
			req.flash("error", "Internship Not Found");
			return res.redirect("back");
		}
		else{
			Application.findById(req.params.applicationId, function(err, found){
		if(err){
			res.redirect("back");
		} else{
			res.render("applications/edit", {internId: req.params.id, application: found});
		}
	});
		}
	});
});
router.put("/:applicationId", mw.authComment, function(req, res){
	Application.findByIdAndUpdate(req.params.applicationId, req.body.application, function(err, updated){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/internships/id="+req.params.id);
		}
	});
});
router.delete("/:applicationId", mw.authComment, function(req, res){
	Intern.findById(req.params.id, function(err, foundIntern){
		User.findOne({username: req.user.username}, (err, foundUser)=>{
			if(err) console.log(err);
			
			else{
				let appThingy = ''+foundIntern._id;
				
				for(let i=0; i<req.user.internshipApplications.length; i++){
					
					let appThingy2 = ''+req.user.internshipApplications[i]; 
					
					if(!(appThingy.localeCompare(appThingy2))){
						foundUser.internshipApplications.splice(i, 1);
						foundUser.save();
					}
				}
			}
		});
	});
	
	Application.findByIdAndRemove(req.params.applicationId, function(err){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success", "Application Deleted");
			res.redirect("/internships/id="+req.params.id);
		}
	});
});



router.put("/applicationid=:aId/choose", mw.authUser ,function(req, res){
	Intern.findByIdAndUpdate(req.params.id, {chosen: req.params.aId} ,function(err, upIntern){
		if(err){
			console.log(err);
			res.redirect("/internships");
		} else{
			req.flash("success", "application chosen");
			res.redirect("/internships/id="+req.params.id);
		}
	});
});

router.put("/applicationid=:aId/cancel", mw.authUser ,function(req, res){
	Intern.findByIdAndUpdate(req.params.id, {chosen: "000000000000"} ,function(err, upIntern){
		if(err){
			console.log(err);
			res.redirect("/internships");
		} else{
			req.flash("success", "application deselected");
			res.redirect("/internships/id="+req.params.id);
		}
	});
});



module.exports = router;