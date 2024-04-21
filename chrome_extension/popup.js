document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('savePageButton');
    button.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTab = tabs[0];
            fetch('https://read-later-summary-e391515c4221.herokuapp.com/api/save_article', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: activeTab.url,
                    title: activeTab.title
                })
            })
            .then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong with the server!');
            })
            .then(data => {
                console.log('Success:', data);
                document.getElementById('status').innerText = 'Page saved!';
            })
            .catch((error) => {
                console.error('Error:', error);
                document.getElementById('status').innerText = 'Save failed!';
            });
        });
    });
});
