const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

var User = Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
}

function validatePassword(enteredPassword) {
    if(this.password == null) {
        return false;
    }
    return bcrypt.compareSync(enteredPassword, this.password);
}

User.methods = {
    hashPassword,
    validatePassword
};

module.exports = mongoose.model('users', User);
