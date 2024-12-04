// Import dependencies
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var path = require("path");
const { title } = require('process');

function config(request, response, next) {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Credentials", "true");
	response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	response.setHeader(
		"Access-Control-Allow-Headers",
		"Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
	);

	next();
}

// Create Express instance
app.use(express.json()); // Middleware to parse JSON
app.use(config);

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

// Image Assets folder path
var imagePath = path.resolve(__dirname, "assets");

function staticImage(request, response) {
    response.status(404).send('Image not found');
}

function root(request, response) {
    response.send('API is running! Select a collection, e.g., Try /collection/lessons');
}

function logger(request, response, next) {
    const method = request.method;
    const url = request.url;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${method} request to ${url}`); // Log request details

    // Capture and log response status when the response is finished
    response.on('finish', () => {
        console.log(`[${timestamp}] Response status: ${response.statusCode}`);
    });

    next();
}

function setCollectionName(request, response, next, collectionName) {
    request.collection = db.collection(collectionName) // Sets the requested collection name
    console.log('collection name:', request.collection)
    return next()
}

function retrieveObjects(request, response, next) {
    request.collection.find({}).toArray((e, results) => {
		if (e) return next(e);
		response.send(results);
	});
}

function getOneObject(request, response, next) {
    request.collection.findOne({ _id: new ObjectID(request.params.id) }, (e, result) => {
        if (e) return next(e)
        response.send(result)
    })
}

function addObject(request, response, next) {
    request.collection.insert(request.body, (e, results) => {
        if (e) return next(e)
        response.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
}

function updateObject(request, response, next) {
    request.collection.update(
        {_id: new ObjectID(request.params.id)},
        {$set: request.body},
        {safe: true, multi: false},
        (e, result) => {
            if (e) return next(e)
            response.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
}

function searchObjects(request, response, next) {
    const searchTerm = request.query.q || ""; // Get the search term
    const searchRegex = new RegExp(searchTerm, "i"); // Case-insensitive regex for substring matching

    const query = {
        $or: [
            { title: searchRegex },
            { location: searchRegex },
        ]
    }
    request.collection.find(query).toArray((err, results) => {
        if (err) return next(err); // Handle errors
        response.send(results);    // Send the filtered results
    });
}

app.use(logger);
app.get('/', root);
app.use('/assets', express.static(imagePath));
app.get('/assets/:image', staticImage);
app.param("collectionName", setCollectionName);
app.get('/collection/:collectionName', retrieveObjects);
app.get('/collection/:collectionName/:id', getOneObject);
app.post('/collection/:collectionName', addObject);
app.put('/collection/:collectionName/:id', updateObject);
app.get('/search/:collectionName', searchObjects);

// Start server
const port = process.env.PORT ||3000
app.listen(port, () => {
    console.log('Server running at http://localhost:' + port);
});