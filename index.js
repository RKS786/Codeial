// Import the express library
const express = require('express');
const cookieParser = require('cookie-parser');
// Create an instance of the express application
const app = express();
// Set the port for the server
const port = 8000;
// Import the Mongoose connection object from the mongoose.js file in the config directory
const db = require('./config/mongoose');
// Used for session cookie
const session = require('express-session');
//For Authentication
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');    // to store session information even after server restarts
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


app.use(sassMiddleware({
    src: './assets/scss' ,
    dest: './assets/css' ,
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());
app.use(cookieParser());

// Import express-ejs-layouts for layout support
const expressLayouts = require('express-ejs-layouts');

// Serve static files from the 'assets' directory
app.use(express.static('./assets'));
// make the upload path available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// Use express-ejs-layouts middleware
app.use(expressLayouts);

// Extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Set up the view engine as EJS
app.set('view engine', 'ejs');

// Set the directory where views are located
app.set('views', './views');

const sessionMiddleware = session({
    name: 'codeial',
    secret: 'blahsomething',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    cookie: {
        maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1/codeial-development",
        autoRemove: 'disabled', //Disable expired sessions cleaning
    }),
});

app.use(sessionMiddleware);

// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

// Use express router defined in the 'routes' module
app.use('/', require('./routes'));

// Start the server and listen on the specified port
app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
