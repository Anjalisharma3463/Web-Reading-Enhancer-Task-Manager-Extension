document.addEventListener('DOMContentLoaded', function() {
  loadTasks();
  loadNote();
 
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

 

function addTask(task) {
  chrome.storage.sync.get({ tasks: [] }, function(result) {

// agar koi pichla data ya task tha to hamne pehle use dikhane k liye user ko nikal liya h atask ko or data ko ..

// update the new tasks array from previous tasks aray 
    const tasks = result.tasks;
    tasks.push(task); // new atask push kr diya 
    chrome.storage.sync.set({ tasks: tasks }, function() { //yaha purane tasks array ki value new array ki values set or update kr diya
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
