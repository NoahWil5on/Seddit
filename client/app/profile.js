//make component to hold all posts by specific user
const MyPostList = function(props){
    //if the user hasn't posted anything let them know
    if(props.posts.length === 0){
        return (
            <div className="post-list">
            <h3 className="empty-post">You should post something!</h3>
            </div>
        );
    }
    const posts = postNodes(props);
    return (
        <div className="post-list">
        {posts}
        </div>
    );
}