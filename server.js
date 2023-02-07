// server.js
const express = require('express');
const http = require('http');
const SmartyStreetsSDK = require("smartystreets-javascript-sdk");
const SmartyStreetsCore = SmartyStreetsSDK.core;
const Lookup = SmartyStreetsSDK.usStreet.Lookup;
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require("mongoose");
const session = require('express-session');
const crypto = require('crypto')
const passport = require('./server/passport');
const app = express();
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const userRoutes = require('./routes/API/userAPI');
const sessionRoutes = require('./routes/API/sessionAPI');
const contactRoutes = require('./routes/API/contactAPI')
const purchaseRoutes = require('./routes/API/purchaseAPI')
const productRoutes = require('./routes/API/productAPI')
// const cartRoutes = require('./src/app/Cart/routes');
// const { cart } = require('./src/app/Cart/repository');
const { Client, Environment, ApiError } = require('square');
const paypal = require('paypal-rest-sdk')
const PORT = process.env.PORT || 5000;
require('dotenv').config();
require('./src/routeHandler')(app)

// configure paypal with the credentials you got when you created your paypal app
const paypalMode = process.env.NODE_ENV === 'development' ? 'sandbox' : 'sandbox'
const paypalClientID = process.env.REACT_APP_PAYPAL_SANDBOX_CLIENT_ID
const paypalClientSecret = process.env.REACT_APP_PAYPAL_SANDBOX_CLIENT_SECRET

paypal.configure({
	'mode': paypalMode, //sandbox or live 
	'client_id': paypalClientID, // please provide your client id here 
	'client_secret': paypalClientSecret // provide your client secret here 
});

// Set the Access Token which is used to authorize to a merchant
const accessToken = process.env.NODE_ENV === 'production' ? process.env.SQUARE_PRODUCTION_ACCESS_TOKEN : process.env.SQUARE_SANDBOX_ACCESS_TOKEN;
const environment = process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox
// Initialized the Square api client:
//   Set sandbox environment for testing purpose
//   Set access token
const client = new Client({
	environment: environment,
	accessToken: accessToken,
});

// app.use(function (req, res, next) {
// 	if (req.header('x-forwarded-proto') === 'http' && process.env.NODE_ENV === 'production') {
// 	  res.redirect(301, 'https://' + req.hostname + req.url);
// 	  return
// 	}
// 	next()
//   });

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/files', express.static("files"));

// configure body parser for AJAX requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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


let localDB = "mongodb://127.0.0.1/cart"
const promise = mongoose.connect(process.env.NODE_ENV === 'development' ? localDB : process.env.MONGO_URI, { useNewUrlParser: true }, { useUnifiedTopology: true });

var gfs;
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
  	// console.log("Connected to MongoDB!")
	var mongoDriver = mongoose.mongo;
	gfs = Grid(connection.db, mongoDriver);
	gfs.collection('uploads');
});

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
// const upload = multer({ storage });
const upload = multer({ storage : storage }).array('file', 3);

