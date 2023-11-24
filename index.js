// Import the express library
const express = require('express');

// Import the Mongoose connection object from the mongoose.js file in the config directory
const db = require('./config/mongoose');

// Create an instance of the express application
const app = express();

// Set the port for the server
const port = 8000;

// Import express-ejs-layouts for layout support
const expressLayouts = require('express-ejs-layouts');

// Serve static files from the 'assets' directory
app.use(express.static('./assets'));

// Use express-ejs-layouts middleware
app.use(expressLayouts);

// Extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Use express router defined in the 'routes' module
app.use('/', require('./routes'));

// Set up the view engine as EJS
app.set('view engine', 'ejs');

// Set the directory where views are located
app.set('views', './views');

// Start the server and listen on the specified port
app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
