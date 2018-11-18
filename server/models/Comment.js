
let mongoose = require('mongoose');
let commentSchema = require('../schemas/comments');

module.exports = mongoose.model('Comment',commentSchema);