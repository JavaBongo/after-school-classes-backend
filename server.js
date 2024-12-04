// Import dependencies
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

// Create Express instance
const app = express();
app.use(express.json()); // Middleware to parse JSON

// Logger Middleware
function logger(req, res, next) {
    const method = req.method;
    const url = req.url;
    const timestamp = new Date().toISOString();

    // Log request details
    console.log(`[${timestamp}] ${method} request to ${url}`);

    // Capture and log response status when the response is finished
    res.on('finish', () => {
        console.log(`[${timestamp}] Response status: ${res.statusCode}`);
    });

    // Call next middleware
    next();
}

// Use the logger middleware
app.use(logger);

// MongoDB connection string and database setup
let db;
let MongoURI = 'mongodb+srv://blockstree:Rars1234@cst3144.zixj3.mongodb.net/'

MongoClient.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (e, client) => {
    if (e) {
        console.error('Failed to connect to MongoDB', e);
        process.exit(1); // Exit if the connection fails
    }
    db = client.db('webstore'); // Database name
    console.log('Connected to MongoDB');
});

// Basic route
app.get('/', (req, res) => {
    res.send('API is running! Try /collection/lessons');
});

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    console.log('collection name:', req.collection)
    return next()
})

// Get all lessons from the "lessons" collection
app.get('/collection/:collectionName', (req, res) => {
    req.collection.find({}).toArray((e, results) => {
		if (e) return next(e);
		res.send(results);
	});
});

// Post new order data into "orders" collection
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})


// return with object id 
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next(e)
        res.send(result)
    })
})
    
// Put update into specified lesson in "lessons" collection 
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
    {_id: new ObjectID(req.params.id)},
    {$set: req.body},
    {safe: true, multi: false},
    (e, result) => {
    if (e) return next(e)
    res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
})

// Start server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
