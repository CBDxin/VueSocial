let mongoose = require('mongoose');
let idtoidSchema = require('../schemas/idtoid');

module.exports = mongoose.model('Idtoid',idtoidSchema);