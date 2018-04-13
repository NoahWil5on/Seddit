const Nav = function(props){
    return (
        <div>
            <div id="nav-inner">
                <div className="center-div nav-center" id="nav-header" onClick={profile}>
                    <a href="">
                        <div id="logo" style={{ backgroundImage: `url("./assets/img/user.png")` }}></div>
                    </a>
                    <p id="nav-header-profile" dangerouslySetInnerHTML={{__html: props.name}}></p>
                </div>
            </div>
            <div style={{clear: 'both'}}></div>
            <div id="nav-options">
                <div className="nav-option-div">
                    <p>Home</p>
                    <a className="nav-option-text" href="" id="home"></a>
                </div>
                <div className="nav-option-div">
                    <p>Profile</p>
                    <a className="nav-option-text" href="" id="profile"></a>
                </div>
                <div className="nav-option-div">
                    <p>Log Out</p>
                    <a className="nav-option-text" href="/logout"></a>
                </div>
            </div>
        </div>
    );
}
const postNodes = function(props){
    return props.posts.map(function(post){
        var date = getDate(post.createdData);

        let ad = (<div></div>);
        // if(Math.floor(Math.random() * 3) === 1){
        //     ad = (
        //         <div class="add-div">
        //             You just got an add!
        //         </div>
        //     )
        // }
        return (
            <div key={post._id}>
                <div className="post">
                    <div className="post-header">
                        <div className="post-image">
                            <div className="profile-image" style={{backgroundImage: `url(./assets/img/user.png)`}}>
                            </div>
                        </div>
                        <div className="post-details">
                            <div className="post-author" dangerouslySetInnerHTML={{__html: post.author}}></div>
                            <div className="post-date">{date}</div>
                        </div>
                    </div>
                    <div className="post-content" onClick={goToPost.bind(this, post._id)}>
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
                                    <div className="post-comment-button" onClick={goToPost.bind(this, post._id)}>MM</div>
                                </div>
                            </div>
                            <div className="post-share">
                                <div className="action-button-inner">
                                    <div className="post-comment-button" onClick={copyPost.bind(this, post._id)}>Share</div>
                                </div>
                            </div>
                        </div>
                    </div>           
                </div>
                {ad}
            </div>
        );
    });
}
const loadDataFromServer = () => {
    switch(state){
        case 'home':
            sendAjax("GET", "/getPosts", null, (data) => {
                ReactDOM.render(
                    <PostList posts={data.posts} />,document.querySelector('#posts')
                );
                $("#post-form").find("input[type=text], textarea").val("");
            });
            break;
        case 'comments':
            var myUrl = new URL(window.location.href);
            var post = myUrl.searchParams.get('post');
            sendAjax("GET", `/getPost?post=${post}`, null, (data) => {
                ReactDOM.render(
                    <Post post={data.post} />,document.querySelector('#post')
                );
                $("#comment-form").find("input[type=text], textarea").val("");
            });
            sendAjax("GET", `/getComments?post=${post}`, null, (data) => {
                ReactDOM.render(
                    <CommentList comments={data.comments} />,document.querySelector('#comments')
                );
                $("#comment-form").find("input[type=text], textarea").val("");
            });
            break;
        case 'profile':
            sendAjax("GET", "/getMyPosts", null, (data) => {
                ReactDOM.render(
                    <MyPostList posts={data.posts} />,document.querySelector('#my-posts')
                );
            });
            break;
        default:
            break;
    }
};
const setupNav = () => {
    var home = document.getElementById('home');
    var profile = document.getElementById('profile');
    var url = window.location.href.split('?')[0];

    home.setAttribute('href', `${url}?location=home`);
    profile.setAttribute('href', `${url}?location=profile`);
    
    switch(state){
        case 'home':
        case 'comments':
            home.parentElement.classList.add('active');
            break;
        case 'profile':
            profile.parentElement.classList.add('active');
            break;
        default:
            home.parentElement.classList.add('active');
            break;
    }
}
const setup = function(csrf, username) {
    ReactDOM.render(
        <Nav name={username} />,document.querySelector("#nav-div")
    );
    setupNav();
    switch(state){
        case 'home':
            ReactDOM.render(
                <PostForm csrf={csrf} />,document.querySelector("#make-post")
            );
            ReactDOM.render(
                <PostList posts={[]} />,document.querySelector("#posts")
            );
            break;
        case 'comments':
            ReactDOM.render(
                <Post post={{}} />,document.querySelector("#post")
            );
            ReactDOM.render(
                <CommentForm csrf={csrf} />,document.querySelector("#make-comment")
            );
            ReactDOM.render(
                <CommentList comments={[]} />,document.querySelector('#comments')
            );
            var new_width = $('#main').width();
            $('#make-comment').width(new_width); 

            $( window ).resize(function() {
                new_width = $('#main').width();
                $('#make-comment').width(new_width);
            });
            break;
        case 'profile':
            ReactDOM.render(
                <MyPostList posts={[]} />,document.querySelector("#my-posts")
            );
            break;
        default:
            break;
    }
    loadDataFromServer();
};
const getToken = () => {
    sendAjax("GET", '/getToken', null, (result) => {
        setup(result.token.csrfToken, result.name);
    });
};

$(document).ready(function() {
    $("#error-message-div").animate({bottom:'hide'}, 0);
    getToken();
});