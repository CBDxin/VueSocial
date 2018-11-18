let express = require('express');

let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    chatWith:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    addTime:{
        type:Date,
        default:Date.now
    },
    content:{
        type:String
    },
    unread:{
        type:Boolean,
        default:true
    }
});