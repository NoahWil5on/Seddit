//global variables 
var myCSRF;
var myUser = {
    username: '',
    photoUrl: ''
};
var sort;
var changePhoto = false;
var viewPost = true;

//creates navigation menu
const Nav = function(props){
    return (
        <div>
            <div id="nav-inner">
                <div className="center-div nav-center" id="nav-header" onClick={profile}>
                    <a href="">
                        <div id="logo" style={{ backgroundImage: `url('${myUser.photoUrl}')` }}></div>
                    </a>
                    <p id="nav-header-profile" dangerouslySetInnerHTML={{__html: myUser.username}}></p>
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
    var postList = props.posts;
    if(sort === 'top'){
        postList.sort((a,b) => {
            return b.rating - a.rating;
        });
    }else if(sort === 'new'){
        postList.sort((a,b) => {
            var aTime = Number(new Date(a.createdData).getTime());
            var bTime = Number(new Date(b.createdData).getTime());
            return bTime - aTime;
        });
    }
    return props.posts.map(function(post){
        var date = getDate(post.createdData);

        //randomly creates add

        let pizzaImage = getRandomImage();
        let myAd = (
            <div className={`ad-div${Math.floor(Math.random() * 4) === 0 ? ' ad-height' : ''}`} style={{backgroundImage: `url('${pizzaImage}')`}}>
            </div>
        )
        post.myVal = 0;
        for(var i = 0; i < post.voters.length; i++){
            if(post.voters[i].voter === myUser.username){
                post.myVal = post.voters[i].value;
                break;
            }
        }
        //make profile images easier on server by repeating image
        //if you are in profile view (you will only ever see your photo)
        if(state === 'profile'){
            post.photoUrl = myUser.photoUrl;
        }else if(!post.photoUrl || post.photoUrl === undefined){
            post.photoUrl = `./assets/img/user.png`;
        }
        //creates post
        return (
            <div key={post._id}>
                <div className="post">
                    <div className="post-header">
                        <div className="post-image">
                            <div className="profile-image" style={{backgroundImage: `url('${post.photoUrl}')`}}>
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
                            {/* voting system */}
                                <div className="action-button-inner">
                                    <div className="vote" onClick={(e) => doVote(post, 1, 'post', e)}>
                                        <i className={`material-icons${post.myVal === 1 ? ' highlight' : ''}`}>sentiment_very_satisfied</i>
                                    </div>
                                    <div className="vote" onClick={(e) => doVote(post, -1, 'post', e)}>
                                        <i className={`material-icons${post.myVal === -1 ? ' highlight' : ''}`}>sentiment_very_dissatisfied</i>
                                    </div>
                                    <div className="rating">
                                        <p>{post.rating}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="post-comment-div">
                                <div className="action-button-inner">
                                    <div className="post-comment-button" onClick={goToPost.bind(this, post._id)}>
                                        <i className="material-icons">comment</i>
                                    </div>
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
                <div>
                    {myAd}
                </div>
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
                    <div>
                        <select value={sort} onChange={(e) => doSort(e)}>
                            <option value="new">Newest</option>
                            <option value="top">Top Rated</option>
                        </select>
                        <PostList posts={data.posts}/>
                    </div>,document.querySelector('#posts')
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
                    <div>
                        <Post post={data.post} />
                        <select value={sort} onChange={(e) => doSort(e)}>
                            <option value="new">Newest</option>
                            <option value="top">Top Rated</option>
                        </select>
                    </div>,document.querySelector('#post')
                );
                $("#comment-form").find("input[type=text], textarea").val("");
            });
            //get all comments from specific post
            sendAjax("GET", `/getComments?post=${post}`, null, (data) => {
                let comments = [];
                if(data.comments !== undefined && data.comments){
                    data.comments.forEach(element => {
                        if (element.parentId === '') comments.push({ parent: element, children: [] });
                    });
                }
                //sort by top rated
                if(sort === 'top'){
                    comments.sort((a,b) => {
                        return b.parent.rating - a.parent.rating;
                    });
                    //sort by new
                }else if(sort === 'new'){
                    comments.sort((a,b) => {
                        var aTime = Number(new Date(a.parent.createdData).getTime());
                        var bTime = Number(new Date(b.parent.createdData).getTime());
                        return bTime - aTime;
                    });
                }
                //recursively make reddit style comments
                comments = makeChain(comments, data.comments);
                ReactDOM.render(
                    <CommentList comments={comments} />,document.querySelector('#comments')
                );
                $("#comment-form").find("input[type=text], textarea").val("");
                if(commentID != undefined){
                    var mainComment = document.getElementsByClassName('comment-highlight')[0];
                    window.scrollTo(0,mainComment.parentElement.getBoundingClientRect().top);
                }
            });
            break;
        case 'profile':
        //get all of this user's posts
            ReactDOM.render(
                <ProfileHeader/>, document.querySelector('#profile-header')
            );
            sendAjax("GET", "/getMyPosts", null, (data) => {
                ReactDOM.render(
                    <div>
                        <select value={sort} onChange={(e) => doSort(e)}>
                            <option value="new">Newest</option>
                            <option value="top">Top Rated</option>
                        </select>
                        <MyPostList posts={data.posts}/>
                    </div>,document.querySelector('#my-posts')
                );
            });
            break;
        default:
            break;
    }
};
//recursively make reddit style comments
const makeChain = (commentList, docList) => {
    var docs = docList;
    var comments = commentList;
    var toAdd = [];
    //look through all the comments and put them in the correct viewing order
    for (var i = 0; i < comments.length; i++) {
        for (var j = docs.length - 1; j >= 0; j--) {
            if (`${docs[j].parentId}` === `${comments[i].parent._id}`) {
                toAdd.push({ parent: docs[j], children: [] });
                docs.splice(j, 1);
            }
        }
        if (toAdd.length > 0) {
            for (var j = toAdd.length - 1; j >= 0; j--) {
                comments[i].children.push(toAdd[j]);
            }
            if(sort === 'top'){
                comments[i].children.sort((a,b) => {
                    return b.parent.rating - a.parent.rating;
                });
            }
            comments[i].children = makeChain(comments[i].children, docs);
        }
        toAdd = [];
    }
    return comments;
}
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
const setup = function(data) {
    var csrf = data.token.csrfToken;
    myUser.username = data.name;

    //use default image if user doesn't have a profile image set up
    if(!data.image || data.image === ''){
        myUser.photoUrl = `./assets/img/user.png`;
    }else{
        myUser.photoUrl = data.image;
    }
    ReactDOM.render(
        <Nav name={data.username} />,document.querySelector("#nav-div")
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
                <PostList posts={[]}/>,document.querySelector("#posts")
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
            ReactDOM.render(
                <ProfileHeader/>, document.querySelector('#profile-header')
            );
            ReactDOM.render(
                <PhotoChanger csrf={csrf}/>, document.querySelector('#change-form-section')
            );
        //all of my posts
            ReactDOM.render(
                <MyPostList posts={[]} />,document.querySelector("#my-posts")
            );
            break;
        default:
            break;
    }
    //actually get data
    loadDataFromServer(csrf);
};
//get csrf token to help prevent against malicious activity
const getToken = () => {
    sendAjax("GET", '/getToken', null, (result) => {
        myCSRF = result.token.csrfToken;
        setup(result);
    });
};
//when document is ready setup tokens/page components and set error message toast to hidden
$(document).ready(function() {
    $("#error-message-div").animate({bottom:'hide'}, 0);
    getToken();
});