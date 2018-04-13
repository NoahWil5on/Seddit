const Post = function(props){
    if(props.post === {}){
        return (
            <div className="post-list">
                <h3 className="empty-post">This post doesn't seem to exist</h3>
            </div>
        );
    }
    var date = getDate(props.post.createdData);
    return (
        <div>
            <div className="post main-post">
                <div className="post-header main-header">
                    <div className="post-image">
                        <div className="profile-image" style={{backgroundImage: `url(./assets/img/user.png)`}}>
                        </div>
                    </div>
                    <div className="post-details">
                        <div className="post-author" dangerouslySetInnerHTML={{__html: props.post.author}}></div>
                        <div className="post-date">{date}</div>
                    </div>
                </div>
                <h3 className="post-title" dangerouslySetInnerHTML={{__html: props.post.title}}></h3>
                <p className="post-title" dangerouslySetInnerHTML={{__html: props.post.text}}></p>
                <div className="post-actions">
                    <div className="post-actions-inner">
                        <div className="post-vote">
                            <div className="action-button-inner">
                                <div className="vote">+</div>
                                <div className="vote">-</div>
                            </div>
                        </div>
                        <div className="post-share">
                            <div className="action-button-inner">
                                <div className="post-comment-button" onClick={copyPost}>Share</div>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
        </div>
    );
}
const commentNodes = function(props){
    return props.comments.map(function(comment){
        var date = getDate(comment.createdData);
        return(
            <div key={comment._id} className="post comment-post">
                <div className="post-header">
                    <div className="post-image">
                        <div className="profile-image" style={{backgroundImage: `url(./assets/img/user.png)`}}>
                        </div>
                    </div>
                    <div className="post-details">
                        <div className="post-author" dangerouslySetInnerHTML={{__html: comment.author}}></div>
                        <div className="post-date">{date}</div>
                    </div>
                </div>
                <p className="post-title" dangerouslySetInnerHTML={{__html: comment.text}}></p>
            </div>
        );
    });
}
const CommentList = function(props){
    if(props.comments.length === 0){
        return (
            <div className="post-list">
                <h3 className="empty-post">No one has commented on this post yet.</h3>
            </div>
        );
    }
    const comments = commentNodes(props);
    return (
        <div className="post-list">
        {comments}
        </div>
    );
}
const CommentForm = function(props){
    var myUrl = new URL(window.location.href);
    var _id = myUrl.searchParams.get('post');
    return (
        <form id="comment-form"
            onSubmit={postComment}
            name="comment-form"
            action="/postComment"
            method="POST"
            className="comment-form">
            <textarea id="comment-text" type="text" name="text" placeholder="What do you think about this post?"></textarea>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input type="hidden" name="_postId" value={_id} />
            <input className="make-comment-submit" type="submit" value="Submit" />
        </form>
    );
}
const postComment = (e) => {
    e.preventDefault();

    $("#error-message-div").animate({bottom:'hide'}, 350);

    if ($("#comment-text").val() == '') {
        handleError("Text is required in order to comment");
        return false;
    }
    sendAjax('POST', $("#comment-form").attr("action"), $("#comment-form").serialize(), function () {
        loadDataFromServer();
    });

    return false;
};