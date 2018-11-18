let mongoose = require('mongoose');
let chatcontentSchema = require('../schemas/chatcontent');

module.exports = mongoose.model('ChatContent',chatcontentSchema);