app.post("/upload/:productId", function (req, res, next) {
	try {
		upload(req,res,function(err) {
			//console.log(req.body);
			//console.log(req.files);
			if (err) {
				// console.log(`upload multiple error: ${err}`);
				return res.sendStatus(500);
			} else {
				// console.log('UPLOAD FILE(s): ', req.files)
				for (let u=0; u<req.files.length; u++) {
					gfs.files.update({'filename': req.files[u].filename}, 
						{'$set': 
							{
							'productId': req.params.productId
							},
						})
				}
				
			}
			res.end("Files are uploaded");
		});
		// upload.single('file')(req, res, function (error) {
		// 	if (error) {
		// 	  console.log(`upload.single error: ${error}`);
		// 	  return res.sendStatus(500);
		// 	} else {
		// 	  console.log('UPLOAD FILE: ', req.file)
		// 	  gfs.files.update({'filename': req.file.filename}, 
		// 		  {'$set': 
		// 			  {
		// 			  'productId': req.params.productId
		// 			  },
		// 		  })
		// 	}
		// 	// code
		//   })
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
		// console.log('NO IMAGES FOUND')
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


// HANDLE PAYPAL PAYMENTS
app.post('/process-paypal' , ( req , res ) => {
	// create payment object 
	// console.log('req.body: ', req.body)
    const createPayment = {
            "intent": "sale",
			"payer": {
				"payment_method": "paypal"
			},
			"redirect_urls": {
				"return_url": "http://127.0.0.1:3000/success",
				"cancel_url": "http://127.0.0.1:3000/err"
			},
			"transactions": [{
				"amount": {
					"total": 39.00,
					"currency": "USD"
				},
				"description": " a book on mean stack "
			}]
    }
	// call the create Pay method 

	paypal.payment.create(createPayment, function (err, payment) {
        if(err) {
            console.log(err.message);
        } else {
            for(let i = 0; i < payment.links.length; i++){
                if(payment.links[i].rel === 'approval_url'){
                    // res.redirect(payment.links[i].href);
					// console.log('link: ', payment.links[i].href)
					res.send({forwardLink: payment.links[i].href})
                }
            }
        }
    });

    // createPay( payment ) 
    //     .then( ( transaction ) => {
    //         var id = transaction.id; 
    //         var links = transaction.links;
    //         var counter = links.length; 
    //         while( counter -- ) {
    //             if ( links[counter].method == 'REDIRECT') {
	// 				// redirect to paypal where user approves the transaction 
	// 				// return res.redirect( links[counter].href )
	// 				res.json({forwardLink: links[counter].href})
    //             }
    //         }
    //     })
    //     .catch( ( err ) => { 
    //         console.log( err ); 
    //         // res.redirect('/err');
    //     });
}); 

// HANDLE SQUARE PAYMENTS

app.post("/process-payment", async (req, res) => {
	let body = req.body;
	let { paymentsApi } = client
	// body.idempotencyKey = uuidv4();
	// body.amountMoney = {
	// 	amount: 1,
	// 	currency: 'GBP',
	// };
	// let paymentResponse = paymentsApi.createPayment(body);
	// paymentResponse.then((response) => {
	// 	console.log('SQUARE RESPONSE: ', response)
	// 	reply.send(response.json)
	// })

	try {
		const response = await paymentsApi.createPayment(body);
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

// HANDLE ADDRESS VERIFICATION

app.post('/addressverf/:address1/:address2/:addressCity/:addressState/:addressZipCode', async(req, res) => {
	function handleSuccess(response) {
		// console.log(response)
		res.send(response)
	}
	
	function handleError(response) {
		// console.log(response);
		return res.sendStatus(500);
	}
	let authId = process.env.SMARTY_AUTH_ID;
	let authToken = process.env.SMARTY_AUTH_TOKEN;
	const credentials = new SmartyStreetsCore.StaticCredentials(authId, authToken);

	// for client-side requests (browser/mobile), use this code:
	// let key = process.env.SMARTY_WEBSITE_KEY;
	// const credentials = new SmartyStreetsCore.SharedCredentials(key);
	let client = SmartyStreetsCore.buildClient.usStreet(credentials);
	// .withLicenses(["us-rooftop-geo-cloud"]);

	let lookup1 = new Lookup();
	lookup1.street = req.params.address1;
	if (req.params.address2 !== '' && req.params.address2 !== 'empty') {
		lookup1.secondary = req.params.address2
	}
	lookup1.city = req.params.addressCity;
	lookup1.state = req.params.addressState;
	lookup1.zipCode = req.params.addressZipCode;
	lookup1.maxCandidates = 3;
	lookup1.match = "invalid"; // "invalid" is the most permissive match,
							// this will always return at least one result even if the address is invalid.
							// Refer to the documentation for additional MatchStrategy options.

	client.send(lookup1)
		.then(handleSuccess)
		.catch(handleError);

})


app.get("/", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) });

app.get("/products", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) });

app.get("/ourstory", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) });

app.get("/howtobuy", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) });

app.get("/contactus", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) });

app.get("/shoppingcart", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) });

app.get("/checkout", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) });

app.get("/login", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) });

app.get("/admin", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) })

app.get("/inventory", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) })

app.get("/purchases", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) })

app.get("/tools", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) });

app.get("/signout", (req, res, next) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) });

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
		// console.log(`Express server now listening on port ${PORT}`);
	});
}

// helper functions 

// var createPay = ( payment ) => {
//     return new Promise( ( resolve , reject ) => {
//         paypal.payment.create( payment , function( err , payment ) {
//         if ( err ) {
//             reject(err); 
//         }
//         else {
//             resolve(payment); 
//         }
//         }); 
//     });
// }