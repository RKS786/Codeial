const Post = require('../models/post_db_schema');
const Comment = require('../models/comment_db_schema');

console.log("comment controller loaded");

module.exports.create = async function (req, res) {
    try {
        const post = await Post.findById(req.body.post);

        if (!post) {
            req.flash("error","Post not found");
            return res.redirect('back');
        }

        const comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        });

        post.comments.push(comment);
        await post.save();
        
        if(req.xhr){
            console.log("yes comment req is xhr")
            return res.status(200).json({
            data: {
                comment: comment
            },
            message: "Comment created"
        });
    }

        req.flash("success","Comment created flash");
        res.redirect('/');

    } catch (err) {

        req.flash("error", err);
        return res.redirect('back');
    }
};

module.exports.destroy = async function (req, res) {
    console.log("in comment destroy controller action");

    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            req.flash("error","Comment not found");
            return res.redirect('back');
        }

        // Check if the user is the author of the comment
        if (comment.user == req.user.id) {
            const postId = comment.post;

            await comment.deleteOne();
            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

            if(req.xhr){
                console.log("yes comment destroy req is xhr")
            return res.status(200).json({
                data: {
                    comment_id: req.params.id
                },
                message: "Comment deleted"
            });
        }
            req.flash("success","Comment deleted flash ");
            return res.redirect('back');

        } else {

            req.flash("error","You cannot delete this comment");
            return res.redirect('back');
            
        }
    } catch (err) {

        req.flash("error", err);
        return res.redirect('back');

    }
};
