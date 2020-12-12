const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please include the product name"],
    },
    price: {
        type: String,
        required: [true, "Please include the product price"],
    },
    ingredients: {
        type: String,
        required: [true, "Please include the product ingredients"],
    },
    image: {
        type: String,
        required: true,
    },
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product;