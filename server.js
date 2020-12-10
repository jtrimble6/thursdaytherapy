// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./server/passport');
const app = express();
const path = require("path");
const userRoutes = require("./routes/API/userAPI");
const sessionRoutes = require("./routes/API/sessionAPI");
const contactRoutes = require('./routes/API/contactAPI')
const purchaseRoutes = require('./routes/API/purchaseAPI')
const productRoutes = require('./src/app/Product/routes')
const cartRoutes = require('./src/app/Cart/routes');
const { cart } = require('./src/app/Cart/repository');
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/files', express.static("files"));


// configure body parser for AJAX requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();
require("./config/mongoose.js")(app);
require('./src/routeHandler')(app)


// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "PRODUCTION") {
	app.use(express.static(path.join(__dirname, "client", "build")));
  }
  
//   app.use('/thursdaytherapy/', express.static(path.join(__dirname, "client/build")));
  

app.use(express.static('client/build'));
app.use(passport.initialize());
app.use(passport.session());
app.use(userRoutes, sessionRoutes, contactRoutes, purchaseRoutes)
app.use('/thursdaytherapy/', express.static(path.join(__dirname, "client/build")));
app.use(
	session({
	  secret: 'fraggle-rock',
	  resave: false,
	  saveUninitialized: false
	})
  );
  
passport.serializeUser(function(user, done) {
	done(null, user._id);
  });
   
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
	  done(err, user);
	});
  });

// routes
// app.get('/', (req, res) => {
// 	res.send('Hello from MERN');
// });

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	// res.sendFile(path.join(__dirname, "client/build/index.html"));
	// const index = path.join(__dirname, 'build', 'index.html');
  	// res.sendFile(index);
  });

// Bootstrap server
app.listen(PORT, () => {
	console.log(`Server now listening on port ${PORT}.`);
});