{
// This function sets up the handling of the form submission for creating a new post using Ajax.
let createPost = function () {
    
    let newPostForm = $('#new-post-form');// Select the form element with the id 'new-post-form'
 
    newPostForm.submit(function (e) {// Attach a submit event handler to the form
        console.log("new post form submit event called")
        e.preventDefault();// Prevent the default form submission behavior
 
        let formData = newPostForm.serialize();// Serialize the form data into a URL-encoded string
  
        $.ajax({ // Make an Ajax request to the server to submit the form data
            
            type: 'POST',// Specify the HTTP method (POST) for the request  
            url: '/posts/create-post',// Provide the URL endpoint where the form data should be sent
            data: formData, // Include the serialized form data in the request payload
            dataType: 'json',
            success: function (response) { // Define a callback function to handle a successful response from the server 
                
                console.log('Post created successfully through ajax:', response);
                let newPost = newPostDom(response.data.post);
                $('#posts-list-container>ul').prepend(newPost);
                // Attach deletePost function to the new post
                deletePost($(' .delete-post-button',newPost));
                // call the create comment class
                new PostComments(response.data.post._id);

                new Noty({
                    theme: 'relax',
                    text: "Post published!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();
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
           
                 <form id="post-${post._id}-comments-form" action="/comments/create" method="post">
                    <input type="text" name="content" placeholder="Type here to add comment.....">
                    <input type="hidden" name="post"  value= ${post._id} >
                    <input type="submit" value="Add Comment">
                  </form>

            <div id="post-comments-list">
                    <ul id="post-comments-${post._id}" >
                            
        </ul>
    </div>
    </div>
</li>`)
}

// method to delete a post from DOM
let deletePost = function(deleteLink){
    console.log("in delete post",$(deleteLink))
    $(deleteLink).click(function(e){
        e.preventDefault();
        console.log("delete event applied for the post" );
        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            dataType: 'json',
            success: function(data){
                console.log("post deleted successfully through ajax")
                $(`#post-${data.data.post_id}`).remove();
                
                new Noty({
                    theme: 'relax',
                    text: "Post deleted!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();
            },error: function(error){
                console.log(error.responseText);
            }
        })
    })
}



// loop over all the existing posts on the page (when the window loads for the first time) and 
//call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
let convertPostsToAjax = function(){
    $('#posts-list-container>ul>li').each(function(){
        //currentListItem is assigned the jQuery object representing the current list item (<li>).
        let currentListItem = $(this);
        //selects the element with the class 'delete-post-button' that is a descendant of the current list item (<li>).
        let deleteButton = $(' .delete-post-button', currentListItem);
        //This function sets up the click event handler for the delete button, enabling the asynchronous deletion of the post via Ajax
        deletePost(deleteButton);

        // get the post's id by splitting the id attribute
        let postId = currentListItem.prop('id').split("-")[1];
        //create a new instance of the PostComments class , passing the extracted postId as an argument
        new PostComments(postId);
    });
}



createPost();
convertPostsToAjax();

}
