// const productRoutes = require("./app/Product/routes");
const cartRoutes = require('./app/Cart/routes')
module.exports = app => {
    // app.use("/product", productRoutes);
    app.use("/cart", cartRoutes);
}