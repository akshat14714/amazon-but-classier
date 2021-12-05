const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Product = Schema({
    title: {
        type: String,
        required: true
    },
    productCode: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    imagePath: {
        type: String
    },
    category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "categories",
	},
    gender: {
        type: String,
        required: true
    },
    brand: {
        type: String
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
	available: {
		type: Boolean,
		required: true,
	},
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('products', Product);
