const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const purchaseSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: true },
    purchaseId: { type: String, required: true },
    purchaseOrderId: { type: String, required: true },
    confirmationNumber: { type: String, required: true },
    purchaseDate: { type: Date, required: true, default: Date.now},
    purchaseDetails: { type: Array, required: true },
    purchaseAmount: { type: String, required: true },
    purchaseCard: { type: Number, required: true },
    purchaseReceiptUrl: { type: String, required: true }
})

const Purchase = mongoose.model('Purchase', purchaseSchema)

module.exports = Purchase;