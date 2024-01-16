const Post = require('../../../models/post_db_schema');
const Comment = require('../../../models/comment_db_schema');

module.exports.index = async function(req, res){

    // Query posts and populate the 'user' field
    let posts = await Post.find({})
    .sort('-createdAt')// Sort posts in descending order based on the 'createdAt' field
    .populate('user')// Populate the 'user' field in the 'posts' collection
    .populate({  // Populate the 'comments' field in the 'posts' collection, 
        path: 'comments',//and within each comment, populate the 'user' field
        populate: {
            path: 'user'
        }
});

    return res.json(200, {
        message: "List of posts",
        posts: posts
    })
}


module.exports.destroy = async function (req, res) {
    
    try {
        const post = await Post.findById(req.params.id);

        // if (!post) {
        //    return res.json(500, {
        //     message: "Post not found"
        //    });
        // }

        if(post.user == req.user.id){
            await post.deleteOne();

            // Delete comments associated with the post
            await Comment.deleteMany({ post: req.params.id });

            return res.json(200, {
                message: "Post and associated comments deleted"
            });            
          
        } else {

            return res.json(401, {
                message: "You cannot delete this post"
            });

        }
    } catch (err) {

        return res.json(500, {
            message: "Internal Server Error"
        });

    }
};