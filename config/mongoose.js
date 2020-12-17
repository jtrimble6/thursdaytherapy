const mongoose = require("mongoose");
require('dotenv').config();
const connection = process.env.MONGO_URI;

module.exports = app => {
    mongoose.connect(process.env.NODE_ENV === "development" ? 'mongodb://localhost:27017/cart' : connection, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(res => console.log("connected")).catch(err => console.log(err))
    mongoose.Promise = global.Promise;
    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
    process.on("SIGHUP", cleanup);
    if (app) {
        app.set("mongoose", mongoose);
    }
};
function cleanup() {
    mongoose.connection.close(function () {
        process.exit(0);
    });
}