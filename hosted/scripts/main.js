let state;

//figure out what page the user is on.
function appSetup() {
    var myUrl = new URL(window.location.href);
    var location = myUrl.searchParams.get('location');
    if (!location || location === undefined) {
        state = 'home';
    } else {
        state = location;
    }
}
//make a formatted date string
function getDate(dateObject){
    var date = new Date(dateObject);
    var month = date.getMonth();
    var year = date.getFullYear();
    var day = date.getDate();

    return `${month+1}/${day}/${year}`;    
}

//https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
//copy text to your clipboard
function copyPost(id, e){
    var text = window.location.href;
    if(state !== 'comments'){
        text = window.location.href.split('?')[0];
        text = `${text}?location=comments&post=${id}`;
    }

    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        handleError('Link copied to clipboard');
        return clipboardData.setData("Text", text); 
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            var copy =  document.execCommand("copy");  // Security exception may be thrown by some browsers.
            handleError('Link copied to clipboard');
            return copy;
        } catch (e) {
            handleError('Failed to copy');
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}
//go to post page of specific id
function goToPost(id, e){
    var url = window.location.href.split('?')[0];
    url += `?location=comments&post=${id}`;
    window.location.href = url;
}
//go to profile page
function profile(){
    var url = window.location.href.split('?')[0];
    url += '?location=profile';
    window.location.href = url;
}
//wait for window to do stuff
window.onload = appSetup();