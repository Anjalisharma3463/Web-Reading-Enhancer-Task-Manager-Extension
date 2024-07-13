chrome.contextMenus.create({
  id: "readText",
  title: "Read Aloud",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "readText") {
    chrome.tabs.sendMessage(tab.id, { action: "readText", text: info.selectionText });
  }
});
