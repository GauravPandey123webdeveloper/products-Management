const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const orderSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "UserCollection",
    required: [true, "Please Enter the userId"]
  },
  items: [{
    productId: {
      type: ObjectId,
      ref: "ProductCollection",
      required: [true, "Please Enter the productId"]
    },
    quantity: {
      type: Number,
      required: [true, "Please add at least one item"],
      min: 1
    }
  }],
  totalPrice: {
    type: Number,
    required: [true, "please enter the price "],
    comment: "Holds total price of all the items in the cart"
  },
  totalItems: {
    type: Number,
    required: [true, "total items missing "],
    comment: "Holds total number of items in the cart"
  },
  totalQuantity: {
    type: Number,
    required: [true, "total quantity is missing"],
    comment: "Holds total number of quantity in the cart"
  },
  cancellable: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'completed', 'cancelled']
  },
  deletedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })
module.exports = mongoose.model('OrderCollection', orderSchema)