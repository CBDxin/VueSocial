
let mongoose = require('mongoose');
let passwordSchema = require('../schemas/password');

module.exports = mongoose.model('Password',passwordSchema);