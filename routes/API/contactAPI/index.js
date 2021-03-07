var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
// import NavbarHeaderImage from './emailImage.png'

require('dotenv').config();

var transport = {
  host: 'smtp.gmail.com',
  auth: {
    port: 465,
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  // var html = `Embedded image: <img src=${NavbarHeaderImage}/>`

  var mail = {
    from: name,
    // to: 'kgouveia@gfitwefit.com',  //Change to email address that you want to receive messages on
    // to: process.env.NODE_ENV === 'DEVELOPMENT' ? "trimbledevelops@gmail.com" : "hkopciak@gmail.com",
    to: 'hkopciak@gmail.com',
    subject: 'New Message from Contact Form',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail',
        err: err,
        data: data
      })
    } else {
      res.json({
        msg: 'success'
      })
    }
  })
})

router.post('/neworder', (req, res, next) => {
  var firstName = req.body.firstName
  var lastName = req.body.lastName
  var email = req.body.email
  var phoneNumber = req.body.phoneNumber
  var details = req.body.details
  var content = `Congratulations! A new order has just been submitted!\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nOrder Details: ${details}`
  

  var mail = {
    from: firstName + ' ' + lastName,
    // to: 'kgouveia@gfitwefit.com',  //Change to email address that you want to receive messages on
    // to: process.env.NODE_ENV === 'DEVELOPMENT' ? "trimbledevelops@gmail.com" : "hkopciak@gmail.com",
    to: 'hkopciak@gmail.com',
    subject: 'New Order Submitted!',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail',
        err: err,
        data: data
      })
    } else {
      res.json({
        msg: 'success'
      })
    }
  })
})

router.post('/orderconfirmation', (req, res, next) => {
  var firstName = req.body.firstName
  var lastName = req.body.lastName
  var email = req.body.email
  var confirmationNumber = req.body.confirmationNumber
  var confirmationUrl = req.body.confirmationUrl
  var content = `Thank you ${firstName} ${lastName} for your order! Your order has been received!\nConfirmation #: ${confirmationNumber}\nView your receipt here: ${confirmationUrl}`

  var mail = {
    from: 'noreply.thursdaytherapy.com',
    // to: 'kgouveia@gfitwefit.com',  //Change to email address that you want to receive messages on
    // to: process.env.NODE_ENV === 'DEVELOPMENT' ? "trimbledevelops@gmail.com" : "hkopciak@gmail.com",
    to: email,
    subject: 'Order Confirmation!',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail',
        err: err,
        data: data
      })
    } else {
      res.json({
        msg: 'success'
      })
    }
  })
})

module.exports = router;