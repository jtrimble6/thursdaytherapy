const router = require("express").Router();
const productController = require("../../../controllers/productController");
const passport = require("../../../server/passport");
const express = require("express");

router.route("/")
  .post(productController.create)
  .get(productController.findAll)

// router.route("/login")
//   .post(productController.findByUsernamePassword)

// router.get('/', (req, res, next) => {
// //   console.log('===== product!!======')
// //   console.log(req.product)
// //   if (req.product) {
// //       res.json({ product: req.product })
// //   } else {
// //       res.json({ product: null })
// //   }
// })

router.route('/:id')
  .get(productController.findById)
  .delete(productController.remove)
  .put(productController.findOneAndUpdate)
//   .post(productController.create)

// router.route('/:id/picks/:status')
//   .put(productController.updatePick)
  
// router.route('/:id/:date')
//   .delete(productController.findOneAndDelete)
  // .put(productController.updatePick)
  // .get(productController.findByDate)



module.exports = router;