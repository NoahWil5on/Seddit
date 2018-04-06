"use strict";

var handlePost = function handlePost(e) {
    e.preventDefault();

    $("#post-message").animate({ width: 'hide' }, 350);

    if ($("#post-name").val() == '' || $("#post-age").val() == '') {
        handleError("RAWR! All fields are required");
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
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "post-age", type: "text", name: "name", placeholder: "Post Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "post-age", type: "text", name: "age", placeholder: "Post Age" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "make-post-submit", type: "submit", value: "Make Post" })
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
        return React.createElement(
            "div",
            { key: post._id, className: "post" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", className: "post-face", alt: "post face" }),
            React.createElement(
                "h3",
                { className: "post-name" },
                " Name: ",
                post.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "post-age" },
                " Age: ",
                post.age,
                " "
            )
        );
    });
    return React.createElement(
        "div",
        { className: "post-list" },
        postNodes
    );
};
var loadPostsFromServer = function loadPostsFromServer() {
    sendAjax("GET", "/getposts", null, function (data) {
        ReactDOM.render(React.createElement(PostList, { posts: data.posts }), document.querySelector('#posts'));
    });
};
var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(PostForm, { csrf: csrf }), document.querySelector("#make-post"));
    ReactDOM.render(React.createElement(PostList, { posts: [] }), document.querySelector("#posts"));

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
    $("#errorMessage").text(message);
    $("#postMessage").animate({ width: 'toggle' }, 350);
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
