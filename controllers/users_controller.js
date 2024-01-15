console.log('user controller loaded');

const User = require('../models/user_db_schema');
const fileSystem = require('fs');
const path = require('path');

// Controller function to render user profile
module.exports.profile = function(req, res){
    // console.log(req.cookies.user_id); // Log the user_id stored in the cookie

    // // Check if user_id cookie exists in the request
    // if(req.cookies.user_id){
    //     // Find user by ID using Mongoose
    //     User.findById(req.cookies.user_id)
    //         .then(user => {
    //             // Handle user found
    //             if(user){
    //                 // Render user profile page with user data
    //                 return res.render('user_profile', {
    //                     title: 'User profile',
    //                     user: user
    //                 });
    //             } else {
    //                 // Reject promise if user does not exist
    //                 return Promise.reject("User does not exist");
    //             }
    //         })
    //         .catch(err => {
    //             // Log and handle errors
    //             console.error("Error in user profile:", err);
    //             return res.redirect('/users/sign-in'); // Redirect to sign-in if an error occurs
    //         });
    // } else {
    //     // Redirect to sign-in if user_id cookie is not present
    //     return res.redirect('/users/sign-in');
    // }

    User.findById(req.params.id)
    .then(user => {

        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });
   
}


module.exports.update = async function (req, res) {
//     try {
//         if (req.user.id == req.params.id) {
//             const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

//             if (!user) {

//                 // User not found
//                 req.flash("error", "User not found");
//                 return res.redirect('back');

//             }

//             req.flash("success","User name and email updated successfully");
//             return res.redirect('back');

//         } else {

//             req.flash("error", "Unauthorized");
//             return res.redirect('back');

//         }
//     } catch (err) {
//         // Handle the error appropriately
//         req.flash("error", err);
//         return res.redirect('back');
//     }
// };


if(req.user.id == req.params.id){
    try{
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req, res, function(err){

            if(err){console.log("*****Multer Errors:", err);}

            user.name = req.body.name;
            user.email = req.body.email;

            if(req.file){
                console.log(req.file);

                if(user.avatar){
                    fileSystem.unlinkSync(path.join(__dirname, '..', user.avatar));
                }
                // this is saving the path of the uploaded file into the avatar field of the User model
                user.avatar = User.avatarPath + '/' + req.file.filename;

            }
            user.save();
            return res.redirect('back');
        });

    }catch (err) {
        
        req.flash("error", err);
        return res.redirect('back');
}
}
}






// Controller function to render the sign up page
module.exports.signUp = function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

  return  res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    });
}

// Controller function to render the sign in page
module.exports.signIn = function(req, res){
    
    if(req.isAuthenticated()){
        
        return res.redirect('/users/profile');
    }
    
   return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    });
}

// Controller function to get the sign-up data
module.exports.create = async function(req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {

            req.flash("error", "Password and confirm password does not match");
            return res.redirect('back');
        }

        // Using async/await
        const existingUser = await User.findOne({ email: req.body.email });

        if (!existingUser) {

            const newUser = await User.create(req.body);
            console.log("User created successfully:", newUser);
            req.flash("success","User created successfully");
            return res.redirect('/users/sign-in');

        } else {

            req.flash("error", "User already exists");
            return res.redirect('back');

        }
    } catch (err) {

        console.error("Error in user creation:", err);
        req.flash("error", "Error in user creation");
            return res.redirect('back');

    }
};



// Controller function to sign in and create a session for user
module.exports.createSession = function(req, res) {
    // console.log("Sign-in request received. Email:", req.body.email, "Password:", req.body.password);

    // //steps to authenticate
    // // check whether the user exists or not
    // User.findOne({ email: req.body.email })
    //     .then(user => {
    //         // handle user found
    //         console.log(user);
    //         if (user) {
    //             if (user.password !== req.body.password) {
    //                return Promise.reject("password does not match");
    //             }
    //             // handle session creation
    //             res.cookie('user_id', user.id);
    //             return res.redirect('/users/profile');
    //         } else {
    //             return Promise.reject("user does not exist");
    //         }
    //     })
    //     .catch(err => {
    //         console.error("Error in createSession:", err);
    //         return res.redirect('back');
    //     });
    req.flash("success","Logged In Successfully");
    return res.redirect('/');
};


// Destroy session
module.exports.destroySession = function(req, res){
    // Using req.logout() with a callback function
    req.logout(function(err) {
        if (err) {
            // Handle the error, e.g., by sending an error response
            return res.status(500).send("Error during logout");
        }
        
        req.flash("success","You have Logged out Successfully");
        // Redirecting the user to the root URL after logout
        return res.redirect('/');
    })
}