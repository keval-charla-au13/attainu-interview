const mongoose = require("mongoose");


const score = new mongoose.Schema({
    score: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }

});

module.exports = mongoose.model('score', score)