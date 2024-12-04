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

// Start server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});