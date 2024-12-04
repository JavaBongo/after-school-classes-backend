// Import dependencies modules:
const express = require('express')

const app = express()

// Sends response if server is running due to basic route
app.get('/', (req, res) => {
    res.send('Server is working!');
});

// Starts the app on port 3000 and display a message when its started
app.listen(3000, function() {
    console.log("App started on port http://localhost:3000");
});