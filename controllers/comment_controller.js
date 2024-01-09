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

        req.flash("success","Comment created Successfully");
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
            req.flash("success","Comment deleted ");
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
