
let mongoose = require('mongoose');
let usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);