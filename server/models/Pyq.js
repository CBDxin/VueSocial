
let mongoose = require('mongoose');
let pyqSchema = require('../schemas/pyq');

module.exports = mongoose.model('Pyq',pyqSchema);