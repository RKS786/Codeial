const Post = require('../models/post_db_schema');

console.log('post controller loaded')

module.exports.create = function(req, res){
    console.log(req.user)
    Post.create({
        content: req.body.content,
        user: req.user._id
    })
    .then(post => {
        return res.redirect('back');
    })
    .catch(err => {
        console.log('Error in creating a post:', err);
    });
    
}