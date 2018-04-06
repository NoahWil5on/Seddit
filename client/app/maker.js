const handlePost = (e) => {
    e.preventDefault();

    $("#post-message").animate({ width: 'hide' }, 350);

    if ($("#post-name").val() == '' || $("#post-age").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    sendAjax('POST', $("#post-form").attr("action"), $("#post-form").serialize(), function () {
        loadPostsFromServer();
    });

    return false;
};
const PostForm = (props) => {
    return (
        <form id="post-form"
            onSubmit={handlePost}
            name="post-form"
            action="/maker"
            method="POST"
            className="post-form">
            <label htmlFor="name">Name: </label>
            <input id="post-age" type="text" name="name" placeholder="Post Name" />
            <label htmlFor="age">Age: </label>
            <input id="post-age" type="text" name="age" placeholder="Post Age" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="make-post-submit" type="submit" value="Make Post" />
        </form>
    );
};
const PostList = function(props){
    if(props.posts.length === 0){
        return (
            <div className="post-list">
            <h3 className="empty-post">No Posts yet</h3>
            </div>
        );
    }
    const postNodes = props.posts.map(function(post){
        return (
            <div key={post._id} className="post">
                <img src="/assets/img/domoface.jpeg" className="post-face" alt="post face"/>
                <h3 className="post-name"> Name: {post.name} </h3>
                <h3 className="post-age"> Age: {post.age} </h3>
            </div>
        );
    });
    return (
        <div className="post-list">
        {postNodes}
        </div>
    )
};
const loadPostsFromServer = () => {
    sendAjax("GET", "/getposts", null, (data) => {
        ReactDOM.render(
            <PostList  posts={data.posts} />,document.querySelector('#posts')
        );
    });
};
const setup = function(csrf) {
    ReactDOM.render(
        <PostForm csrf={csrf} />,document.querySelector("#make-post")
    );
    ReactDOM.render(
        <PostList posts={[]} />,document.querySelector("#posts")
    );

    loadPostsFromServer();
};
const getToken = () => {
    sendAjax("GET", '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});