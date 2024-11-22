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
            <button class="edit" onclick="deleteTask('${task.id}')">Delete</button>
            <button class="delete" onclick="editTask('${task.id}')">Edit</button>
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

}
