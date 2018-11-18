let express = require('express');

let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username:String,
    password:String,
});