const router = require("express").Router();
const productRoutes = require("./product");

router.use("/api/products", productRoutes);
router.use("/api/products/details", productRoutes)
router.use("/product", productRoutes)

module.exports = router;