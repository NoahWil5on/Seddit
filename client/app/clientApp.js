//creates navigation menu
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
//create post (and ad) components
const postNodes = function(props){
    return props.posts.map(function(post){
        var date = getDate(post.createdData);

        //randomly creates add
        let ad = (<div></div>);
        if(Math.floor(Math.random() * 3) === 1){
            let pizzaImage = getRandomImage();
            ad = (
                <div className="ad-div">
                   <img src={pizzaImage} alt="fake ad" />
                </div>
            )
        }
        //creates post
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
                                    <div className="vote">
                                        <i className="material-icons">sentiment_very_satisfied</i>
                                    </div>
                                    <div className="vote">
                                        <i className="material-icons">sentiment_very_dissatisfied</i>
                                    </div>
                                </div>
                            </div>
                            <div className="post-comment-div">
                                <div className="action-button-inner">
                                    <div className="post-comment-button" onClick={goToPost.bind(this, post._id)}>
                                        <i className="material-icons">comment</i></div>
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
//get data from server based on state
const loadDataFromServer = () => {
    switch(state){
        case 'home':
        //get all posts from server
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
            //get specific post from server
            sendAjax("GET", `/getPost?post=${post}`, null, (data) => {
                ReactDOM.render(
                    <Post post={data.post} />,document.querySelector('#post')
                );
                $("#comment-form").find("input[type=text], textarea").val("");
            });
            //get all comments from specific post
            sendAjax("GET", `/getComments?post=${post}`, null, (data) => {
                ReactDOM.render(
                    <CommentList comments={data.comments} />,document.querySelector('#comments')
                );
                $("#comment-form").find("input[type=text], textarea").val("");
            });
            break;
        case 'profile':
        //get all of this user's posts
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
//set links and styles of the navigation menu
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
//create empty components ready to be filled 
const setup = function(csrf, username) {
    ReactDOM.render(
        <Nav name={username} />,document.querySelector("#nav-div")
    );
    setupNav();
    //only set up the components for the page we're on
    switch(state){
        case 'home':
        //make post form
            ReactDOM.render(
                <PostForm csrf={csrf} />,document.querySelector("#make-post")
            );
        //all posts
            ReactDOM.render(
                <PostList posts={[]} />,document.querySelector("#posts")
            );
            break;
        case 'comments':
        //single post
            ReactDOM.render(
                <Post post={{}} />,document.querySelector("#post")
            );
        //make comment form
            ReactDOM.render(
                <CommentForm csrf={csrf} />,document.querySelector("#make-comment")
            );
        //list of all comments related to specific post
            ReactDOM.render(
                <CommentList comments={[]} />,document.querySelector('#comments')
            );
            var new_width = $('#main').width();
            $('#make-comment').width(new_width); 

            //resize comment form if window is resized
            $( window ).resize(function() {
                new_width = $('#main').width();
                $('#make-comment').width(new_width);
            });
            break;
        case 'profile':
        //all of my posts
            ReactDOM.render(
                <MyPostList posts={[]} />,document.querySelector("#my-posts")
            );
            break;
        default:
            break;
    }
    //actually get data
    loadDataFromServer();
};
//get csrf token to help prevent against malicious activity
const getToken = () => {
    sendAjax("GET", '/getToken', null, (result) => {
        setup(result.token.csrfToken, result.name);
    });
};
//when document is ready setup tokens/page components and set error message toast to hidden
$(document).ready(function() {
    $("#error-message-div").animate({bottom:'hide'}, 0);
    getToken();
});