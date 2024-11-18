const addTaskButton = document.querySelector('.addTaskButton');
const taskInput = document.querySelector('.todo-input');
const deadlineInput = document.querySelector('input[name="deadline"]');
const tasksList = document.getElementById('tasks');

function saveTasksToLocalStorage() {
    const tasks = [];
    tasksList.querySelectorAll('li').forEach(taskItem => {
        const taskName = taskItem.querySelector('span').textContent;
        const taskDate = taskItem.querySelector('.task-date').textContent;
        const isCompleted = taskItem.querySelector('input[type="checkbox"]').checked;
        tasks.push({ taskName, taskDate, isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(task => {
        const newTask = document.createElement('li');
        newTask.classList.add('tab-content');
        newTask.innerHTML = `
            <div>
                <input type="checkbox" ${task.isCompleted ? 'checked' : ''}>
                <span>${task.taskName}</span>
            </div>
            <div>
                <span class="task-date">${task.taskDate}</span>
            </div>
            <div class="editContent">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;
        tasksList.appendChild(newTask);
    });
}

function addTask(event) {
    event.preventDefault();

    const taskName = taskInput.value.trim();
    const deadline = deadlineInput.value;

    if (!taskName || !deadline) {
        alert("Please enter both a task and a deadline.");
        return;
    }

    const newTask = document.createElement('li');
    newTask.classList.add('tab-content');
    newTask.innerHTML = `
        <div class="editContent">
            <input type="checkbox">
            <span>${taskName}</span>
        </div>

        <div class="editContent">
            <span class="task-date">${new Date(deadline).toDateString()}</span>
        </div>
        
        <div class="editContent">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </div>
    `;
    tasksList.appendChild(newTask);

    taskInput.value = '';
    deadlineInput.value = '';

    saveTasksToLocalStorage();
}

function deleteTask(event) {
    if (event.target.classList.contains('delete')) {
        const taskItem = event.target.closest('li');
        taskItem.remove();
        saveTasksToLocalStorage();
    }
}

function editTask(event) {
    if (event.target.classList.contains('edit')) {
        const taskItem = event.target.closest('li');
        const taskNameElement = taskItem.querySelector('span');
        const taskDateElement = taskItem.querySelector('.task-date');

        const taskNameInput = document.createElement('input');
        taskNameInput.type = 'text';
        taskNameInput.value = taskNameElement.textContent;
        taskNameElement.replaceWith(taskNameInput);

        const taskDateInput = document.createElement('input');
        taskDateInput.type = 'date';
        taskDateInput.value = new Date(taskDateElement.textContent).toISOString().split('T')[0];
        taskDateElement.replaceWith(taskDateInput);

        const editButton = taskItem.querySelector('.edit');
        editButton.textContent = 'Save';
        editButton.classList.remove('edit');
        editButton.classList.add('save');
    } else if (event.target.classList.contains('save')) {
        const taskItem = event.target.closest('li');
        const taskNameInput = taskItem.querySelector('input[type="text"]');
        const taskDateInput = taskItem.querySelector('input[type="date"]');

        const taskNameElement = document.createElement('span');
        taskNameElement.textContent = taskNameInput.value.trim();
        taskNameInput.replaceWith(taskNameElement);

        const taskDateElement = document.createElement('span');
        taskDateElement.classList.add('task-date');
        taskDateElement.textContent = new Date(taskDateInput.value).toDateString();
        taskDateInput.replaceWith(taskDateElement);

        const saveButton = taskItem.querySelector('.save');
        saveButton.textContent = 'Edit';
        saveButton.classList.remove('save');
        saveButton.classList.add('edit');

        saveTasksToLocalStorage();
    }
}

window.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

addTaskButton.addEventListener('click', addTask);
tasksList.addEventListener('click', event => {
    deleteTask(event);
    editTask(event);
});
