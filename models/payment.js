const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Payment = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    amount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('payments', Payment);
