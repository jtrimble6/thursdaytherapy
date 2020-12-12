// const productRepository = require('./repository')
// exports.createProduct = async (req, res) => {
//     try {
//         console.log('REQ FILE HERE!!!! ', req.file)
//         console.log('REQ BODY HERE!!!! ', req.body)
//         let payload = {
//             name: req.body.name,
//             price: req.body.price,
//             ingredients: req.body.ingredients,
//             image: req.body.image
//         }
//         let product = await productRepository.createProduct({
//             ...payload
//         });
//         res.status(200).json({
//             status: true,
//             data: product,
//         })
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             error: err,
//             status: false,
//         })
//     }
// }
// exports.getProducts = async (req, res) => {
//     console.log('GETTING PRODUCTS')
//     try {
//         let products = await productRepository.products();
//         res.status(200).json({
//             status: true,
//             data: products,
//         })
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             error: err,
//             status: false,
//         })
//     }
// }

// exports.getProductById = async (req, res) => {
//     try {
//         let id = req.params.id
//         let productDetails = await productRepository.productById(id);
//         res.status(200).json({
//             status: true,
//             data: productDetails,
//         })
//     } catch (err) {
//         res.status(500).json({
//             status: false,
//             error: err
//         })
//     }
// }
// exports.removeProduct = async (req, res) => {
//     try {
//         let id = req.params.id
//         let productDetails = await productRepository.removeProduct(id)
//         res.status(200).json({
//             status: true,
//             data: productDetails,
//         })
//     } catch (err) {
//         res.status(500).json({
//             status: false,
//             error: err
//         })
//     }
// }


const db = require('../models')
// const async = require('async')
const bcrypt = require('bcryptjs')
//const Product = require('../models/user')
//const passport = require('../server/passport')

module.exports = {
    findAll: function(req, res) {
        db.Product
          .find({})
          .then(dbModel => res.json(dbModel))
    },
    findById: function(req, res) {
        console.log('find by id')
        console.log(req.params)
        db.Product
          .find({username: req.params.id})
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err))
    },
    findOneAndUpdate: function (req, res) {
        db.Product
          .updateOne({_id: req.params.id}, 
            { $set: { 
                name: req.body.name,
                price: req.body.price,
                ingredients: req.body.ingredients,
                image: req.body.image
            }
            })
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err))
    },
    create: function(req, res) {
        db.Product
          .create(req.body)
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err))
    },
    remove: function(req, res) {
        db.Product
          .findById({ _id: req.params.id})
          .then(dbModel => dbModel.remove())
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
    }
}
