var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
// var NavbarHeaderImage = require('./emailImage')

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
    console.log('Current ENV', process.env.NODE_ENV)
  }
});

router.post('/send', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  let toEmail = process.env.NODE_ENV === 'development' ? 'trimbledevelops@gmail.com' : 'herve@czjsresources.com'
  var mail = {
    from: name,
    to: toEmail,
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
  var toEmail = process.env.NODE_ENV === 'development' ? 'trimbledevelops@gmail.com' : 'herve@czjsresources.com'

  var mail = {
    from: firstName + ' ' + lastName,
    to: toEmail,
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
  // var email = 'trimbledevelops@gmail.com'
  var customerEmail = req.body.email
  var orderDetails = req.body.orderDetails
  var html = 
      `<p>Dear ${firstName},</p>\n
      <p>Purchase Confirmation</p>\n 
      <hr />
      <p>${orderDetails}</p>
      <hr />
      <p>Your full billing details will be forwarded to you as soon as your order has been packaged and shipping cost has been finalized...</p>\n
      <p>If you have any questions, just respond to sales@thursday-therapy.com. We're happy to help.</p>\n
      <p>Thanks for trusting us with your soap purchase! We look forward to having you as a customer for many years to come.\n
      <p>All the best,</p>
      <p>Thursday Therapy</p>\n
      <p>sales@thursday-therapy.com | www.thursday-therapy.com</p>`

  var mail = {
    from: 'noreply.thursdaytherapy@gmail.com',
    to: customerEmail,
    subject: 'Order Confirmation!',
    html: html
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