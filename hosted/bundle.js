'use strict';

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
var Nav = function Nav(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'div',
            { id: 'nav-inner' },
            React.createElement(
                'div',
                { className: 'center-div nav-center', id: 'nav-header', onClick: profile },
                React.createElement(
                    'a',
                    { href: '' },
                    React.createElement('div', { id: 'logo', style: { backgroundImage: 'url(\'' + myUser.photoUrl + '\')' } })
                ),
                React.createElement('p', { id: 'nav-header-profile', dangerouslySetInnerHTML: { __html: myUser.username } })
            )
        ),
        React.createElement('div', { style: { clear: 'both' } }),
        React.createElement(
            'div',
            { id: 'nav-options' },
            React.createElement(
                'div',
                { className: 'nav-option-div' },
                React.createElement(
                    'p',
                    null,
                    'Home'
                ),
                React.createElement('a', { className: 'nav-option-text', href: '', id: 'home' })
            ),
            React.createElement(
                'div',
                { className: 'nav-option-div' },
                React.createElement(
                    'p',
                    null,
                    'Profile'
                ),
                React.createElement('a', { className: 'nav-option-text', href: '', id: 'profile' })
            ),
            React.createElement(
                'div',
                { className: 'nav-option-div' },
                React.createElement(
                    'p',
                    null,
                    'Log Out'
                ),
                React.createElement('a', { className: 'nav-option-text', href: '/logout' })
            )
        )
    );
};
//create post (and ad) components
var postNodes = function postNodes(props) {
    var postList = props.posts;
    if (sort === 'top') {
        postList.sort(function (a, b) {
            return b.rating - a.rating;
        });
    } else if (sort === 'new') {
        postList.sort(function (a, b) {
            var aTime = Number(new Date(a.createdData).getTime());
            var bTime = Number(new Date(b.createdData).getTime());
            return bTime - aTime;
        });
    }
    return props.posts.map(function (post) {
        var date = getDate(post.createdData);

        //randomly creates add
        var ad = React.createElement('div', null);
        if (Math.floor(Math.random() * 4) === 0) {
            var pizzaImage = getRandomImage();
            ad = React.createElement(
                'div',
                { className: 'ad-div' },
                React.createElement('img', { src: pizzaImage, alt: 'fake ad' })
            );
        }
        post.myVal = 0;
        for (var i = 0; i < post.voters.length; i++) {
            if (post.voters[i].voter === myUser.username) {
                post.myVal = post.voters[i].value;
                break;
            }
        }
        //make profile images easier on server by repeating image
        //if you are in profile view (you will only ever see your photo)
        if (state === 'profile') {
            post.photoUrl = myUser.photoUrl;
        } else if (!post.photoUrl || post.photoUrl === undefined) {
            post.photoUrl = './assets/img/user.png';
        }
        //creates post
        return React.createElement(
            'div',
            { key: post._id },
            React.createElement(
                'div',
                { className: 'post' },
                React.createElement(
                    'div',
                    { className: 'post-header' },
                    React.createElement(
                        'div',
                        { className: 'post-image' },
                        React.createElement('div', { className: 'profile-image', style: { backgroundImage: 'url(\'' + post.photoUrl + '\')' } })
                    ),
                    React.createElement(
                        'div',
                        { className: 'post-details' },
                        React.createElement('div', { className: 'post-author', dangerouslySetInnerHTML: { __html: post.author } }),
                        React.createElement(
                            'div',
                            { className: 'post-date' },
                            date
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'post-content', onClick: goToPost.bind(this, post._id) },
                    React.createElement('h3', { className: 'post-title', dangerouslySetInnerHTML: { __html: post.title } })
                ),
                React.createElement(
                    'div',
                    { className: 'post-actions' },
                    React.createElement(
                        'div',
                        { className: 'post-actions-inner' },
                        React.createElement(
                            'div',
                            { className: 'post-vote' },
                            React.createElement(
                                'div',
                                { className: 'action-button-inner' },
                                React.createElement(
                                    'div',
                                    { className: 'vote', onClick: function onClick(e) {
                                            return doVote(post, 1, 'post', e);
                                        } },
                                    React.createElement(
                                        'i',
                                        { className: 'material-icons' + (post.myVal === 1 ? ' highlight' : '') },
                                        'sentiment_very_satisfied'
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'vote', onClick: function onClick(e) {
                                            return doVote(post, -1, 'post', e);
                                        } },
                                    React.createElement(
                                        'i',
                                        { className: 'material-icons' + (post.myVal === -1 ? ' highlight' : '') },
                                        'sentiment_very_dissatisfied'
                                    )
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'rating' },
                                    React.createElement(
                                        'p',
                                        null,
                                        post.rating
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'post-comment-div' },
                            React.createElement(
                                'div',
                                { className: 'action-button-inner' },
                                React.createElement(
                                    'div',
                                    { className: 'post-comment-button', onClick: goToPost.bind(this, post._id) },
                                    React.createElement(
                                        'i',
                                        { className: 'material-icons' },
                                        'comment'
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'post-share' },
                            React.createElement(
                                'div',
                                { className: 'action-button-inner' },
                                React.createElement(
                                    'div',
                                    { className: 'post-comment-button', onClick: copyPost.bind(this, post._id) },
                                    'Share'
                                )
                            )
                        )
                    )
                )
            ),
            ad
        );
    });
};
//get data from server based on state
var loadDataFromServer = function loadDataFromServer() {
    switch (state) {
        case 'home':
            //get all posts from server
            sendAjax("GET", "/getPosts", null, function (data) {

                ReactDOM.render(React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'select',
                        { value: sort, onChange: function onChange(e) {
                                return doSort(e);
                            } },
                        React.createElement(
                            'option',
                            { value: 'new' },
                            'Newest'
                        ),
                        React.createElement(
                            'option',
                            { value: 'top' },
                            'Top Rated'
                        )
                    ),
                    React.createElement(PostList, { posts: data.posts })
                ), document.querySelector('#posts'));
                $("#post-form").find("input[type=text], textarea").val("");
            });
            break;
        case 'comments':
            var myUrl = new URL(window.location.href);
            var post = myUrl.searchParams.get('post');

            //get specific post from server
            sendAjax("GET", '/getPost?post=' + post, null, function (data) {
                ReactDOM.render(React.createElement(
                    'div',
                    null,
                    React.createElement(Post, { post: data.post }),
                    React.createElement(
                        'select',
                        { value: sort, onChange: function onChange(e) {
                                return doSort(e);
                            } },
                        React.createElement(
                            'option',
                            { value: 'new' },
                            'Newest'
                        ),
                        React.createElement(
                            'option',
                            { value: 'top' },
                            'Top Rated'
                        )
                    )
                ), document.querySelector('#post'));
                $("#comment-form").find("input[type=text], textarea").val("");
            });
            //get all comments from specific post
            sendAjax("GET", '/getComments?post=' + post, null, function (data) {
                var comments = [];
                if (data.comments !== undefined && data.comments) {
                    data.comments.forEach(function (element) {
                        if (element.parentId === '') comments.push({ parent: element, children: [] });
                    });
                }
                //sort by top rated
                if (sort === 'top') {
                    comments.sort(function (a, b) {
                        return b.parent.rating - a.parent.rating;
                    });
                    //sort by new
                } else if (sort === 'new') {
                    comments.sort(function (a, b) {
                        var aTime = Number(new Date(a.parent.createdData).getTime());
                        var bTime = Number(new Date(b.parent.createdData).getTime());
                        return bTime - aTime;
                    });
                }
                //recursively make reddit style comments
                comments = makeChain(comments, data.comments);
                ReactDOM.render(React.createElement(CommentList, { comments: comments }), document.querySelector('#comments'));
                $("#comment-form").find("input[type=text], textarea").val("");
                if (commentID != undefined) {
                    var mainComment = document.getElementsByClassName('comment-highlight')[0];
                    window.scrollTo(0, mainComment.parentElement.getBoundingClientRect().top);
                }
            });
            break;
        case 'profile':
            //get all of this user's posts
            ReactDOM.render(React.createElement(ProfileHeader, null), document.querySelector('#profile-header'));
            sendAjax("GET", "/getMyPosts", null, function (data) {
                ReactDOM.render(React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'select',
                        { value: sort, onChange: function onChange(e) {
                                return doSort(e);
                            } },
                        React.createElement(
                            'option',
                            { value: 'new' },
                            'Newest'
                        ),
                        React.createElement(
                            'option',
                            { value: 'top' },
                            'Top Rated'
                        )
                    ),
                    React.createElement(MyPostList, { posts: data.posts })
                ), document.querySelector('#my-posts'));
            });
            break;
        default:
            break;
    }
};
//recursively make reddit style comments
var makeChain = function makeChain(commentList, docList) {
    var docs = docList;
    var comments = commentList;
    var toAdd = [];
    //look through all the comments and put them in the correct viewing order
    for (var i = 0; i < comments.length; i++) {
        for (var j = docs.length - 1; j >= 0; j--) {
            if ('' + docs[j].parentId === '' + comments[i].parent._id) {
                toAdd.push({ parent: docs[j], children: [] });
                docs.splice(j, 1);
            }
        }
        if (toAdd.length > 0) {
            for (var j = toAdd.length - 1; j >= 0; j--) {
                comments[i].children.push(toAdd[j]);
            }
            if (sort === 'top') {
                comments[i].children.sort(function (a, b) {
                    return b.parent.rating - a.parent.rating;
                });
            }
            comments[i].children = makeChain(comments[i].children, docs);
        }
        toAdd = [];
    }
    return comments;
};
//set links and styles of the navigation menu
var setupNav = function setupNav() {
    var home = document.getElementById('home');
    var profile = document.getElementById('profile');
    var url = window.location.href.split('?')[0];

    home.setAttribute('href', url + '?location=home');
    profile.setAttribute('href', url + '?location=profile');

    switch (state) {
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
};
//create empty components ready to be filled 
var setup = function setup(data) {
    var csrf = data.token.csrfToken;
    myUser.username = data.name;

    //use default image if user doesn't have a profile image set up
    if (!data.image || data.image === '') {
        myUser.photoUrl = './assets/img/user.png';
    } else {
        myUser.photoUrl = data.image;
    }
    ReactDOM.render(React.createElement(Nav, { name: data.username }), document.querySelector("#nav-div"));
    setupNav();
    //only set up the components for the page we're on
    switch (state) {
        case 'home':
            //make post form
            ReactDOM.render(React.createElement(PostForm, { csrf: csrf }), document.querySelector("#make-post"));
            //all posts
            ReactDOM.render(React.createElement(PostList, { posts: [] }), document.querySelector("#posts"));
            break;
        case 'comments':
            //single post
            ReactDOM.render(React.createElement(Post, { post: {} }), document.querySelector("#post"));
            //make comment form
            ReactDOM.render(React.createElement(CommentForm, { csrf: csrf }), document.querySelector("#make-comment"));
            //list of all comments related to specific post
            ReactDOM.render(React.createElement(CommentList, { comments: [] }), document.querySelector('#comments'));
            var new_width = $('#main').width();
            $('#make-comment').width(new_width);

            //resize comment form if window is resized
            $(window).resize(function () {
                new_width = $('#main').width();
                $('#make-comment').width(new_width);
            });
            break;
        case 'profile':
            ReactDOM.render(React.createElement(ProfileHeader, null), document.querySelector('#profile-header'));
            ReactDOM.render(React.createElement(PhotoChanger, { csrf: csrf }), document.querySelector('#change-form-section'));
            //all of my posts
            ReactDOM.render(React.createElement(MyPostList, { posts: [] }), document.querySelector("#my-posts"));
            break;
        default:
            break;
    }
    //actually get data
    loadDataFromServer(csrf);
};
//get csrf token to help prevent against malicious activity
var getToken = function getToken() {
    sendAjax("GET", '/getToken', null, function (result) {
        myCSRF = result.token.csrfToken;
        setup(result);
    });
};
//when document is ready setup tokens/page components and set error message toast to hidden
$(document).ready(function () {
    $("#error-message-div").animate({ bottom: 'hide' }, 0);
    getToken();
});
"use strict";

//single post
var Post = function Post(props) {
    //if there is no post let the user know
    if (!props.post || !props.post.voters) {
        return React.createElement(
            "div",
            { className: "post-list" },
            React.createElement(
                "h3",
                { className: "empty-post" },
                "This post doesn't seem to exist"
            )
        );
    }
    //post rating
    props.post.myVal = 0;
    //check if user has voted on post in the past
    for (var i = 0; i < props.post.voters.length; i++) {
        if (props.post.voters[i].voter === myUser.username) {
            props.post.myVal = props.post.voters[i].value;
            break;
        }
    }
    if (!props.post.photoUrl || props.post.photoUrl === undefined) {
        props.post.photoUrl = "./assets/img/user.png";
    }
    //get date string
    var date = getDate(props.post.createdData);
    //return a properly formatted post

    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            { className: "post main-post" },
            React.createElement(
                "div",
                { className: "post-header main-header" },
                React.createElement(
                    "div",
                    { className: "post-image" },
                    React.createElement("div", { className: "profile-image", style: { backgroundImage: "url('" + props.post.photoUrl + "')" } })
                ),
                React.createElement(
                    "div",
                    { className: "post-details" },
                    React.createElement("div", { className: "post-author", dangerouslySetInnerHTML: { __html: props.post.author } }),
                    React.createElement(
                        "div",
                        { className: "post-date" },
                        date
                    )
                )
            ),
            React.createElement("h3", { className: "post-title", dangerouslySetInnerHTML: { __html: props.post.title } }),
            React.createElement("p", { className: "post-title", dangerouslySetInnerHTML: { __html: props.post.text } }),
            React.createElement(
                "div",
                { className: "post-actions" },
                React.createElement(
                    "div",
                    { className: "post-actions-inner" },
                    React.createElement(
                        "div",
                        { className: "post-vote" },
                        React.createElement(
                            "div",
                            { className: "action-button-inner" },
                            React.createElement(
                                "div",
                                { className: "vote", onClick: function onClick(e) {
                                        return doVote(props.post, 1, 'post', e);
                                    } },
                                React.createElement(
                                    "i",
                                    { className: "material-icons" + (props.post.myVal === 1 ? ' highlight' : '') },
                                    "sentiment_very_satisfied"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "vote", onClick: function onClick(e) {
                                        return doVote(props.post, -1, 'post', e);
                                    } },
                                React.createElement(
                                    "i",
                                    { className: "material-icons" + (props.post.myVal === -1 ? ' highlight' : '') },
                                    "sentiment_very_dissatisfied"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "rating" },
                                React.createElement(
                                    "p",
                                    null,
                                    props.post.rating
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "post-comment-div" },
                        React.createElement(
                            "div",
                            { className: "action-button-inner" },
                            React.createElement(
                                "div",
                                { className: "post-comment-button", onClick: commentPost.bind(this, '', '', true) },
                                React.createElement(
                                    "i",
                                    { className: "material-icons" },
                                    "comment"
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "post-share" },
                        React.createElement(
                            "div",
                            { className: "action-button-inner" },
                            React.createElement(
                                "div",
                                { className: "post-comment-button", onClick: function onClick(e) {
                                        return copyPost(props.post._id, e);
                                    } },
                                "Share"
                            )
                        )
                    )
                )
            )
        )
    );
};
//returns all comment nodes
var commentNodes = function commentNodes(comments) {
    return comments.map(function (commentData) {
        var comment = commentData.parent;
        var children = React.createElement("div", null);
        //render out sub comments 
        if (commentData.children.length > 0) {
            children = commentNodes(commentData.children);
        }
        //highlighting for sharing comments
        var highlight = false;

        comment.myVal = 0;
        for (var i = 0; i < comment.voters.length; i++) {
            if (comment.voters[i].voter === myUser.username) {
                comment.myVal = comment.voters[i].value;
                break;
            }
        }
        //highlight if shared comment
        if ("" + comment._id === commentID) {
            highlight = true;
        }
        //check if user has a profile image to display
        if (!comment.photoUrl || comment.photoUrl === undefined) {
            comment.photoUrl = "./assets/img/user.png";
        }
        var date = getDate(comment.createdData);
        return React.createElement(
            "div",
            { key: comment._id },
            React.createElement(
                "div",
                { className: "post comment-post" },
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "post-header" },
                        React.createElement(
                            "div",
                            { className: "post-image" },
                            React.createElement("div", { className: "profile-image", style: { backgroundImage: "url('" + comment.photoUrl + "')" } })
                        ),
                        React.createElement(
                            "div",
                            { className: "post-details" },
                            React.createElement("div", { className: "post-author", dangerouslySetInnerHTML: { __html: comment.author } }),
                            React.createElement(
                                "div",
                                { className: "post-date" },
                                date
                            )
                        )
                    ),
                    React.createElement("p", { className: "post-title" + (highlight ? ' comment-highlight' : ''), dangerouslySetInnerHTML: { __html: comment.text } })
                ),
                React.createElement(
                    "div",
                    { className: "post-actions" },
                    React.createElement(
                        "div",
                        { className: "post-actions-inner" },
                        React.createElement(
                            "div",
                            { className: "post-vote" },
                            React.createElement(
                                "div",
                                { className: "action-button-inner" },
                                React.createElement(
                                    "div",
                                    { className: "vote", onClick: function onClick(e) {
                                            return doVote(comment, 1, 'comment', e);
                                        } },
                                    React.createElement(
                                        "i",
                                        { className: "material-icons" + (comment.myVal === 1 ? ' highlight' : '') },
                                        "sentiment_very_satisfied"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "vote", onClick: function onClick(e) {
                                            return doVote(comment, -1, 'comment', e);
                                        } },
                                    React.createElement(
                                        "i",
                                        { className: "material-icons" + (comment.myVal === -1 ? ' highlight' : '') },
                                        "sentiment_very_dissatisfied"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "rating" },
                                    React.createElement(
                                        "p",
                                        null,
                                        comment.rating
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "post-comment-div" },
                            React.createElement(
                                "div",
                                { className: "action-button-inner" },
                                React.createElement(
                                    "div",
                                    { className: "post-comment-button", onClick: commentPost.bind(this, comment._id, comment.text, false) },
                                    React.createElement(
                                        "i",
                                        { className: "material-icons" },
                                        "comment"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "post-share" },
                            React.createElement(
                                "div",
                                { className: "action-button-inner" },
                                React.createElement(
                                    "div",
                                    { className: "post-comment-button", onClick: function onClick(e) {
                                            return copyPostComment(comment.postId, comment._id, e);
                                        } },
                                    "Share"
                                )
                            )
                        )
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "padding-left" + (commentData.children.length > 0 ? ' margin-bottom' : '') },
                children
            )
        );
    });
};
//creates list of all comments related to this post
var CommentList = function CommentList(props) {
    //if there are no comments let user know
    if (props.comments.length === 0) {
        return React.createElement(
            "div",
            { className: "post-list" },
            React.createElement(
                "h3",
                { className: "empty-post" },
                "No one has commented on this post yet."
            )
        );
    }
    //otherwise fill div with comments
    var comments = commentNodes(props.comments);
    return React.createElement(
        "div",
        { className: "post-list" },
        comments
    );
};
//for to create new comment
var CommentForm = function CommentForm(props) {
    //get info about current post
    var myUrl = new URL(window.location.href);
    var _id = myUrl.searchParams.get('post');
    return React.createElement(
        "div",
        null,
        React.createElement(
            "form",
            { id: "comment-form",
                onSubmit: postComment,
                name: "comment-form",
                action: "/postComment",
                method: "POST",
                className: "comment-form" },
            React.createElement("div", { id: "comment-display" }),
            React.createElement("textarea", { id: "comment-text", type: "text", name: "text", placeholder: "What do you think about this post?" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { type: "hidden", name: "_postId", value: _id }),
            React.createElement("input", { id: "parent-id", type: "hidden", name: "parentId", value: "" }),
            React.createElement("input", { className: "make-comment-submit", type: "submit", value: "Submit" })
        )
    );
};
//do post comment
var postComment = function postComment(e) {
    e.preventDefault();

    $("#error-message-div").animate({ bottom: 'hide' }, 350);

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
"use strict";

//when a new post is tried to be submitted do this
var handlePost = function handlePost(e) {
    e.preventDefault();

    $("#error-message-div").animate({ bottom: 'hide' }, 350);

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
var PostForm = function PostForm(props) {
    return React.createElement(
        "form",
        { id: "post-form",
            onSubmit: handlePost,
            name: "post-form",
            action: "/maker",
            method: "POST",
            className: "post-form" },
        React.createElement("input", { id: "post-title", type: "text", name: "title", placeholder: "Put interesting title here" }),
        React.createElement("textarea", { id: "post-text", type: "text", name: "text", placeholder: "More Detail(optional)" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "make-post-submit", type: "submit", value: "Submit" })
    );
};
//make a component to hold all posts on site
var PostList = function PostList(props) {
    //if there has never ever been a post let the user know
    if (props.posts.length === 0) {
        return React.createElement(
            "div",
            { className: "post-list" },
            React.createElement(
                "h3",
                { className: "empty-post" },
                "No one's used the app yet :("
            )
        );
    }
    var posts = postNodes(props);
    return React.createElement(
        "div",
        { className: "post-list" },
        posts
    );
};
"use strict";

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
var MyPostList = function MyPostList(props) {
    //if the user hasn't posted anything let them know
    if (props.posts.length === 0) {
        return React.createElement(
            "div",
            { className: "post-list" },
            React.createElement(
                "h3",
                { className: "empty-post" },
                "You should post something!"
            )
        );
    }
    var posts = postNodes(props);
    return React.createElement(
        "div",
        { className: "post-list" },
        posts
    );
};
//make header with image selection
//(to change profile image)
var ProfileHeader = function ProfileHeader() {
    return React.createElement(
        "div",
        { id: "my-profile-header" },
        React.createElement(
            "div",
            { id: "my-header" },
            React.createElement(
                "div",
                { id: "header-name" },
                myUser.username
            ),
            React.createElement(
                "div",
                { id: "header-photo-div", onClick: function onClick(e) {
                        return doChange();
                    } },
                React.createElement("div", { id: "header-photo", style: { backgroundImage: "url(\"" + myUser.photoUrl + "\")" } }),
                React.createElement(
                    "div",
                    { id: "header-photo-backdrop" },
                    React.createElement(
                        "div",
                        { id: "header-photo-plus" },
                        "+"
                    ),
                    React.createElement("div", { className: "backdrop-fill" })
                )
            )
        )
    );
};
//function to change the user's profile image
var PhotoChanger = function PhotoChanger(props) {
    return (
        //hidden when not selected
        React.createElement(
            "div",
            { id: "change-holder", className: "" + (changePhoto ? '' : 'hidden') },
            React.createElement("div", { className: "backdrop-fill", onClick: function onClick(e) {
                    return doChange(e);
                } }),
            React.createElement(
                "div",
                { id: "change-form-div", className: "center-div" },
                React.createElement(
                    "form",
                    { id: "change-form",
                        onSubmit: handleChange,
                        name: "change-form",
                        action: "/changePhoto",
                        method: "POST" },
                    React.createElement(
                        "div",
                        { className: "center-div change-inner-div" },
                        React.createElement("input", { id: "change-title", type: "text", name: "photo", placeholder: "URL to Profile Image" }),
                        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                        React.createElement("input", { className: "make-post-submit", type: "submit", value: "Submit" })
                    )
                )
            )
        )
    );
};
//when a new post is tried to be submitted do this
var handleChange = function handleChange(e) {
    e.preventDefault();

    $("#error-message-div").animate({ bottom: 'hide' }, 350);

    //make sure post has valid data
    if ($("#change-title").val() == '') {
        handleError("A title is required in order to submit");
        return false;
    }
    //if post has valid data try to post it
    sendAjax('POST', $("#change-form").attr("action"), $("#change-form").serialize(), function () {
        myUser.photoUrl = "" + $("#change-title").val();
        redirect({ redirect: window.location.href });
    });

    return false;
};
"use strict";

//make toast messages to inform the user of errors
var handleError = function handleError(message) {
    $("#error-message").text(message);
    $("#error-message-div").animate({ bottom: 'toggle' }, 350, function () {
        setTimeout(function () {
            $("#error-message-div").animate({ bottom: 'toggle' }, 350);
        }, 2000);
    });
};
//do redirects
var redirect = function redirect(response) {
    $("#message").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};
//helper function to send ajax requests
var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            //handleError('errrororor');
            handleError(messageObj.error);
        }
    });
};
//Display to the user the post they are commenting on.
//is viewable near the text box where comments are made.
//"will have said parent comment in quotes"
var commentPost = function commentPost(id, text, isCommentPost) {
    var formCommentText = document.getElementById('comment-display');
    var formTextArea = document.getElementById('comment-text');
    var parent_id = document.getElementById('parent-id');

    parent_id.setAttribute('value', "" + id);
    if (isCommentPost) {
        formCommentText.innerHTML = '<div></div>';
        formTextArea.setAttribute('placeholder', 'What do you think about this post?');
        return;
    }
    formCommentText.innerHTML = "<div>&ldquo;" + text + "&rdquo;</div>";
    formTextArea.setAttribute('placeholder', 'What do you think about this comment?');
};

//cast a vote and highlight it so the user knows what they've done
//voting value alter depending on whether or not they have liked the post already
//and are changing their value
var doVote = function doVote(post, value, voteType, e) {
    var index = 0;
    var action = '/vote';
    if (value === 1) index = 1;

    var myButton = e.target.childNodes[0];
    var otherButton = e.target.parentElement.childNodes[index].childNodes[0];
    var rating = e.target.parentElement.childNodes[2].childNodes[0];

    if (voteType === 'comment') {
        action = '/voteComment';
    }

    sendAjax('POST', action, { id: post._id, value: value, _csrf: myCSRF }, function () {
        var multiplier = 1;
        if (myButton.classList.contains('highlight')) {
            multiplier = -1;
        }
        if (otherButton.classList.contains('highlight')) {
            multiplier = 2;
        }
        myButton.classList.toggle('highlight');
        otherButton.classList.remove('highlight');

        rating.innerHTML = Number(rating.innerHTML) + value * multiplier;
    });
};
//toggle the type of sorting method used throughout the application
var doSort = function doSort(e) {
    var myUrl = new URL(window.location.href);
    myUrl.searchParams.set('sort', e.target.value);
    window.location.href = myUrl;
    sort = e.target.value;
};
//toggle visibility of photo changer
var doChange = function doChange(e) {
    document.getElementById('change-holder').classList.toggle('hidden');
};
//helper function to get a random image from a list of images
var getRandomImage = function getRandomImage() {
    var images = ['pizza_ad_00.jpg', 'pizza_ad_01.jpg', 'pizza_ad_02.png', 'pizza_ad_03.jpg', 'pizza_ad_04.jpg', 'pizza_ad_05.jpg', 'pizza_ad_06.jpg'];
    var image = images[Math.floor(Math.random() * images.length)];
    return "./assets/img/" + image;
};
