
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchPageContent") {
      fetch(request.url)
        .then((response) => response.text())
        .then((text) => {
          sendResponse({ pageContent: text });
        })
        .catch((error) => {
          sendResponse({ error: error.message });
        });
      return true;
    }
  });
  