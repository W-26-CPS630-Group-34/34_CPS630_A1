const express   = require('express');
const cors      = require('cors');
const app       = express();
const path      = require('path');
const { default: mongoose } = require('mongoose');
const Level = require('./models/Level');

const PORT          = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

//Enable CORS for frontend requests
app.use(cors());

//database connect
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/book_library`;
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on('error', function(e) {
    comnsole.log('error connecting:' + e);
});
db.on('open', function() {
    console.log('database connected!');
});

