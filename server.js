// server.js
const express = require('express');
const http = require('http');
// const enforce = require('express-sslify');
// const { forceDomain } = require('forcedomain');
// const sslRedirect = require('heroku-ssl-redirect');
// var secure = require('ssl-express-www');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require("mongoose");
const session = require('express-session');
const crypto = require('crypto')
const passport = require('./server/passport');
const app = express();
const path = require("path");
const multer = require("multer");
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const userRoutes = require("./routes/API/userAPI");
const sessionRoutes = require("./routes/API/sessionAPI");
const contactRoutes = require('./routes/API/contactAPI')
const purchaseRoutes = require('./routes/API/purchaseAPI')
const productRoutes = require('./routes/API/productAPI')
// const cartRoutes = require('./src/app/Cart/routes');
// const { cart } = require('./src/app/Cart/repository');
const { Client, Environment, ApiError } = require('square');
const PORT = process.env.PORT || 5000;

// Set the Access Token which is used to authorize to a merchant
const accessToken = 'EAAAEE9dzaHn0vQMcZ1X7g7FoImy-euP0JKAdxWuA6W6xx0409Jxub1-OSpr1XEM';

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/files', express.static("files"));

// configure body parser for AJAX requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();
// require("./config/mongoose.js")(app);
require('./src/routeHandler')(app)


// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "PRODUCTION") {
	app.use(express.static(path.join(__dirname, "client", "build")));
  } 

app.use('/thursdaytherapy/', express.static(path.join(__dirname, "client/build")));
  
// app.use(secure);

app.use(express.static('client/build'));
app.use(passport.initialize());
app.use(passport.session());
app.use(userRoutes, sessionRoutes, contactRoutes, purchaseRoutes, productRoutes)
// app.use('/thursdaytherapy/', express.static(path.join(__dirname, "client/build")));
app.use(
	session({
	  secret: 'fraggle-rock',
	  resave: false,
	  saveUninitialized: false
	})
  );

// Initialized the Square api client:
//   Set sandbox environment for testing purpose
//   Set access token
const client = new Client({
	environment: Environment.Sandbox,
	accessToken: accessToken,
  });
  
passport.serializeUser(function(user, done) {
	done(null, user._id);
  });
   
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
	  done(err, user);
	});
  });

app.use(function(req, res, next) { //allow cross origin requests
	res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", true);
	next();
  });

//force HTTPS and redirect WWW

app.use(function (req, res, next) {
	if (req.header('x-forwarded-proto') === 'http') {
	  res.redirect(301, 'https://' + req.hostname + req.url);
	  return
	}
	next()
  });

// app.get('*',function(req,res,next){
// 	if(req.headers['x-forwarded-proto']!='https')
// 	  res.redirect('https://thursday-therapy.com'+req.url)
// 	else
// 	  next() /* Continue to other routes if we're not redirecting */
//   })

// app.use(enforce.HTTPS({ trustProtoHeader: true }))
// app.use('*', (req, res, next) => {
// 	if (req.secure) {
// 	  return next();
// 	}
// 	res.redirect(`https://${req.hostname}${req.url}`);
//   });

// app.get('*',function(req,res,next){
// 	if(req.headers['x-forwarded-proto']!='https')
// 	  res.redirect('https://thursday-therapy.com'+req.url)
// 	else
// 	  next() /* Continue to other routes if we're not redirecting */
//   })

// wwwRedirect = (req, res, next) => {
//     if (req.headers.host.slice(0, 4) === 'www.') {
//         var newHost = req.headers.host.slice(4);
//         return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
//     }
//     next();
// };
// app.use(wwwRedirect);
// app.use(forceDomain({
// 	hostname: 'thursday-therapy.com',
// 	protocol: 'https'
//   }));

// Connect to the Mongo DB
const promise = mongoose.connect(process.env.NODE_ENV === 'development' ? "mongodb://localhost:27017/cart" : process.env.MONGO_URI, { useNewUrlParser: true });

var gfs;
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
  console.log("Connected!")
  var mongoDriver = mongoose.mongo;
  gfs = Grid(connection.db, mongoDriver);
  gfs.collection('uploads');
});

// const conn = mongoose.connection;
// let gfs;

// conn.once('open',() => {
//   gfs = Grid(conn, mongoose.mongo);
//   gfs.collection('uploads');
// });

