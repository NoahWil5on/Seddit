"use strict";

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
var postNodes = function postNodes(props) {
    return props.posts.map(function (post) {
        var date = getDate(post.createdData);

        var ad = React.createElement("div", null);
        if (Math.floor(Math.random() * 3) === 1) {
            var pizzaImage = getRandomImage();
            ad = React.createElement(
                "div",
                { className: "ad-div" },
                React.createElement("img", { src: pizzaImage, alt: "fake ad" })
            );
        }
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
                                    { className: "vote" },
                                    React.createElement(
                                        "i",
                                        { className: "material-icons" },
                                        "sentiment_very_satisfied"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "vote" },
                                    React.createElement(
                                        "i",
                                        { className: "material-icons" },
                                        "sentiment_very_dissatisfied"
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
var loadDataFromServer = function loadDataFromServer() {
    switch (state) {
        case 'home':
            sendAjax("GET", "/getPosts", null, function (data) {
                ReactDOM.render(React.createElement(PostList, { posts: data.posts }), document.querySelector('#posts'));
                $("#post-form").find("input[type=text], textarea").val("");
            });
            break;
        case 'comments':
            var myUrl = new URL(window.location.href);
            var post = myUrl.searchParams.get('post');
            sendAjax("GET", "/getPost?post=" + post, null, function (data) {
                ReactDOM.render(React.createElement(Post, { post: data.post }), document.querySelector('#post'));
                $("#comment-form").find("input[type=text], textarea").val("");
            });
            sendAjax("GET", "/getComments?post=" + post, null, function (data) {
                ReactDOM.render(React.createElement(CommentList, { comments: data.comments }), document.querySelector('#comments'));
                $("#comment-form").find("input[type=text], textarea").val("");
            });
            break;
        case 'profile':
            sendAjax("GET", "/getMyPosts", null, function (data) {
                ReactDOM.render(React.createElement(MyPostList, { posts: data.posts }), document.querySelector('#my-posts'));
            });
            break;
        default:
            break;
    }
};
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
var setup = function setup(csrf, username) {
    ReactDOM.render(React.createElement(Nav, { name: username }), document.querySelector("#nav-div"));
    setupNav();
    switch (state) {
        case 'home':
            ReactDOM.render(React.createElement(PostForm, { csrf: csrf }), document.querySelector("#make-post"));
            ReactDOM.render(React.createElement(PostList, { posts: [] }), document.querySelector("#posts"));
            break;
        case 'comments':
            ReactDOM.render(React.createElement(Post, { post: {} }), document.querySelector("#post"));
            ReactDOM.render(React.createElement(CommentForm, { csrf: csrf }), document.querySelector("#make-comment"));
            ReactDOM.render(React.createElement(CommentList, { comments: [] }), document.querySelector('#comments'));
            var new_width = $('#main').width();
            $('#make-comment').width(new_width);

            $(window).resize(function () {
                new_width = $('#main').width();
                $('#make-comment').width(new_width);
            });
            break;
        case 'profile':
            ReactDOM.render(React.createElement(MyPostList, { posts: [] }), document.querySelector("#my-posts"));
            break;
        default:
            break;
    }
    loadDataFromServer();
};
var getToken = function getToken() {
    sendAjax("GET", '/getToken', null, function (result) {
        setup(result.token.csrfToken, result.name);
    });
};

$(document).ready(function () {
    $("#error-message-div").animate({ bottom: 'hide' }, 0);
    getToken();
});
"use strict";

var Post = function Post(props) {
    if (props.post === {}) {
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
    var date = getDate(props.post.createdData);
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
                                { className: "vote" },
                                React.createElement(
                                    "i",
                                    { className: "material-icons" },
                                    "sentiment_very_satisfied"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "vote" },
                                React.createElement(
                                    "i",
                                    { className: "material-icons" },
                                    "sentiment_very_dissatisfied"
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
                                { className: "post-comment-button", onClick: copyPost },
                                "Share"
                            )
                        )
                    )
                )
            )
        )
    );
};
var commentNodes = function commentNodes(props) {
    return props.comments.map(function (comment) {
        var date = getDate(comment.createdData);
        return React.createElement(
            "div",
            { key: comment._id, className: "post comment-post" },
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
            React.createElement("p", { className: "post-title", dangerouslySetInnerHTML: { __html: comment.text } })
        );
    });
};
var CommentList = function CommentList(props) {
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
    var comments = commentNodes(props);
    return React.createElement(
        "div",
        { className: "post-list" },
        comments
    );
};
var CommentForm = function CommentForm(props) {
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
var postComment = function postComment(e) {
    e.preventDefault();

    $("#error-message-div").animate({ bottom: 'hide' }, 350);

    if ($("#comment-text").val() == '') {
        handleError("Text is required in order to comment");
        return false;
    }
    sendAjax('POST', $("#comment-form").attr("action"), $("#comment-form").serialize(), function () {
        loadDataFromServer();
    });

    return false;
};
"use strict";

var handlePost = function handlePost(e) {
    e.preventDefault();

    $("#error-message-div").animate({ bottom: 'hide' }, 350);

    if ($("#post-title").val() == '') {
        handleError("A title is required in order to submit");
        return false;
    }
    sendAjax('POST', $("#post-form").attr("action"), $("#post-form").serialize(), function () {
        loadDataFromServer();
    });

    return false;
};
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
var PostList = function PostList(props) {
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

var MyPostList = function MyPostList(props) {
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

var handleError = function handleError(message) {
    $("#error-message").text(message);
    $("#error-message-div").animate({ bottom: 'toggle' }, 350, function () {
        setTimeout(function () {
            $("#error-message-div").animate({ bottom: 'toggle' }, 350);
        }, 2000);
    });
};

var redirect = function redirect(response) {
    $("#message").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

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
            handleError(messageObj.error);
        }
    });
};
var getRandomImage = function getRandomImage() {
    var images = ['pizza_ad_00.jpg', 'pizza_ad_01.jpg', 'pizza_ad_02.png', 'pizza_ad_03.jpg', 'pizza_ad_04.jpg', 'pizza_ad_05.jpg', 'pizza_ad_06.jpg'];
    var image = images[Math.floor(Math.random() * images.length)];
    return "./assets/img/" + image;
};
