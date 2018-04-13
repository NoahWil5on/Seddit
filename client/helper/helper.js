//make toast messages to inform the user of errors
const handleError = (message) => {
    $("#error-message").text(message);
    $("#error-message-div").animate({bottom:'toggle'}, 350, () => {
        setTimeout(() => {
            $("#error-message-div").animate({bottom:'toggle'}, 350);
        }, 2000);
    });
};
//do redirects
const redirect = (response) => {
    $("#message").animate({width:'hide'},350);
    window.location = response.redirect;
};
//helper function to send ajax requests
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
//helper function to get a random image from a list of images
const getRandomImage = () => {
    var images = [
        'pizza_ad_00.jpg',
        'pizza_ad_01.jpg',
        'pizza_ad_02.png',
        'pizza_ad_03.jpg',
        'pizza_ad_04.jpg',
        'pizza_ad_05.jpg',
        'pizza_ad_06.jpg',
    ];
    var image = images[Math.floor(Math.random() * images.length)];
    return `./assets/img/${image}`;
}