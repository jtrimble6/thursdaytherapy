const router = require("express").Router();
const userRoutes = require("./user");

router.use("/api/users", userRoutes);
router.use("/api/users/info", userRoutes)
router.use("/api/users/preferences", userRoutes)
router.use("/api/users/updatePassword", userRoutes);
router.use("/api/users/login", userRoutes)
router.use("/user", userRoutes)

module.exports = router;