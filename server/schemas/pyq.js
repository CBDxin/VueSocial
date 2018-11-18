let express = require('express');

let mongoose = require('mongoose');

module.exports = new mongoose.Schema({

    addTime:{
      type:Date,
      default:Date.now
    },
    views:{
        type:Number,
        default:0
    },
    content:String,
    writer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    pimg:{
        type:Array,
        default:[]
    }

});