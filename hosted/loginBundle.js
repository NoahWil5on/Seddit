"use strict";

//when login is submitted do this
var handleLogin = function handleLogin(e) {
    e.preventDefault();

    $("#error-message-div").animate({ bottom: 'hide' }, 350);

    //make sure data is valid
    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    console.log($("input[name-_csrf]").val());

    //if valid data try to post it
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};
//when signup is submitted do this
var handleSignup = function handleSignup(e) {
    e.preventDefault();

    $("#error-message-div").animate({ bottom: 'hide' }, 350);

    //make sure info is valid
    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '' || $("#email").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }
    //if valid data try to post it
    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};
//make login component
var LoginWindow = function LoginWindow(props) {
    return React.createElement(
        "div",
        { className: "form-div" },
        React.createElement(
            "div",
            { className: "form-head" },
            React.createElement(
                "p",
                null,
                "Welcome!"
            )
        ),
        React.createElement(
            "form",
            { id: "loginForm", name: "loginForm",
                onSubmit: handleLogin,
                action: "/login",
                method: "POST",
                className: "mainForm" },
            React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
            React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement(
                "div",
                null,
                React.createElement("input", { className: "submit-button", type: "submit", value: "Sign in" })
            ),
            React.createElement(
                "p",
                { className: "forgot", onClick: function onClick(e) {
                        return doForgot(e, props);
                    } },
                "Forgot Password"
            )
        )
    );
};
//change to forgot password window
var doForgot = function doForgot(e, props) {
    ReactDOM.render(React.createElement(ForgotWindow, { csrf: props.csrf }), document.querySelector('#content'));
};
//render forgot window
var ForgotWindow = function ForgotWindow(props) {
    return React.createElement(
        "div",
        { className: "form-div" },
        React.createElement(
            "div",
            { className: "form-head" },
            React.createElement(
                "p",
                null,
                "Forgot Password?"
            )
        ),
        React.createElement(
            "form",
            { id: "forgotForm", name: "forgotForm",
                onSubmit: handleEmailCheck,
                action: "/checkEmail",
                method: "POST",
                className: "mainForm" },
            React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "Username" }),
            React.createElement("input", { id: "email", type: "email", name: "email", placeholder: "Email" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement(
                "div",
                null,
                React.createElement("input", { className: "submit-button", type: "submit", value: "Submit" })
            )
        )
    );
};
//make sure email is valid with account
var handleEmailCheck = function handleEmailCheck(e) {
    e.preventDefault();

    $("#error-message-div").animate({ bottom: 'hide' }, 350);

    //make sure info is valid
    if ($("#user").val() == '' || $("#email").val() == '') {
        handleError("All fields are required");
        return false;
    }
    //if valid data try to post it
    sendAjax('POST', $("#forgotForm").attr("action"), $("#forgotForm").serialize(), function (data) {
        if (data.doReset) {
            ReactDOM.render(React.createElement(ChangeWindow, { csrf: document.getElementsByName('_csrf')[0].value, code: data.code }), document.querySelector('#content'));
        }
    });

    return false;
};
//password change window 
//comes after the server has confirmed that this is indeed the
//right user
var ChangeWindow = function ChangeWindow(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h2",
            null,
            "Secret Code: ",
            props.code
        ),
        React.createElement(
            "p",
            null,
            "In a real application the code would be emailed to you"
        ),
        React.createElement(
            "div",
            { className: "form-div" },
            React.createElement(
                "div",
                { className: "form-head" },
                React.createElement(
                    "p",
                    null,
                    "Reset Password"
                )
            ),
            React.createElement(
                "form",
                { id: "resetForm", name: "resetForm",
                    onSubmit: handResetPassword,
                    action: "/resetPassword",
                    method: "POST",
                    className: "mainForm" },
                React.createElement("input", { id: "code", type: "text", name: "code", placeholder: "Enter Secret Code" }),
                React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
                React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", { className: "submit-button", type: "submit", value: "Reset" })
                )
            )
        )
    );
};
//handles submitting password reset post and making sure information is correctly validated
var handResetPassword = function handResetPassword(e) {
    e.preventDefault();

    $("#error-message-div").animate({ bottom: 'hide' }, 350);

    //make sure info is valid
    if ($("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }
    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords must be the same");
        return false;
    }
    if (document.getElementById('code').value.length !== 6) {
        handleError("Secret code must be 6 characters long");
        return false;
    }
    //if valid data try to post it
    sendAjax('POST', $("#resetForm").attr("action"), $("#resetForm").serialize(), redirect);

    return false;
};
//make signup component
var SignupWindow = function SignupWindow(props) {
    return React.createElement(
        "div",
        { className: "form-div" },
        React.createElement(
            "div",
            { className: "form-head" },
            React.createElement(
                "p",
                null,
                "Welcome!"
            )
        ),
        React.createElement(
            "form",
            { id: "signupForm", name: "signupForm",
                onSubmit: handleSignup,
                action: "/signup",
                method: "POST",
                className: "mainForm" },
            React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
            React.createElement("input", { id: "email", type: "email", name: "email", placeholder: "Email" }),
            React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
            React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement(
                "div",
                null,
                React.createElement("input", { className: "submit-button", type: "submit", value: "Sign up" })
            )
        )
    );
};
//create login component in id=content
var createLoginWindow = function createLoginWindow(csrf) {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector('#content'));
};
//create signup component in id=content
var createSignupWindow = function createSignupWindow(csrf) {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector('#content'));
};
//setup event listeners for nav button clicks
var setup = function setup(csrf) {
    var loginButton = document.querySelector("#loginButton");
    var signupButton = document.querySelector("#signupButton");
    signupButton.addEventListener("click", function (e) {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });
    loginButton.addEventListener("click", function (e) {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    //start user off by making the login components
    createLoginWindow(csrf);
};
//get csrf token to prevent against malicious activity
var getToken = function getToken() {
    sendAjax("GET", '/getToken', null, function (result) {
        setup(result.token.csrfToken);
    });
};
//when document is ready hide toast message and get csrf token
$(document).ready(function () {
    $("#error-message-div").animate({ bottom: 'hide' }, 0);
    getToken();
});
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
