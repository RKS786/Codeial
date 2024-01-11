// {
// // Log a message indicating that this script file is being executed
// console.log("in home_post_comment script file");

// // Function to set up the handling of the form submission for creating a new comment using Ajax.
// let createComment = function () {
    
//     let newCommentForm = $('#new-comment-form');// Select the form element with the id 'new-comment-form'

    
//     newCommentForm.submit(function (e) {// Attach a submit event handler to the form
        
//         e.preventDefault();// Prevent the default form submission behavior

        
//         let formData = newCommentForm.serialize();// Serialize the form data into a URL-encoded string

//         // Use Ajax to send the form data to the server for comment creation
//         $.ajax({
//             type: 'POST',// Specify the HTTP method (POST) for the request
//             url: '/comments/create', // Provide the URL endpoint where the form data should be sent
//             data: formData,// Include the serialized form data in the request payload
            
//             // Define a callback function to handle a successful response from the server
//             success: function (response) {

//                 // Log success message and update the DOM with the new comment
//                 console.log('Comment created successfully Ajax:', response);
                
//                 let newComment = newCommentDom(response.data.comment);
           
//                 $(`#post-comments-list-${response.data.comment.post}>ul`).prepend(newComment);
        
//                 // Attach deleteComment function to the new comment
//                 deleteComment($(' .delete-comment-button', newComment));
                
//             },
//             error: function (error) {
//                 // Log an error message if comment creation fails
//                 console.error('Error creating comment:', error);

//             }
//         });
//     });
// };

// // Method to create a comment in the DOM
// let newCommentDom = function (comment) {
//     return $(`<li id="comment-${comment._id}">
//     <p>
//         <small>
//             <a class="delete-comment-button" href="/comments/destroy/${comment._id} ">X</a>
//         </small>
//         ${comment.content}
//         <br>
//         <small>
//             ${comment.user.name}
//         </small>
//     </p>
// </li>`);
// };

// // Method to delete a comment from the DOM
// let deleteComment = function (deleteLink) {
//     console.log("in delete comment", deleteLink)
//     $(deleteLink).click(function (e) {
       
//         e.preventDefault(); // Prevent the default click behavior
        
//         $.ajax({// Use Ajax to send a request to delete the comment
//             type: 'get',
//             url: $(deleteLink).prop('href'),
//             success: function (response) {
//                 // Log success message and remove the deleted comment from the DOM
                
//                 $(`#comment-${response.data.comment_id}`).remove();
//             },
//             error: function (error) {
//                 // Log an error message if comment deletion fails
//                 console.log(error.responseText);
//             }
//         });
//     });
// };

// // Call the createComment function to set up form submission handling
// createComment();

// }





// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments {
    constructor(postId) {
        this.postId = postId;
        console.log("PostComments constructor called");
        this.postContainer = $(`#post-${postId}`);
        this.commentForm = $(`#post-${postId}-comments-form`);

        this.setupCommentCreation();
        this.setupExistingComments();
    }

    // Set up event handling for creating a new comment
    setupCommentCreation() {
        console.log("setupCommentCreation method called");
        let postCommentsInstance = this;

        this.commentForm.submit(function (e) {
            console.log("commentForm submit event called");
            e.preventDefault();

            // Use Ajax to send the form data to the server for comment creation
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(this).serialize(),
                success: function (data) {
                    console.log('Comment created successfully through Ajax:', data);
                    let newComment = postCommentsInstance.createCommentDom(data.data.comment);
                    postCommentsInstance.prependCommentToDOM(newComment);
                    postCommentsInstance.setupCommentDeletion($(' .delete-comment-button', newComment));

                    new Noty({
                        theme: 'relax',
                        text: "Comment Published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }, error: function (error) {
                    console.log(error);
                }
            });
        });
    }

    // Set up functionality for existing comments
setupExistingComments() {
    console.log("setupExistingComments method called");

    // Store the current instance of the PostComments class in a variable for reference within the nested functions
    let postCommentsInstance = this;

    // Find all delete-comment-button elements within the postContainer and iterate over each
    $(' .delete-comment-button', this.postContainer).each(function () {

        // Inside the loop, the 'this' keyword refers to the current delete-comment-button element
        let deleteButton = $(this);

        // Set up the deletion functionality for the current delete-comment-button element
        postCommentsInstance.setupCommentDeletion(deleteButton);
    });
}


    // Generate HTML for a new comment
    createCommentDom(comment) {
        return $(`<li id="comment-${comment._id}">
                        <p>
                            <small>
                                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                            </small>
                            ${comment.content}
                            <br>
                            <small>
                                ${comment.user.name}
                            </small>
                        </p>    
                </li>`);
    }

    // Handle deletion of a comment
    setupCommentDeletion(deleteLink) {
        console.log("setupCommentDeletion method called");
        let postCommentsInstance = this;

        $(deleteLink).click(function (e) {
            e.preventDefault();

            // Use Ajax to send a request to delete the comment
            $.ajax({
                type: 'get',
                url: $(this).prop('href'),
                success: function (data) {
                    console.log("Comment deleted successfully through Ajax", data);
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment deleted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    // Prepend a new comment to the DOM
    prependCommentToDOM(newComment) {
        $(`#post-comments-${this.postId}`).prepend(newComment);
    }
}
