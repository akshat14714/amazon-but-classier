const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Order = Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "users"
	},
	cart: {
		totalQuantity: {
			type: Number,
			default: 0,
			required: true,
		},
		totalCost: {
			type: Number,
			default: 0,
			required: true,
		},
		items: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "products",
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
	},
	address: {
		type: String,
		required: true,
	},
	// paymentId: {
	// 	type: String,
	// 	required: true,
	// },
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	delivered: {
		type: Boolean,
		default: false,
	}
});

module.exports = mongoose.model('orders', Order);
