const handlePost = (e) => {
    e.preventDefault();

    $("#post-message").animate({ width: 'hide' }, 350);

    if ($("#post-title").val() == '') {
        handleError("A title is required in order to submit");
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
            <input id="post-title" type="text" name="title" placeholder="Put interesting title here" />
            <textarea id="post-text" type="text" name="text" placeholder="More Detail(optional)"></textarea>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="make-post-submit" type="submit" value="Submit" />
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
        let ad = (<div></div>);
        // if(Math.floor(Math.random() * 3) === 1){
        //     ad = (
        //         <div class="add-div">
        //             You just got an add!
        //         </div>
        //     )
        // }
        return (
            <div>
                <div key={post._id} className="post">
                    <div className="post-header">
                        <div className="post-image">
                            <div className="profile-image" style={{backgroundImage: `url(./assets/img/user.png)`}}>
                            </div>
                        </div>
                        <div className="post-details">
                            <div className="post-author">Noah Wilson</div>
                            <div className="post-date">10/20/96</div>
                        </div>
                    </div>
                    <div className="post-content">
                        <h3 className="post-title" dangerouslySetInnerHTML={{__html: post.title}}></h3>
                    </div>         
                    <div className="post-actions">
                        <div className="post-actions-inner">
                            <div className="post-vote">
                                <div className="action-button-inner">
                                    <div className="vote">+</div>
                                    <div className="vote">-</div>
                                </div>
                            </div>
                            <div className="post-comment-div">
                                <div className="action-button-inner">
                                    <div className="post-comment">5</div>
                                    <div className="post-comment-button">MM</div>
                                </div>
                            </div>
                            <div className="post-share">
                                <div className="action-button-inner">
                                        <div className="post-comment-button">Share</div>
                                </div>
                            </div>
                        </div>
                    </div>           
                </div>
                {ad}
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