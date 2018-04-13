const handleError = (message) => {
    $("#error-message").text(message);
    $("#error-message-div").animate({bottom:'toggle'}, 350, () => {
        setTimeout(() => {
            $("#error-message-div").animate({bottom:'toggle'}, 350);
        }, 2000);
    });
};

const redirect = (response) => {
    $("#message").animate({width:'hide'},350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error){
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    })
}