const db = require('../models')
// const async = require('async')
const bcrypt = require('bcryptjs')
//const Purchase = require('../models/user')
//const passport = require('../server/passport')

module.exports = {
    findAll: function(req, res) {
        db.Purchase
          .find({})
          .then(dbModel => res.json(dbModel))
    },
    findById: function(req, res) {
        console.log('find by id')
        console.log(req.params)
        db.Purchase
          .find({username: req.params.id})
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err))
    },
    findOneAndUpdate: function (req, res) {
        db.Purchase
          .update({username: req.params.id}, 
            { $push: { picks: req.body }})
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err))
    },
    updateOrderInfo: function(req, res) {
      db.Purchase
        .updateOne(
          { _id: req.params.id },
          { $set: { 
            'firstName': req.body.firstName, 
            'lastName': req.body.lastName, 
            'email': req.body.email, 
            'phoneNumber': req.body.phoneNumber 
          }},
         )
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err))
    },
    updatePurchasePreferences: function(req, res) {
      db.Purchase
        .updateOne(
          { username: req.params.id },
          { $set: { 
            'videoFilterPreferences': req.body
          }},
         )
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err))
    },
    userCancelSubscription: function(req, res) {
      let paymentComplete = req.body.paymentComplete
      let paymentRefNumber = req.body.paymentRefNumber
      let paymentTxnId = req.body.paymentTxnId
      let paymentDate = req.body.paymentDate
      let paymentCard = req.body.paymentCard
        db.Purchase
          .updateOne(
            { username: req.params.id },
            { $set: { 
              'paymentComplete': paymentComplete,
              'paymentRefNumber': paymentRefNumber,
              'paymentTxnId': paymentTxnId,
              'paymentDate': paymentDate,
              'paymentCard': paymentCard
            }},
         )
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err))
    },
    userUpdateSubscription: function(req, res) {
      let paymentComplete = req.body.paymentComplete
      let paymentRefNumber = req.body.paymentRefNumber
      let paymentTxnId = req.body.paymentTxnId
      let paymentDate = req.body.paymentDate
      let paymentCard = req.body.paymentCard
        db.Purchase
          .updateOne(
            { username: req.params.id },
            { $set: { 
              'paymentComplete': paymentComplete,
              'paymentRefNumber': paymentRefNumber,
              'paymentTxnId': paymentTxnId,
              'paymentDate': paymentDate,
              'paymentCard': paymentCard
            }},
         )
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err))
    },
    updatePurchasePassword: function(req, res) {
      let password = req.body.newPassword
        db.Purchase
          .updateOne(
            { username: req.params.id },
            { $set: { 
              'password': password
            }},
         )
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err))
    },
    // findByDate: function(req, res) {
    //   db.Game
    //     .find(
    //         { username: req.params.id, gameDate: req.params.date }
    //       )
    //     .then(dbModel => res.json(dbModel))
    //     .catch(err => res.status(422).json(err))
    // },
    create: function(req, res) {
        db.Purchase
          .create(req.body)
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err))
    },
    remove: function(req, res) {
        db.Purchase
          .findById({ _id: req.params.id})
          .then(dbModel => dbModel.remove())
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
    }
}
