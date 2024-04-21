chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    }, () => {
        console.log('Script injected into:', tab.url);
    });
  
    // Optionally save page information when clicked
    chrome.storage.sync.set({[tab.url]: new Date().toISOString()}, function() {
      console.log('Page URL and timestamp saved:', tab.url);
    });
  });
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === "extractedData") {
            console.log("Data received from content script", request.data);
            // You can add code here to send the data to your server
            sendResponse({status: "Data received"});
        }
    }
);