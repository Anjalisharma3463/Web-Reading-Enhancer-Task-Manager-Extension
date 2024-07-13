document.addEventListener('DOMContentLoaded', function() {
  loadTasks();
  loadNote();
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(message) {
  if (message.action === 'setNote') {
    const noteInput = document.getElementById('noteInput');
    noteInput.value += (noteInput.value ? '\n' : '') + message.text;
    saveNote();
  }
});

document.getElementById('saveNote').addEventListener('click', () => {
  const note = document.getElementById('notes').value;
  chrome.storage.local.get({ notes: [] }, (result) => {
    const notes = result.notes;
    notes.push(note);
    chrome.storage.local.set({ notes });
  });
});

document.getElementById('addTask').addEventListener('click', function() {
  const taskInput = document.getElementById('taskInput');
  const task = taskInput.value.trim();
  if (task) {
    addTask(task);
    taskInput.value = '';
  }
});

document.getElementById('saveNote').addEventListener('click', function() {
  saveNote();
});

// document.getElementById('toggleDistractionFree').addEventListener('click', function() {
//   document.body.classList.toggle('distraction-free-mode');
//   console.log('Toggled distraction-free mode');
// });


document.getElementById('toggleDistractionFree').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleDistractionFree' });
  });
});


function addTask(task) {
  chrome.storage.sync.get({ tasks: [] }, function(result) {
    const tasks = result.tasks;
    tasks.push(task);
    chrome.storage.sync.set({ tasks: tasks }, function() {
      console.log('Task saved:', task);
      displayTasks();
    });
  });
}

function displayTasks() {
  chrome.storage.sync.get({ tasks: [] }, function(result) {
    const tasks = result.tasks;
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear the list

    tasks.forEach(function(task, index) {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task';
      taskDiv.innerHTML = `
        <span>${task}</span>
        <button class="removeTask" data-index="${index}">Remove</button>
      `;
      taskList.appendChild(taskDiv);
    });

    document.querySelectorAll('.removeTask').forEach(button => {
      button.addEventListener('click', function() {
        removeTask(button.dataset.index);
      });
    });
  });
}

function removeTask(index) {
  chrome.storage.sync.get({ tasks: [] }, function(result) {
    const tasks = result.tasks;

    if (index < 0 || index >= tasks.length) {
      console.error('Invalid task index:', index);
      return;
    }

    tasks.splice(index, 1); // Remove task at index

    chrome.storage.sync.set({ tasks: tasks }, function() {
      console.log('Task removed:', index);
      displayTasks(); // Refresh the task list
    });
  });
}

function loadTasks() {
  displayTasks();
}

function loadNote() {
  chrome.storage.sync.get('userNote', function(result) {
    if (result.userNote) {
      document.getElementById('noteInput').value = result.userNote;
      console.log('Note loaded:', result.userNote);
    }
  });
}

function saveNote() {
  const note = document.getElementById('noteInput').value;
  chrome.storage.sync.set({ 'userNote': note }, function() {
    console.log('Note saved:', note);
  });
}
