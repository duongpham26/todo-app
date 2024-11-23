//Global Variables
let allTasks = getAllTasks();
let tabs = getAllTabs();

//Init
window.addEventListener("DOMContentLoaded", init);

function init() {
    // Init Tab Event
    tabs.forEach((tab) => tab.addEventListener("click", () => switchTab(tab)));

    //Load Tasks
    loadTasks();
}

//---Getters---
function getAllTabs() {
    return document.querySelectorAll(".tabs .btn");
}

function getCurrentTab() {
    return document.querySelector(".tabs .btn.active").dataset.tab;
}

function getAllTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function getTodayTasks() {
    //Valid
    if (!allTasks || allTasks.length === 0) return [];

    // Get today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today tasks
    const todayTasks = allTasks.filter((task) => {
        // Convert task.deadline to date format
        const taskDate = new Date(task.deadline);
        taskDate.setHours(0, 0, 0, 0);

        // Get task following condition deadline = today
        return taskDate.getTime() === today.getTime();
    });

    return todayTasks;
}

function getPendingTasks() {
    //Valid
    if (!allTasks || allTasks.length === 0) return [];
    //Get today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get pending tasks
    const pendingTasks = allTasks.filter((task) => {
        // Convert task.deadline to date format
        const taskDate = new Date(task.deadline);
        taskDate.setHours(0, 0, 0, 0);

        // Get task following condition deadline >= today and not completed
        return taskDate >= today && task.isCompleted == false;
    });

    return pendingTasks;
}

function getOverdueTasks() {
    //Valid
    if (!allTasks || allTasks.length === 0) return [];
    //Get today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingTasks = allTasks.filter((task) => {
        // Convert task.deadline to date format
        const taskDate = new Date(task.deadline);
        taskDate.setHours(0, 0, 0, 0);

        // Get task following condition deadline < today and not completed
        return taskDate < today && task.isCompleted == false;
    });

    return pendingTasks;
}

function getCompletedTasks() {
    //Valid
    if (!allTasks || allTasks.length === 0) return [];
    const completedTasks = allTasks.filter((task) => task.isCompleted);
    return completedTasks;
}

//---Controller---
function loadTasks() {
    // Get current tab
    const currentTab = getCurrentTab();
    // Get tasks and display tasks following current tab
    switch (currentTab) {
        case "today":
            displayTask(getTodayTasks());
            break;
        case "overdue":
            displayTask(getOverdueTasks());
            break;
        case "completed":
            displayTask(getCompletedTasks());
            break;
        case "pending":
            displayTask(getPendingTasks());
            break;
        default:
            displayTask(allTasks);
            break;
    }
}

function displayTask(tasks) {
    // Get HTML element
    const taskList = document.getElementById("tasks");
    taskList.innerHTML = ""; // Delete old elements

    // Convert object to DOM Node
    tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-content");
        taskItem.id = task.id;
        taskItem.innerHTML = `
            <input class="isCompleted" type="checkbox" onclick = "toggleCheckBox('${task.id}')" ${task.isCompleted ? "checked" : ""}>
            <span class="taskName">${task.name}</span>
            <span class="deadline">${task.deadline}</span>
            <button class="edit" onclick="editTask('${task.id}')">Edit</button>
            <button class="delete" onclick="deleteTask('${task.id}')">Delete</button>
        `;

        taskList.appendChild(taskItem);
    });
}

function switchTab(tab) {
    // Remove active class from all tabs
    tabs.forEach((tab) => tab.classList.remove("active"));

    // Add active class to selected tab
    tab.classList.add("active");

    loadTasks(tab);
}

function addTask() {
    // Get value
    const taskName = document.querySelector('input[name = "taskName"]').value.trim();
    const deadline = document.querySelector('input[name = "deadline"]').value;

    //valid null variable
    if (!taskName || !deadline) {
        alert("Please enter both a task and a deadline.");
    } else {
        //Create a new task object
        const newTask = {
            id: crypto.randomUUID().toString(),
            name: taskName,
            deadline: new Date(deadline).toDateString(),
            isCompleted: false,
        };

        //Add the new task to the tasks array
        allTasks.push(newTask);

        //Load and save
        loadTasks();
        saveToLocalStorage(allTasks);
    }

    //Reset Value
    document.querySelector('input[name = "taskName"]').value = "";
    document.querySelector('input[name = "deadline"]').value = "";
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(allTasks));
}

function toggleCheckBox(taskID) {
    // Find task
    const task = allTasks.find((task) => task.id === taskID);

    if (task) {
        task.isCompleted = !task.isCompleted;
        saveToLocalStorage(allTasks);

        loadTasks();
    }
}

function editTask(taskID) {
    const taskItem = document.getElementById(taskID);
    const editButton = taskItem.querySelector('.edit, .save'); // Select the Edit/Save button
    
    if (editButton.classList.contains('edit')) {
        // Switch to Edit Mode
        const taskNameElement = taskItem.querySelector('.taskName');
        const taskDateElement = taskItem.querySelector('.deadline');

        // Create input for task name
        const taskNameInput = document.createElement('input');
        taskNameInput.type = 'text';
        taskNameInput.value = taskNameElement.textContent.trim();
        taskNameInput.classList.add('taskNameInput');
        taskNameElement.replaceWith(taskNameInput);

        // Create input for deadline
        const taskDateInput = document.createElement('input');
        taskDateInput.type = 'date';
        taskDateInput.value = new Date(taskDateElement.textContent).toISOString().split('T')[0];
        taskDateInput.classList.add('deadlineInput');
        taskDateElement.replaceWith(taskDateInput);

        // Change button text to "Save"
        editButton.textContent = 'Save';
        editButton.classList.remove('edit');
        editButton.classList.add('save');
    } else if (editButton.classList.contains('save')) {
        // Switch to View Mode
        const taskNameInput = taskItem.querySelector('input[type="text"]');
        const taskDateInput = taskItem.querySelector('input[type="date"]');

        // Validate inputs
        const updatedName = taskNameInput.value.trim();
        const updatedDeadline = taskDateInput.value;

        if (!updatedName || !updatedDeadline) {
            alert("Task name and deadline cannot be empty.");
            return;
        }

        // Replace input with "span" for task name
        const taskNameElement = document.createElement('span');
        taskNameElement.classList.add('taskName');
        taskNameElement.textContent = updatedName;
        taskNameInput.replaceWith(taskNameElement);

        // Replace input with "span" for deadline
        const taskDateElement = document.createElement('span');
        taskDateElement.classList.add('deadline');
        taskDateElement.textContent = new Date(updatedDeadline).toDateString();
        taskDateInput.replaceWith(taskDateElement);

        // Update task in `allTasks`
        const task = allTasks.find((task) => task.id === taskID);
        if (task) {
            task.name = updatedName;
            task.deadline = new Date(updatedDeadline).toDateString();
        }

        // Change button text to "Edit"
        editButton.textContent = 'Edit';
        editButton.classList.remove('save');
        editButton.classList.add('edit');

        // Save tasks to localStorage
        saveToLocalStorage();
        loadTasks(); // Reload tasks to reflect changes
    }
}
function deleteTask(taskID) {
    // Find and remove the task from `allTasks`
    allTasks = allTasks.filter(task => task.id !== taskID);
    // Save updated tasks to localStorage
    saveToLocalStorage();
    // Remove task from DOM
    const taskItem = document.getElementById(taskID);
    if (taskItem) {
        taskItem.remove();
    }
    loadTasks();// Reload tasks to reflect changes
}

