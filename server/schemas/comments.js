let express = require('express');

let mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    addTime:{
        type:Date,
        default:Date.now
    },
    content:{
        type:String
    },
    writer:{
        type:String
    },
    from:{
        type:String
    },
    to:{
        type:String
    },
    pyq:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Pyq'
    },
    reply:{
        type:Array,
        default:[]
    },
    isn:{
        type:Boolean,
        default:true,
    },
    toisn:{
        type:Boolean,
        default:true,
    }
});