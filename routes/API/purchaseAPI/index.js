const router = require("express").Router();
const purchaseRoutes = require("./purchase");

router.use("/api/purchases", purchaseRoutes);
router.use("/api/purchases/info", purchaseRoutes)
router.use("/purchase", purchaseRoutes)

module.exports = router;