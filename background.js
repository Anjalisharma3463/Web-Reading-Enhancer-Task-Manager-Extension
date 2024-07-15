
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "readText") {
    // / menuItemId is propert of this onClicked
    chrome.tabs.sendMessage(tab.id, { action: "readText", text: info.selectionText });

    // Sends a single message to the content script(s) in the specified tab, with an optional callback to run when a response is sent back. The runtime.onMessage event is fired in each content script running in the specified tab for the current extension
 
    // this message sending to content.js 
    // message is this -> { action: "readText", text: info.selectionText })
  }
});
 

// chrome.tabs.sendMessage(
//   tabId: number,
//   message: any,
//   options?: object,
//   callback?: function,
// )

// Sends a single message to the content script(s) in the specified tab, with an optional callback to run when a response is sent back. The runtime.onMessage event is fired in each content script running in the specified tab for the current extension.

// PARAMETERS
// tabId
// number

// message
// any

// The message to send. This message should be a JSON-ifiable object.

// options
// object optional

// documentId
// string optional

// Chrome 106+
// Send a message to a specific document identified by documentId instead of all frames in the tab.

// frameId
// number optional

// Send a message to a specific frame identified by frameId instead of all frames in the tab.

// callback
// function optional

// Chrome 99+
// The callback parameter looks like: