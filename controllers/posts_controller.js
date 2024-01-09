const Post = require('../models/post_db_schema');
const Comment = require('../models/comment_db_schema')

console.log('post controller loaded')

module.exports.create = async function(req, res){
    try {
       
        let post = await Post.create({ // Create a new post using async/await
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created"
            });
        }

        req.flash("success", "Post published");// If the post is created successfully, send a success flash message and redirect
        return res.redirect('back');

    } catch (err) {

        req.flash("error", "Error in creating a post");// If there's an error, send an error flash message and redirect
        return res.redirect('back');

    }
};



module.exports.destroy = async function (req, res) {
    console.log("in post deleteing controller action")
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            req.flash("error","Post not found");
            return res.redirect('back');
        }

        // Check if the user is the author of the post
        if (post.user == req.user.id) {
            await post.deleteOne();

            // Delete comments associated with the post
            await Comment.deleteMany({ post: req.params.id });

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            req.flash("success","Post and related comments deleted");

            return res.redirect('back');

        } else {

            req.flash("error","You cannot delete this post");
            return res.redirect('back');

        }
    } catch (err) {

        req.flash("error", err);
        return res.redirect('back');

    }
};