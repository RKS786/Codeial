console.log('home controller loaded');

const Post = require('../models/post_db_schema');
const User = require('../models/user_db_schema');

// using async await
module.exports.home = async function(req, res){
    
    try{
        // Query posts and populate the 'user' field
        let posts = await Post.find({})
        .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });
 
        let users = await User.find({})

            return res.render('home', {
                title:"Codeial | Home" ,
                posts:posts,
                all_users:users
            });

    }catch(err){
        console.log("Error:", err);
    }
}

// using Promise
// module.exports.home = function(req, res){
//     // return res.end('<h1> Express is up for codeial!</h1>');
    
//     // Query posts and populate the 'user' field
//     Post.find({})
//     .populate('user')
//     .populate({
//         path: 'comments',
//         populate: {
//             path: 'user'
//         }
//     })
//     .exec()
//     .then(post => {
//         User.find({})
//         .then(users => {
//             return res.render('home', {
//                 title:"Codeial | Home" ,
//                 posts:post,
//                 all_users:users
//             });
//         })
        
//     })
//     .catch(err => {
//         console.log('Error in finding a post:', err);
//     });

// };