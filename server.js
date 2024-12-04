// Import dependencies
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var path = require("path");

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
    const timestamp = new Date();

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
        response.send((results.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
}

function updateObject(request, response, next) {
    const { ObjectID } = require('mongodb'); // Ensure ObjectID is required
    const collectionName = request.params.collectionName;
    const id = request.params.id;

    try {
        // Convert ⁠ id ⁠ to ObjectID
        const query = { _id: new ObjectID(id) };
        const update = { $set: request.body };

        request.collection.updateOne(query, update, { safe: true, multi: false }, (error, result) => {
            if (error) {
                console.error('Update error:', error);
                return next(error);
            }

            console.log('Update result:', result); // Log update result for debugging
            if (result.matchedCount === 0) {
                console.error('No document found with this ID:', id);
            }

            response.send((result.matchedCount === 1) ? { msg: 'success' } : { msg: 'error' });
        });
    } catch (error) {
        console.error('Error in PUT route:', error);
        next(error);
    }
}

function searchObjects(request, response, next) {
    const searchTerm = request.query.q || ""; // Get the search term
    const searchRegex = new RegExp(searchTerm, "i"); // Case-insensitive regex for substring matching

    // Aggregation pipeline
    const pipeline = [
        {
            $addFields: {
                priceAsString: { $toString: "$price" },               // Convert price to string
                availabilityAsString: { $toString: "$availability" } // Convert availability to string
            }
        },
        {
            $match: {
                $or: [
                    { title: searchRegex },             // Match title (string)
                    { location: searchRegex },          // Match location (string)
                    { priceAsString: searchRegex },     // Match price (as string)
                    { availabilityAsString: searchRegex } // Match availability (as string)
                ]
            }
        },
        {
            $project: {
                priceAsString: 0,           // Exclude priceAsString from the output
                availabilityAsString: 0     // Exclude availabilityAsString from the output
            }
        }
    ];

    // Execute the aggregation pipeline
    request.collection.aggregate(pipeline).toArray((error, results) => {
        if (error) return next(error); // Handle errors
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