//when a new post is tried to be submitted do this
const handlePost = (e) => {
    e.preventDefault();

    $("#error-message-div").animate({bottom:'hide'}, 350);

    //make sure post has valid data
    if ($("#post-title").val() == '') {
        handleError("A title is required in order to submit");
        return false;
    }
    //if post has valid data try to post it
    sendAjax('POST', $("#post-form").attr("action"), $("#post-form").serialize(), function () {
        loadDataFromServer();
    });

    return false;
};
//make form to make posts
const PostForm = (props) => {
    return (
        <form id="post-form"
            onSubmit={handlePost}
            name="post-form"
            action="/maker"
            method="POST"
            className="post-form">
            <input id="post-title" type="text" name="title" placeholder="Put interesting title here" />
            <textarea id="post-text" type="text" name="text" placeholder="More Detail(optional)"></textarea>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="make-post-submit" type="submit" value="Submit" />
        </form>
    );
};
//make a component to hold all posts on site
const PostList = function(props){
    //if there has never ever been a post let the user know
    if(props.posts.length === 0){
        return (
            <div className="post-list">
                <h3 className="empty-post">No one's used the app yet :(</h3>
            </div>
        );
    }
    const posts = postNodes(props);
    return (
        <div className="post-list">
        {posts}
        </div>
    );
};