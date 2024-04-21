document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('savePageButton').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.storage.sync.set({[activeTab.url]: new Date().toISOString()}, function() {
                document.getElementById('status').innerText = 'Page saved!';
            });
        });
    });
});
