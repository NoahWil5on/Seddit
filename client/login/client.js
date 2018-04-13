//when login is submitted do this
const handleLogin = (e) => {
    e.preventDefault();

    $("#error-message-div").animate({bottom:'hide'}, 350);

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
const handleSignup = (e) => {
    e.preventDefault();

    $("#error-message-div").animate({bottom:'hide'}, 350);

    //make sure info is valid
    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
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
const LoginWindow = (props) => {
    return (
        <div className="form-div">
            <div className="form-head">
            <p>Welcome!</p>
            </div>
            <form id="loginForm" name="loginForm"
                onSubmit={handleLogin}
                action="/login"
                method="POST"
                className="mainForm">
                <input id="user" type="text" name="username" placeholder="username" />
                <input id="pass" type="password" name="pass" placeholder="password" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <div>
                    <input className="submit-button" type="submit" value="Sign in" />
                </div>
            </form>
        </div>
    );
};
//make signup component
const SignupWindow = (props) => {
    return (
        <div className="form-div">
            <div className="form-head">
            <p>Welcome!</p>
            </div>
            <form id="signupForm" name="signupForm"
                onSubmit={handleSignup}
                action="/signup"
                method="POST"
                className="mainForm">
                <input id="user" type="text" name="username" placeholder="username" />
                <input id="pass" type="password" name="pass" placeholder="password" />
                <input id="pass2" type="password" name="pass2" placeholder="retype password" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <div>
                    <input className="submit-button" type="submit" value="Sign up" />
                </div>
            </form>
        </div>
    );
};
//create login component in id=content
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};
//create signup component in id=content
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};
//setup event listeners for nav button clicks
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
     signupButton.addEventListener("click", (e) => {
         e.preventDefault();
         createSignupWindow(csrf);
         return false;
     });
     loginButton.addEventListener("click", (e) => {
         e.preventDefault();
         createLoginWindow(csrf);
         return false;
     });

     //start user off by making the login components
     createLoginWindow(csrf);
};
//get csrf token to prevent against malicious activity
const getToken = () => {
    sendAjax("GET", '/getToken', null, (result) => {
        setup(result.token.csrfToken);
    });
};
//when document is ready hide toast message and get csrf token
$(document).ready(function() {
    $("#error-message-div").animate({bottom:'hide'}, 0);
    getToken();
});