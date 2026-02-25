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
    /* IF WE WANT THE SRC TO BE AN IMAGE ITSELF, SO THE IMAGE IS STORED IN MONGODB, THEN WE DO TYPE BUFFER
    src: {
    data: { type: Buffer, required: true },        // the actual image bytes
    contentType: { type: String, required: true }  // e.g. "image/png", "image/jpeg"
    },
    */
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