//create storage object
const storage = new GridFsStorage({
  db: promise,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

app.post("/upload/:productId", function (req, res, next) {
	try {
		upload.single('file')(req, res, function (error) {
			if (error) {
			  console.log(`upload.single error: ${error}`);
			  return res.sendStatus(500);
			} else {
			  console.log('UPLOAD FILE: ', req.file)
			  gfs.files.update({'filename': req.file.filename}, 
				  {'$set': 
					  {
					  'productId': req.params.productId
					  },
				  })
			}
			// code
		  })
	  } catch (error) {
		return res.status(400).json({ error: error.toString() });
	  }
	
  });

  // @route GET /files
  // @desc Display all files in JSON
  
app.get('/uploads', (req, res) => {
	// console.log('UPLOADS RESPONSE: ', res.data)
	gfs.files.find().toArray((err, files) => {
	  // Check if files exist
	//   console.log('GFS: ', gfs)
	  if(!files || files.length === 0) {
		return res.status(404).json({
		  err: 'No images exist: '
		})
	  } else {
		// console.log('ALL FILES: ', files)
		files.map(file => {
		  if(file.contentType.startsWith('image')) {
			file.isImage === true
		  } else {
			file.isImage === false
		  }
		})
	  }
  
	  // Files exist
	  return res.json(files)
	})
  })

app.get('/uploads/:filename', (req, res) => {
	gfs.files.findOne({filename: req.params.filename}, (err, file) => {
	  // Check if files exist
	  if(!file || file.length === 0) {
		console.log('NO IMAGES FOUND')
		return res.status(404).json({
		  err: 'No images exist'
		})
	  } 
  
	  // File exists
	//   console.log('FILE EXISTS!!!! ', file)
	//   return res.json(file)

	  if(file.contentType === 'image/jpeg') {
		// Read output to browser
		// console.log('THIS IS AN IMAGE!!!')
		var readstream = gfs.createReadStream(file.filename)
		readstream.pipe(res)
	  } else {
		res.status(404).json({
		  err: 'Not an image'
		})
	  }

	})
  })

app.put('/uploads/:filename/:soapname', (req, res) => {
	gfs.files.update({'filename': req.params.filename}, 
		{'$set': 
			{
			'productId': req.params.soapname
			},
		})
  })

app.delete('/uploads/:id', (req, res) => {
	gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
	  if(err) {
		return res.status(404).json({ err: err })
	  }
	})
  })


// HANDLE SQUARE PAYMENTS

app.post('/process-payment', async (req, res) => {
	const requestParams = req.body;
  
	// Charge the customer's card
	const paymentsApi = client.paymentsApi;
	const requestBody = {
	  sourceId: requestParams.nonce,
	  amountMoney: {
		amount: 100 * requestParams.paymentAmount, // $1.00 charge
		currency: 'USD'
	  },
	  locationId: requestParams.location_id,
	  idempotencyKey: requestParams.idempotency_key,
	};
  
	try {
	  const response = await paymentsApi.createPayment(requestBody);
	  res.status(200).json({
		'title': 'Payment Successful',
		'result': response.result
	  });
	} catch(error) {
	  let errorResult = null;
	  if (error instanceof ApiError) {
		errorResult = error.errors;
	  } else {
		errorResult = error;
	  }
	  res.status(500).json({
		'title': 'Payment Failure',
		'result': errorResult
	  });
	}
  });

app.get("/", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	// res.sendFile(path.join(__dirname, "client/build/index.html"));
	// const index = path.join(__dirname, 'build', 'index.html');
  	// res.sendFile(index);
  });

app.get("/products", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

app.get("/ourstory", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

app.get("/howtobuy", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

app.get("/contactus", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

app.get("/shoppingcart", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

app.get("/checkout", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

app.get("/login", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

app.get("/admin", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

app.get("/inventory", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

app.get("/purchases", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

app.get("/tools", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

app.get("/signout", (req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

// app.get("*", (req, res, next) => {
// 	// console.error(error); // log an error
// 	res.render('errorPage') // Renders an error page to user!
//   });


// Bootstrap server

if (process.env.NODE_ENV === "development") {
	app.listen(PORT, () => {
		console.log(`Server now listening on port ${PORT}.`);
	});
  } else {
	app.listen(PORT, () => {
		console.log(`Express server now listening on port ${PORT}`);
	});
  }
