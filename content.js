chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "readText") {
    const utterance = new SpeechSynthesisUtterance(message.text);
    speechSynthesis.speak(utterance);
  }
});

// Highlight Text and Save to Note
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString();
  if (selectedText.length > 0) {
    const span = document.createElement('span');
    span.style.backgroundColor = 'green';
    const range = window.getSelection().getRangeAt(0);
    range.surroundContents(span);
    saveHighlight(span.textContent)
    sendSelectedText(span.textContent);
  }
});

 


// chrome.tabs.query() //Gets all tabs that have the specified properties, or all tabs if no properties are specified.