//single post
const Post = function(props){
    //if there is no post let the user know
    if(!props.post || !props.post.voters){
        return (
            <div className="post-list">
                <h3 className="empty-post">This post doesn't seem to exist</h3>
            </div>
        );
    }
    props.post.myVal = 0;
    for(var i = 0; i < props.post.voters.length; i++){
        if(props.post.voters[i].voter === myUsername){
            props.post.myVal = props.post.voters[i].value;
            break;
        }
    }
    //get date string
    var date = getDate(props.post.createdData);
    //return a properly formatted post
    
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
                                <div className="vote" onClick={(e) => doVote(props.post, 1, 'post', e)}>
                                    <i className={`material-icons${props.post.myVal === 1 ? ' highlight' : ''}`}>sentiment_very_satisfied</i>
                                </div>
                                <div className="vote" onClick={(e) => doVote(props.post, -1, 'post', e)}>
                                    <i className={`material-icons${props.post.myVal === -1 ? ' highlight' : ''}`}>sentiment_very_dissatisfied</i>
                                </div>
                                <div className="rating">
                                    <p>{props.post.rating}</p>
                                </div>
                            </div>
                        </div>
                        <div className="post-share">
                            <div className="action-button-inner">
                                <div className="post-comment-button" onClick={(e) => copyPost(props.post._id, e)}>Share</div>
                            </div>
                        </div>
                    </div>
                </div>           
            </div>
        </div>
    );
}
//returns all comment nodes
const commentNodes = function(props){
    return props.comments.map(function(comment){
        var highlight = false;

        comment.myVal = 0;
        for(var i = 0; i < comment.voters.length; i++){
            if(comment.voters[i].voter === myUsername){
                comment.myVal = comment.voters[i].value;
                break;
            }
        }
        if(`${comment._id}` === commentID){
            highlight = true;
        }
        var date = getDate(comment.createdData);
        return(
            <div key={comment._id} className="post comment-post">
                <div>
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
                    <p className={`post-title${highlight ? ' comment-highlight' : ''}`} dangerouslySetInnerHTML={{__html: comment.text}}></p>
                </div>
                <div className="post-actions">
                    <div className="post-actions-inner">
                        <div className="post-vote">
                            <div className="action-button-inner">
                                <div className="vote" onClick={(e) => doVote(comment, 1, 'comment', e)}>
                                    <i className={`material-icons${comment.myVal === 1 ? ' highlight' : ''}`}>sentiment_very_satisfied</i>
                                </div>
                                <div className="vote" onClick={(e) => doVote(comment, -1, 'comment', e)}>
                                    <i className={`material-icons${comment.myVal === -1 ? ' highlight' : ''}`}>sentiment_very_dissatisfied</i>
                                </div>
                                <div className="rating">
                                    <p>{comment.rating}</p>
                                </div>
                            </div>
                        </div>
                        <div className="post-share">
                            <div className="action-button-inner">
                                <div className="post-comment-button" onClick={(e) => copyPostComment(comment.postId, comment._id,e)}>Share</div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
        );
    });
}
//creates list of all comments related to this post
const CommentList = function(props){
    //if there are no comments let user know
    if(props.comments.length === 0){
        return (
            <div className="post-list">
                <h3 className="empty-post">No one has commented on this post yet.</h3>
            </div>
        );
    }
    //otherwise fill div with comments
    const comments = commentNodes(props);
    return (
        <div className="post-list">
        {comments}
        </div>
    );
}
//for to create new comment
const CommentForm = function(props){
    //get info about current post
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
//do post comment
const postComment = (e) => {
    e.preventDefault();

    $("#error-message-div").animate({bottom:'hide'}, 350);

    //make sure post is valid
    if ($("#comment-text").val() == '') {
        handleError("Text is required in order to comment");
        return false;
    }
    //if post is valid then do post
    sendAjax('POST', $("#comment-form").attr("action"), $("#comment-form").serialize(), function () {
        loadDataFromServer();
    });

    return false;
};