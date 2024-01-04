console.log('home controller loaded');

const Post = require('../models/post_db_schema');

module.exports.home = function(req, res){
    // return res.end('<h1> Express is up for codeial!</h1>');
    
    // Query posts and populate the 'user' field
    Post.find({}).populate('user').exec()
    .then(post => {
        return res.render('home', {
            title:"Codeial | Home" ,
            posts:post
        });
    })
    .catch(err => {
        console.log('Error in finding a post:', err);
    });

};