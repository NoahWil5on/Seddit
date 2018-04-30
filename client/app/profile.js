// 

// nearly had it set up so you could see both your posts and 
// comments, If I had had another hour It would have been complete

//const toggleSwitch = (e, a_post) => {
//     if(viewPost && a_post ||
//     !viewPost && !a_post) return;

//     viewPost = a_post;

//     let postButton = e.target.parentElement.childNodes[0];
//     let commentButton = e.target.parentElement.childNodes[1];

//     postButton.classList.remove('profile-active');
//     commentButton.classList.remove('profile-active');
//     if(a_post){
//         postButton.classList.add('profile-active');
//         sendAjax("GET", "/getMyPosts", null, (data) => {
//             ReactDOM.render(
//                 <div>
//                     <select value={sort} onChange={(e) => doSort(e)}>
//                         <option value="new">Newest</option>
//                         <option value="top">Top Rated</option>
//                     </select>
//                     <MyPostList posts={data.posts}/>
//                 </div>,document.querySelector('#my-posts')
//             );
//         });
//     }else{
//         commentButton.classList.add('profile-active');
//         sendAjax("GET", "/getMyComments", null, (data) => {
//             ReactDOM.render(
//                 <div>
//                     <select value={sort} onChange={(e) => doSort(e)}>
//                         <option value="new">Newest</option>
//                         <option value="top">Top Rated</option>
//                     </select>
//                     <MyCommentList posts={data.posts}/>
//                 </div>,document.querySelector('#my-posts')
//             );
//         });
//     }
// }
// const MyCommentList = function(props){

// }
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
//make header with image selection
//(to change profile image)
const ProfileHeader = function(){
    return (
        <div id="my-profile-header">
            <div id="my-header">
                <div id="header-name">{myUser.username}</div>
                {/* <div id="comment-post-switch">
                    <button className="left profile-active" onClick={(e) => toggleSwitch(e, true)}>Posts</button>
                    <button className="right" onClick={(e) => toggleSwitch(e, false)}>Comments</button>
                </div> */}
                <div id="header-photo-div" onClick={(e) => doChange()}>
                    <div id="header-photo" style={{ backgroundImage: `url("${myUser.photoUrl}")` }}>
                    </div>
                    <div id="header-photo-backdrop">
                        <div id="header-photo-plus">+</div>
                        <div className="backdrop-fill"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
//function to change the user's profile image
const PhotoChanger = function(props){
    return (
        //hidden when not selected
        <div id="change-holder" className={`${changePhoto ? '' : 'hidden'}`}>
            <div className="backdrop-fill" onClick={(e) => doChange(e)}></div>
            <div id="change-form-div" className="center-div">
                <form id="change-form"
                    onSubmit={handleChange}
                    name="change-form"
                    action="/changePhoto"
                    method="POST">
                    <div className="center-div change-inner-div">
                        <input id="change-title" type="text" name="photo" placeholder="URL to Profile Image" />
                        <input type="hidden" name="_csrf" value={props.csrf} />
                        <input className="make-post-submit" type="submit" value="Submit" />
                    </div>
                </form>
            </div>
        </div>
    );
}
//when a new post is tried to be submitted do this
const handleChange = (e) => {
    e.preventDefault();

    $("#error-message-div").animate({bottom:'hide'}, 350);

    //make sure post has valid data
    if ($("#change-title").val() == '') {
        handleError("A title is required in order to submit");
        return false;
    }
    //if post has valid data try to post it
    sendAjax('POST', $("#change-form").attr("action"), $("#change-form").serialize(), function () {
        myUser.photoUrl = `${$("#change-title").val()}`
        redirect({redirect: window.location.href});
    });

    return false;
};