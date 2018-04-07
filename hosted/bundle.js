"use strict";

var handlePost = function handlePost(e) {
    e.preventDefault();

    $("#post-message").animate({ width: 'hide' }, 350);

    if ($("#post-title").val() == '') {
        handleError("A title is required in order to submit");
        return false;
    }
    sendAjax('POST', $("#post-form").attr("action"), $("#post-form").serialize(), function () {
        loadPostsFromServer();
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
                "No Posts yet"
            )
        );
    }
    var postNodes = props.posts.map(function (post) {
        var ad = React.createElement("div", null);
        // if(Math.floor(Math.random() * 3) === 1){
        //     ad = (
        //         <div class="add-div">
        //             You just got an add!
        //         </div>
        //     )
        // }
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { key: post._id, className: "post" },
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
                        React.createElement(
                            "div",
                            { className: "post-author" },
                            "Person Name"
                        ),
                        React.createElement(
                            "div",
                            { className: "post-date" },
                            "04/02/18"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "post-content" },
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
                                    "+"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "vote" },
                                    "-"
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
                                    { className: "post-comment" },
                                    "5"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "post-comment-button" },
                                    "MM"
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
                                    { className: "post-comment-button" },
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
    return React.createElement(
        "div",
        { className: "post-list" },
        postNodes
    );
};
var loadPostsFromServer = function loadPostsFromServer() {
    sendAjax("GET", "/getPosts", null, function (data) {
        ReactDOM.render(React.createElement(PostList, { posts: data.posts }), document.querySelector('#posts'));
    });
    sendAjax("GET", "/getMyPosts", null, function (data) {
        ReactDOM.render(React.createElement(PostList, { posts: data.posts }), document.querySelector('#my-posts'));
    });
};
var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(PostForm, { csrf: csrf }), document.querySelector("#make-post"));
    ReactDOM.render(React.createElement(PostList, { posts: [] }), document.querySelector("#posts"));
    ReactDOM.render(React.createElement(PostList, { posts: [] }), document.querySelector("#my-posts"));

    loadPostsFromServer();
};
var getToken = function getToken() {
    sendAjax("GET", '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    // $("#errorMessage").text(message);
    // $("#postMessage").animate({width:'toggle'}, 350);
};

var redirect = function redirect(response) {
    $("#postMessage").animate({ width: 'hide' }, 350);
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
