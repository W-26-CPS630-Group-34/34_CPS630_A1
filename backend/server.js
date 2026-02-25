const express   = require('express');
const cors      = require('cors');
const app       = express();
const path      = require('path');
const { default: mongoose } = require('mongoose');
const Level = require('./models/Level');

const PORT          = 5000;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

//Enable CORS for frontend requests
app.use(cors());

//database connect
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/level_library`;
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on('error', function(e) {
    comnsole.log('error connecting:' + e);
});
db.on('open', function() {
    console.log('database connected!');
});

// put list of JSONs here
crops = [
    {id:1, src:"/assets/cake.jpg", answer:"cake", zoom:6, offsetX:-19, offsetY:-17},
    {id:2, src:"/assets/tiger.jpg", answer:"tiger", zoom:5, offsetX:0, offsetY:0},
    {id:3, src:"/assets/cookie.jpg", answer:"cookie", zoom:5, offsetX:0, offsetY:0},
    {id:4, src:"/assets/cupcake.jpg", answer:"cupcake", zoom:4, offsetX:0, offsetY:18},
    {id:5, src:"/assets/elephant.jpg", answer:"elephant", zoom:6, offsetX:20, offsetY:15},
    {id:6, src:"/assets/keyboard.jpg", answer:"keyboard", zoom:6, offsetX:-37, offsetY:-15},
    {id:7, src:"/assets/waterfall.jpg", answer:"waterfall", zoom:4, offsetX:10, offsetY:5},
    {id:8, src:"/assets/pizza.jpg", answer:"pizza", zoom:6, offsetX:-8, offsetY:-10},
    {id:9, src:"/assets/puppy.jpg", answer:"puppy", zoom:5, offsetX:0, offsetY:-10},
    {id:10, src:"/assets/cat.jpg", answer:"cat", zoom:5, offsetX:0, offsetY:0},
    {id:11, src:"/assets/strawberry.jpg", answer:"strawberry", zoom:5, offsetX:0, offsetY:0},
    {id:12, src:"/assets/zebra.jpg", answer:"zebra", zoom:4, offsetX:-10, offsetY:10},
]

async function addLevelsToMongoDB() {
    const levelCount = await Level.countDocuments();

    if (levelCount === 0) {
        console.log('Adding test books to db ...');

        crops.forEach(level => {
            const newLevel = new Level(level);
            newLevel.save()
                .then(() => console.log('Level added with image of a(n): ' + level.answer))
                .catch(err => console.error('Error adding level with image of a(n): ' + level.answer + ' ' + err));
        });
    }
    else {
        console.log('Levels already exist. Not adding test books.');
        return;
    }
}
addLevelsToMongoDB();

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
/* old way 
app.get('/api/crop', (req, res) => {
    res.json(crops);
});
*/
app.get('/api/crop', async (req, res) => {
    try {
        const levels = await Level.find({}).lean(); 
        res.status(200).json(levels); 
    } catch (err) { 
        console.error("Mongo GET /api/levels error: ", err)
        res.status(500).json({error: "Database ", details: err.message});
    }
});

//get a level
/* old way 
app.get('/api/crop/id/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const crop = crops.find(c => c.id == id);

    if (crop) {
        res.status(200).json(crop); //status code 200 = OK
    } else {
        res.status(404).json({ error: "Level not found" });  //status 404 code = NOT FOUND
    }
});
*/
app.get('/api/crop/id/:id', async (req, res) => {
    try {
        const id = req.params.id; 
        const level = await Level.findOne({id: id}).lean();
        if (level) { 
            res.status(200).json(level);
        }
        else {
            res.status(404).json({error: "Level not found"}); 
        }

    } catch (err) {
        console.error("GET by ID error:", err); 
        res.status(500).json({ error: "Database error:" }); 
    };
}); 


//create new level
/* old way
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
*/
app.post('/api/crop', async (req, res) => {
  try {
    const newCrop = req.body;

    const required = ["id", "src", "answer", "zoom"];
    const missing = required.filter(k => newCrop?.[k] === undefined || newCrop?.[k] === null || newCrop?.[k] === "");
    if (missing.length) {
      return res.status(400).json({ error: "Invalid level data", missing });
    }

    const id = Number(newCrop.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id (must be a number)" });
    }

    const dup = await Level.findOne({ $or: [{ id }, { src: newCrop.src }] }).lean();
    if (dup) {
      return res.status(409).json({ error: "Duplicate level (id or src already exists)" });
    }

    const docToCreate = {
      id,
      src: newCrop.src,
      answer: newCrop.answer,
      zoom: newCrop.zoom,
      x: newCrop.x ?? 0,
      y: newCrop.y ?? 0,
    };

    const created = await Level.create(docToCreate);
    return res.status(201).json(created.toObject());
  } catch (err) {
    console.error("Mongo POST /api/crop error:", err);
    return res.status(500).json({ error: "Database error", details: err.message });
  }
});

//delete a level
/* old way 
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
*/
app.delete('/api/crop/id/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id param (must be a number)" });
    }

    const deleted = await Level.findOneAndDelete({ id }).lean();
    if (!deleted) return res.status(404).json({ error: "Level not found" });

    // Common pattern: 200 with deleted doc, or 204 with no body.
    return res.status(200).json(deleted);
  } catch (err) {
    console.error("Mongo DELETE /api/crop/id/:id error:", err);
    return res.status(500).json({ error: "Database error", details: err.message });
  }
});

//starts server
app.listen(PORT, () => { console.log("Server started on port: " + PORT) });