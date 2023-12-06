const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_db_schema'
    }
    },{
        timestamps: true
    
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;