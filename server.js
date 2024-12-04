// Import dependencies modules:
const express = require('express')

const app = express()

// Sends JSON response if server is running due to /status route
app.get('/status', (req, res) => {
    res.json({ status: 'Server is up and running!' });
});
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('API is running! Try /status');
});

// Starts the app on port 3000 and display a message when its started
app.listen(3000, function() {
    console.log("App started on port http://localhost:3000");
});