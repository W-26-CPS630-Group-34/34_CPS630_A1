const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
    id: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true
    },
    src: {
        type: String,
        unique:     false,
        required:   true
    },
    answer: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true
    },
    zoom: {
        type:       Number,
        unique:     false,
        required:   true,
        trim:       true
    },
    offsetX: {
        type:       Number,
        unique:     false,
        required:   true
    },
    offsetY: {
        type:       Number,
        unique:     false,
        required:   true,    }
});

const Level = mongoose.model('level', LevelSchema);
module.exports = Level;