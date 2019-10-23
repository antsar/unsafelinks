var unsafelinks = {

    unsafelink: function(messageHeader) {
        // Request the full message contents so we can do text replacement.
        browser.messages.getFull(messageHeader.id).then(unsafelinks.replaceInAllMessageParts);
    },

    replaceInAllMessageParts(messageOrPart) {
        // Iterate over each "part" of the message (i.e. text, html, etc.)
        for (partId in messageOrPart.parts) {
            part = messageOrPart.parts[partId];
            // Handle this part, if it has a body.
            if ('body' in part) {
                unsafelinks.replace(part);
            }
            // Recursively handle sub-parts.
            if ('parts' in part) {
                unsafelinks.replaceInAllMessageParts(part);
            }
        }
    },

    replace: function(messagePart) {
        // Replace each safelinks URL in the message body with the original URL.
        messagePart.body = part.body.replace(unsafelinks.urlRegex, unsafelinks.replacer);
        // TODO: This doesn't actually update the view!
    },

    // Regular expression matching a safelinks-encoded URL.
    urlRegex: /https?:\/\/(?:.+?\.)?safelinks\.protection\.outlook\.com\/([A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=%]*)/gi,

    replacer: function(url, queryString) {
        // Extract the "url" parameter from the URL, if it exists.
        var params = new URLSearchParams(queryString);
        if (params.has('url')) {
            return params.get('url');
        } else {
            return url;
        }
    },

    reloadTab: function(tabId) {
        browser.mailTabs.update(tabId, {});
    }
};

browser.messageDisplay.onMessageDisplayed.addListener((tabId, message) => {
    unsafelinks.unsafelink(message);
    unsafelinks.reloadTab(tabId);
});
