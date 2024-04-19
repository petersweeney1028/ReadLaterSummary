chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  
    // Optionally save page information when clicked
    chrome.storage.sync.set({[tab.url]: new Date().toISOString()}, function() {
      console.log('Page URL and timestamp saved:', tab.url);
    });
  });
  