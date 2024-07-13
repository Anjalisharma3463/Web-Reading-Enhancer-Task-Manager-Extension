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


function saveHighlight(text) {
  chrome.storage.local.get({ highlights: [] }, (result) => {
    const highlights = result.highlights;
    highlights.push(text);
    chrome.storage.local.set({ highlights });
  });
}

 

function sendSelectedText(text) {
  if (text) {
    chrome.runtime.sendMessage({ action: 'setNote', text: text });
  }
}

 