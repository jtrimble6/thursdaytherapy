const router = require("express").Router();
const purchaseController = require("../../../controllers/purchaseController");
const passport = require("../../../server/passport");
const express = require("express");

router.route("/")
  .post(purchaseController.create)
  .get(purchaseController.findAll)

// router.route("/login")
//   .post(purchaseController.findByUsernamePassword)

router.get('/', (req, res, next) => {
  console.log('===== purchase!!======')
  console.log(req.purchase)
  if (req.purchase) {
      res.json({ purchase: req.purchase })
  } else {
      res.json({ purchase: null })
  }
})

router.route('/:id')
  .get(purchaseController.findById)
  .put(purchaseController.updateOrderInfo)
  // .post(purchaseController.addWin)

// router.route('/:id/picks/:status')
//   .put(purchaseController.updatePick)
  
// router.route('/:id/:date')
//   .delete(purchaseController.findOneAndDelete)
  // .put(purchaseController.updatePick)
  // .get(purchaseController.findByDate)



module.exports = router;