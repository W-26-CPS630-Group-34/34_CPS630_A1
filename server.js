const express   = require('express');
const app       = express();
const path      = require('path');

const PORT      = 8080;     // default web: 80. default relational db: 443

// put list of JSONs here
crops = [
    {id:1, src:"/assets/cake.jpg", answer:"cake", zoom:1, x:0, y:0},
    {id:2, src:"/assets/tiger.jpg", answer:"tiger", zoom:1, x:0, y:0},
    {id:3, src:"/assets/cookie.jpg", answer:"cookie", zoom:1, x:0, y:0},
    {id:4, src:"/assets/cupcake.jpg", answer:"cupcake", zoom:1, x:0, y:0},
    {id:5, src:"/assets/elephant.jpg", answer:"elephant", zoom:1, x:0, y:0},
    {id:6, src:"/assets/keyboard.jpg", answer:"keyboard", zoom:1, x:0, y:0},
    {id:7, src:"/assets/waterfall.jpg", answer:"waterfall", zoom:1, x:0, y:0},
    {id:8, src:"/assets/pizza.jpg", answer:"pizza", zoom:1, x:0, y:0},
    {id:9, src:"/assets/popcorn.jpg", answer:"popcorn", zoom:1, x:0, y:0},
    {id:10, src:"/assets/pyramids.jpg", answer:"pyramids", zoom:1, x:0, y:0},
    {id:11, src:"/assets/strawberry.jpg", answer:"strawberry", zoom:1, x:0, y:0},
    {id:12, src:"/assets/zebra.jpg", answer:"zebra", zoom:1, x:0, y:0},
]

//static files path
//we want to serve static files from the public folder as we don't want clients to have access to server files
app.use('/', express.static(path.join(__dirname, 'public')));


// route to main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/views/index.html'));
});

// route to play game
app.get('/play', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/views/game.html'));
});

// route to add/drop levels
app.get('/crop', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/views/crop.html'));
});

// may include more to fulfil rubric (about, contact, etc.)

/*************************************************/
/********* Defining (CRUD) API routes ************/
/*************************************************/

//get all game levels
app.get('/api/crop', (req, res) => {
    res.json(crops);
});

//get a level
app.get('/api/crop/id/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const crop = crops.find(c => c.id === id);

    if (crop) {
        res.status(200).json(crop); //status code 200 = OK
    } else {
        res.status(404).json({ error: "Level not found" });  //status 404 code = NOT FOUND
    }

});

//create new level
app.post('/api/crop', express.json(), (req, res) => {
    const newCrop = req.body;

    if (newCrop && newCrop.id && newCrop.src && newCrop.answer && newCrop.zoom) {
        // issue solved: built in duplicate check
        const i = crops.findIndex(c => c.id === newCrop.id);
        const j = crops.findIndex(c => c.src === newCrop.src);
        if (i == -1 && j == -1) {
            if (!newCrop.x) newCrop.x = 0;
            if (!newCrop.y) newCrop.y = 0;

            crops.push(newCrop);
            res.status(201).json(newCrop);
        }
    } else {
        res.status(400).json({ error: "Invalid level data" });
    }
});

//delete a level
app.delete('/api/crop/id/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = crops.findIndex(c => c.id === id);

    if (index !== -1) {
        const deleted = crops.splice(index, 1);
        res.status(204).json(deleted[0]);       //status code 204 = No Content (sometimes we can just send 200- OK also)
    } else {
        res.status(404).json({ error: "Level not found" });  //status 404 code = NOT FOUND
    }
});

//starts server
app.listen(PORT, () => { console.log("Server started on port: " + PORT) });