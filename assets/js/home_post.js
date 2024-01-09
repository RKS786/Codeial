{
// This function sets up the handling of the form submission for creating a new post using Ajax.
let createPost = function () {
    
    let newPostForm = $('#new-post-form');// Select the form element with the id 'new-post-form'
 
    newPostForm.submit(function (e) {// Attach a submit event handler to the form
        
        e.preventDefault();// Prevent the default form submission behavior
 
        let formData = newPostForm.serialize();// Serialize the form data into a URL-encoded string
  
        $.ajax({ // Make an Ajax request to the server to submit the form data
            
            type: 'POST',// Specify the HTTP method (POST) for the request  
            url: '/posts/create-post',// Provide the URL endpoint where the form data should be sent
            data: formData, // Include the serialized form data in the request payload
            success: function (response) { // Define a callback function to handle a successful response from the server 
                console.log('Post created successfully:', response);
                let newPost = newPostDom(response.data.post);
                $('#posts-list-container>ul').prepend(newPost);
                deletePost($(' .delete-post-button',newPost));
                
            },

            error: function (error) {// Define a callback function to handle errors from the server  
                console.error('Error creating post:', error);
            }
        });
    });
};

// method to create a post in DOM
let newPostDom = function(post){
    return $(`<li id="post-${post._id}">
    <p>

            <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id} ">X</a>
            </small>

        ${post.content}
        <br>
            <small>
        ${post.user.name}
            </small>
    </p>

    <div class="post-comments">
           
                 <form action="/comments/create" method="post">
                    <input type="text" name="content" placeholder="Type here to add comment.....">
                    <input type="hidden" name="post"  value= ${post._id} >
                    <input type="submit" value="Add Comment">
                  </form>

            <div class="post-comments-list">
                    <ul id="post-comments-${post._id}" >
                            
        </ul>
    </div>
    </div>
</li>`)
}

// method to delete a post from DOM
let deletePost = function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#post-${data.data.post_id}`).remove();
            },error: function(error){
                console.log(error.responseText);
            }
        })
    })
}

createPost();
}
