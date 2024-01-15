const mongoose = require('mongoose');
const multer = require('multer');

// imports the built-in Node.js module path, which provides utilities for working with file and directory paths.
const path = require('path');
//represents the relative path where user avatars will be stored
const AVATAR_PATH = path.join('/uploads/users/avatars')

const userDBSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },
    
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

// Configure Multer to handle file uploads
let storage = multer.diskStorage({

    destination: function (req, file, cb) {

        // Set the destination folder for uploaded avatars
      cb(null, path.join(__dirname,'..',AVATAR_PATH));

    },
    filename: function (req, file, cb) {

      // Generate a unique filename for the uploaded avatar
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)

    }
  })

  // Attach Multer middleware to the User model for handling avatar uploads
  userDBSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');

  // Define the avatarPath property for easy access to the avatar upload path
  userDBSchema.statics.avatarPath = AVATAR_PATH;

// Create the User model with the defined schema  
const User = mongoose.model('User', userDBSchema);

// Export the User model for use in other parts of the application
module.exports = User;