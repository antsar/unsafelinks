// Listen for the "window loaded" event and initialize.
window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false);
    unsafelinks.init();
}, false);

var unsafelinks = {
    init: function() {
        // Listen for the "message loaded" event, if this is a message window.
        var messagepane = document.getElementById("messagepane");
        if (messagepane) {
            messagepane.addEventListener("load", unsafelinks.onMessageLoad, true);
        }
    },

    onMessageLoad: function(event) {
        // Replace each safelinks URL in the message body with the original URL.
        var body = event.originalTarget.body;
        body.innerHTML = body.innerHTML.replace(unsafelinks.urlRegex, unsafelinks.replacer);
    },

    // Regular expression matching a safelinks-encoded URL.
    urlRegex: /https?:\/\/(?:.+?\.)?safelinks\.protection\.outlook\.com\/([A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=%]*)/gi,

    replacer: function(url, queryString){
        // Extract the "url" parameter from the URL, if it exists.
        var params = new URLSearchParams(queryString);
        if (params.has('url')) {
            return params.get('url');
        } else {
            return url;
        }
    },
};
