"use strict";

var myCSRF;
var myUsername;

//creates navigation menu
var Nav = function Nav(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "div",
            { id: "nav-inner" },
            React.createElement(
                "div",
                { className: "center-div nav-center", id: "nav-header", onClick: profile },
                React.createElement(
                    "a",
                    { href: "" },
                    React.createElement("div", { id: "logo", style: { backgroundImage: "url(\"./assets/img/user.png\")" } })
                ),
                React.createElement("p", { id: "nav-header-profile", dangerouslySetInnerHTML: { __html: props.name } })
            )
        ),
        React.createElement("div", { style: { clear: 'both' } }),
        React.createElement(
            "div",
            { id: "nav-options" },
            React.createElement(
                "div",
                { className: "nav-option-div" },
                React.createElement(
                    "p",
                    null,
                    "Home"
                ),
                React.createElement("a", { className: "nav-option-text", href: "", id: "home" })
            ),
            React.createElement(
                "div",
                { className: "nav-option-div" },
                React.createElement(
                    "p",
                    null,
                    "Profile"
                ),
                React.createElement("a", { className: "nav-option-text", href: "", id: "profile" })
            ),
            React.createElement(
                "div",
                { className: "nav-option-div" },
                React.createElement(
                    "p",
                    null,
                    "Log Out"
                ),
                React.createElement("a", { className: "nav-option-text", href: "/logout" })
            )
        )
    );
};
//create post (and ad) components
var postNodes = function postNodes(props) {
    return props.posts.map(function (post) {
        var date = getDate(post.createdData);

        //randomly creates add
        var ad = React.createElement("div", null);
        if (Math.floor(Math.random() * 3) === -1) {
            var pizzaImage = getRandomImage();
            ad = React.createElement(
                "div",
                { className: "ad-div" },
                React.createElement("img", { src: pizzaImage, alt: "fake ad" })
            );
        }
        post.myVal = 0;
        for (var i = 0; i < post.voters.length; i++) {
            if (post.voters[i].voter === myUsername) {
                post.myVal = post.voters[i].value;
                break;
            }
        }

        //creates post
        return React.createElement(
            "div",
            { key: post._id },
            React.createElement(
                "div",
                { className: "post" },
                React.createElement(
                    "div",
                    { className: "post-header" },
                    React.createElement(
                        "div",
                        { className: "post-image" },
                        React.createElement("div", { className: "profile-image", style: { backgroundImage: "url(./assets/img/user.png)" } })
                    ),
                    React.createElement(
                        "div",
                        { className: "post-details" },
                        React.createElement("div", { className: "post-author", dangerouslySetInnerHTML: { __html: post.author } }),
                        React.createElement(
                            "div",
                            { className: "post-date" },
                            date
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "post-content", onClick: goToPost.bind(this, post._id) },
                    React.createElement("h3", { className: "post-title", dangerouslySetInnerHTML: { __html: post.title } })
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
                                            return doVote(post, 1, 'post', e);
                                        } },
                                    React.createElement(
                                        "i",
                                        { className: "material-icons" + (post.myVal === 1 ? ' highlight' : '') },
                                        "sentiment_very_satisfied"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "vote", onClick: function onClick(e) {
                                            return doVote(post, -1, 'post', e);
                                        } },
                                    React.createElement(
                                        "i",
                                        { className: "material-icons" + (post.myVal === -1 ? ' highlight' : '') },
                                        "sentiment_very_dissatisfied"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "rating" },
                                    React.createElement(
                                        "p",
                                        null,
                                        post.rating
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
                                    { className: "post-comment-button", onClick: goToPost.bind(this, post._id) },
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
                                    { className: "post-comment-button", onClick: copyPost.bind(this, post._id) },
                                    "Share"
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
                // setInterval(() => {
                //     data.posts[0].rating++;
                //     console.log(data.posts[0].rating);
                // }, 2000);

                ReactDOM.render(React.createElement(PostList, { posts: data.posts }), document.querySelector('#posts'));
                $("#post-form").find("input[type=text], textarea").val("");
            });
            break;
        case 'comments':
            var myUrl = new URL(window.location.href);
            var post = myUrl.searchParams.get('post');
            //get specific post from server
            sendAjax("GET", "/getPost?post=" + post, null, function (data) {
                ReactDOM.render(React.createElement(Post, { post: data.post }), document.querySelector('#post'));
                $("#comment-form").find("input[type=text], textarea").val("");
            });
            //get all comments from specific post
            sendAjax("GET", "/getComments?post=" + post, null, function (data) {
                ReactDOM.render(React.createElement(CommentList, { comments: data.comments }), document.querySelector('#comments'));
                $("#comment-form").find("input[type=text], textarea").val("");
                if (commentID != undefined) {
                    var mainComment = document.getElementsByClassName('comment-highlight')[0];
                    window.scrollTo(0, mainComment.parentElement.getBoundingClientRect().top);
                }
            });
            break;
        case 'profile':
            //get all of this user's posts
            sendAjax("GET", "/getMyPosts", null, function (data) {
                ReactDOM.render(React.createElement(MyPostList, { posts: data.posts }), document.querySelector('#my-posts'));
            });
            break;
        default:
            break;
    }
};
//set links and styles of the navigation menu
var setupNav = function setupNav() {
    var home = document.getElementById('home');
    var profile = document.getElementById('profile');
    var url = window.location.href.split('?')[0];

    home.setAttribute('href', url + "?location=home");
    profile.setAttribute('href', url + "?location=profile");

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
var setup = function setup(csrf, username) {
    myUsername = username;

    ReactDOM.render(React.createElement(Nav, { name: username }), document.querySelector("#nav-div"));
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
        setup(result.token.csrfToken, result.name);
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
    props.post.myVal = 0;
    for (var i = 0; i < props.post.voters.length; i++) {
        if (props.post.voters[i].voter === myUsername) {
            props.post.myVal = props.post.voters[i].value;
            break;
        }
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
                    React.createElement("div", { className: "profile-image", style: { backgroundImage: "url(./assets/img/user.png)" } })
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
var commentNodes = function commentNodes(props) {
    return props.comments.map(function (comment) {
        var highlight = false;

        comment.myVal = 0;
        for (var i = 0; i < comment.voters.length; i++) {
            if (comment.voters[i].voter === myUsername) {
                comment.myVal = comment.voters[i].value;
                break;
            }
        }
        if ("" + comment._id === commentID) {
            highlight = true;
        }
        var date = getDate(comment.createdData);
        return React.createElement(
            "div",
            { key: comment._id, className: "post comment-post" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "post-header" },
                    React.createElement(
                        "div",
                        { className: "post-image" },
                        React.createElement("div", { className: "profile-image", style: { backgroundImage: "url(./assets/img/user.png)" } })
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
    var comments = commentNodes(props);
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
        "form",
        { id: "comment-form",
            onSubmit: postComment,
            name: "comment-form",
            action: "/postComment",
            method: "POST",
            className: "comment-form" },
        React.createElement("textarea", { id: "comment-text", type: "text", name: "text", placeholder: "What do you think about this post?" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { type: "hidden", name: "_postId", value: _id }),
        React.createElement("input", { className: "make-comment-submit", type: "submit", value: "Submit" })
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
            console.dir(xhr);
            //var messageObj = JSON.parse(xhr.responseText);
            handleError('errrororor');
            //handleError(messageObj.error);
        }
    });
};
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
//helper function to get a random image from a list of images
var getRandomImage = function getRandomImage() {
    var images = ['pizza_ad_00.jpg', 'pizza_ad_01.jpg', 'pizza_ad_02.png', 'pizza_ad_03.jpg', 'pizza_ad_04.jpg', 'pizza_ad_05.jpg', 'pizza_ad_06.jpg'];
    var image = images[Math.floor(Math.random() * images.length)];
    return "./assets/img/" + image;
};
