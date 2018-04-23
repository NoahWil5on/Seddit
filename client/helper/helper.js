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
            console.dir(xhr);
            //var messageObj = JSON.parse(xhr.responseText);
            handleError('errrororor');
            //handleError(messageObj.error);
        }
    })
}
const doVote = (post, value, voteType, e) => {
    var index = 0;
    var action = '/vote'
    if(value === 1) index = 1;

    var myButton = e.target.childNodes[0];
    var otherButton = e.target.parentElement.childNodes[index].childNodes[0];
    var rating = e.target.parentElement.childNodes[2].childNodes[0];

    if(voteType === 'comment'){
        action = '/voteComment'
    }

    sendAjax('POST', action, {id: post._id, value, _csrf: myCSRF}, () => {
        var multiplier = 1;
        if(myButton.classList.contains('highlight')){
            multiplier = -1;
        }
        if(otherButton.classList.contains('highlight')){
            multiplier = 2;
        }
        myButton.classList.toggle('highlight');
        otherButton.classList.remove('highlight');

        rating.innerHTML = Number(rating.innerHTML) + value * multiplier;
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