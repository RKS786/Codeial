// Import the Mongoose library
const mongoose = require('mongoose');

// Connect to the MongoDB server
mongoose.connect("mongodb://127.0.0.1/codeial-development");

// Get the default connection
const db = mongoose.connection;

// Event listener for connection errors
db.on('error', console.error.bind(console,'error connecting to MongoDB'));

// Event listener for successful connection
db.once('open', ()=> console.log("Successfully connected to MongoDB"));

// Export the MongoDB connection for other modules to use
module.exports = db;
