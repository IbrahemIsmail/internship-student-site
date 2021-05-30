const express               = require("express"),
      app                   = express(),
      axios                 = require('axios'),
      bodyParser            = require("body-parser"),
	  moment                = require("moment"),
      mongoose              = require("mongoose"),
	  User                  = require("./models/user"),
	  Intern                = require("./models/internships"),
	  Application           = require("./models/applications"),
	  seedDb                = require("./seeds"),
	  flash                 = require("connect-flash"),
	  passport              = require("passport"),
	  localStrategy         = require("passport-local"),
	  methodOverride        = require("method-override"),
	  passportLocalMongoose = require("passport-local-mongoose");



const internshipRoutes  = require("./routes/internships"),
	  applicationRoutes = require("./routes/applications"),
	  indexRoutes       = require("./routes/index");

const DBURL = process.env.DBURL || 'mongodb://localhost:27017/spmProjectDB';

mongoose.connect(DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
// seedDb();

app.locals.moment = require('moment');
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret: "password",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.use(new localStrategy(compUser.authenticate()));
// passport.serializeUser(compUser.serializeUser());
// passport.deserializeUser(compUser.deserializeUser());


app.use(function(req, res, next){
	res.locals.currUser = req.user;
	res.locals.error    = req.flash("error");
	res.locals.success  = req.flash("success");
	next();
});

app.use("/internships", internshipRoutes);
app.use("/internships/id=:id/applications", applicationRoutes);
app.use(indexRoutes);

app.listen(3000, function(){
	console.log("server is up and running");
});






