document.body.style.border = "5px solid blue";  // Visual confirmation that the script has loaded

console.log('Content script active on:', window.location.href);

function handleDOMContent() {
    const extractedData = {
        title: document.title,
        url: window.location.href,
        text: document.body.innerText
    };

    console.log("Extracted Data:", extractedData);
    chrome.runtime.sendMessage({type: "extractedData", data: extractedData}, response => {
        console.log("Response from background:", response);
    });
}

if (document.readyState === "complete" || document.readyState === "interactive") {
    handleDOMContent();
} else {
    document.addEventListener('DOMContentLoaded', handleDOMContent);
}

