
const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task');
const newTaskDateInput = document.getElementById('task-date');
const addTaskButton = document.getElementById('add-task');
const searchInput = document.getElementById('search');


function addTask(taskText, taskDate) {
    const li = document.createElement('li');
    
    const taskTextSpan = document.createElement('span');
    taskTextSpan.className = 'task-text';
    taskTextSpan.textContent = taskText;
    taskTextSpan.contentEditable = false;
    
    const taskDateInput = document.createElement('input');
    taskDateInput.type = 'date';
    taskDateInput.className = 'task-date';
    taskDateInput.value = taskDate;
    taskDateInput.disabled = true;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Usuń';
    deleteButton.className = 'delete';
    deleteButton.addEventListener('click', () => {
        li.remove();
        saveTasks();
    });

    li.addEventListener('click', (event) => {
        if (event.target !== deleteButton && event.target !== taskDateInput) {
            taskTextSpan.contentEditable = true;
            taskDateInput.disabled = false;
            taskTextSpan.focus();
        }
    });

    taskTextSpan.addEventListener('blur', () => {
        taskTextSpan.contentEditable = false;
        saveTasks();
    });

    taskDateInput.addEventListener('blur', () => {
        taskDateInput.disabled = true;
        saveTasks();
    });

    taskDateInput.addEventListener('click', (event) => {
        event.stopPropagation();
        taskDateInput.disabled = false;
        taskDateInput.focus();
    });

    li.appendChild(taskTextSpan);
    li.appendChild(taskDateInput);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
}

function isDateValid(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date === '' || selectedDate > today;
}

addTaskButton.addEventListener('click', () => {
    const taskText = newTaskInput.value.trim();
    const taskDate = newTaskDateInput.value;

    
    if (taskText.length >= 3 && taskText.length <= 255 && isDateValid(taskDate)) {
        addTask(taskText, taskDate);
        newTaskInput.value = '';  
        newTaskDateInput.value = ''; 
        saveTasks(); 
    } else {
        alert('Zadanie musi mieć od 3 do 255 znaków oraz datę w przyszłości lub pustą.');
    }
});


searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.toLowerCase();
    const tasks = document.querySelectorAll('#task-list li');

    tasks.forEach(task => {
        const taskTextSpan = task.querySelector('.task-text');
        const taskText = taskTextSpan.textContent.toLowerCase();

        
        if (taskText.includes(searchText) && searchText.length >= 2) {
            const regex = new RegExp(`(${searchText})`, 'gi');
            taskTextSpan.innerHTML = taskTextSpan.textContent.replace(regex, '<mark>$1</mark>');
            task.style.display = 'flex'; 
        } else {
            taskTextSpan.innerHTML = taskTextSpan.textContent; 
            task.style.display = searchText === '' ? 'flex' : 'none';
        }
    });
});


function saveTasks() {
    const tasks = [];
    const taskElements = document.querySelectorAll('#task-list li');

    taskElements.forEach(task => {
        const taskText = task.querySelector('.task-text').textContent;
        const taskDate = task.querySelector('.task-date').value;
        tasks.push({ text: taskText, date: taskDate });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task.text, task.date));
}


window.onload = loadTasks;
