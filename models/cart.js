const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Cart = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: false
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
            productCode: {
                type: String
            },
            quantity: {
                type: Number,
                default: 0,
            },
            price: {
                type: Number,
                default: 0,
            },
            title: {
                type: String,
            },
            totalCost: {
                type: Number
            }
        },
    ],
    totalQuantity: {
        type: Number,
        default: 0
    },
    totalCost: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('carts', Cart);
