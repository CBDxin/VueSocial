let express = require('express');

let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    userA:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    userB:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    chatContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ChatContent'
    }],

});