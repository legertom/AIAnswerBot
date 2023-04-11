
chrome.runtime.sendMessage(
    { action: "fetchPageContent", url: document.location.href },
    (response) => {
      if (response.error) {
        console.error("Error fetching page content:", response.error);
      } else {
        window.pageContent = response.pageContent;
      }
    }
  );
  