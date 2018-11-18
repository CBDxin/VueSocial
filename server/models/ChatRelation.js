let mongoose = require('mongoose');
let chatrelationSchema = require('../schemas/chatrelation');

module.exports = mongoose.model('ChatRelation',chatrelationSchema);