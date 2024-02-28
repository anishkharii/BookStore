

function getCookie(cookieName) {

    var cookies = document.cookie.split(';');


    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();


        if (cookie.indexOf(cookieName + '=') === 0) {

            return cookie.substring(cookieName.length + 1, cookie.length);
        }
    }


    return null;
}

var myCookieValue = getCookie('userinfocookie');
let obj = decodeURIComponent(myCookieValue)
let jsonString = obj.replace(/^j:/, '');

var jsonObject = JSON.parse(jsonString);

