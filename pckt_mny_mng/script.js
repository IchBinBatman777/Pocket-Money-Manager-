// Load data from Local Storage

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let budget = Number(localStorage.getItem("budget")) || 0;

let spent = 0;

// Get Elements

const slider = document.getElementById("amountSlider");

const amountValue = document.getElementById("amountValue");

const budgetDisplay = document.getElementById("budgetDisplay");

const spentDisplay = document.getElementById("spentDisplay");

const remainingDisplay = document.getElementById("remainingDisplay");

// Load Previous Budget

budgetDisplay.innerHTML = budget;

slider.max = budget;

slider.value = 0;

amountValue.innerHTML = slider.value;

// Update Slider Value

slider.oninput = function () {

    amountValue.innerHTML = this.value;

};

// Save Budget

function saveBudget() {

    const input = document.getElementById("budgetInput");

    const value = Number(input.value);

    if (value <= 0) {

        alert("Enter a valid budget.");

        return;

    }

    budget = value;

    localStorage.setItem("budget", budget);

    budgetDisplay.innerHTML = budget;

    slider.max = budget;

    slider.value = 0;

    amountValue.innerHTML = 0;

    updateSummary();

}

// Add Expense

function addTask() {

    const input = document.getElementById("taskInput");

    const expense = input.value.trim();

    const amount = Number(slider.value);

    if (expense === "") {

        alert("Enter Expense Name");

        return;

    }

    if (amount <= 0) {

        alert("Select an Amount");

        return;

    }

    tasks.push({

        text: expense,

        price: amount,

        completed: false

    });

    input.value = "";

    slider.value = 0;

    amountValue.innerHTML = 0;

    saveTasks();

    displayTasks();

}

// Display Expenses

function displayTasks() {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    spent = 0;

    tasks.forEach((task, index) => {

        spent += Number(task.price);

        const li = document.createElement("li");

        if (task.completed)

            li.classList.add("completed");

        const span = document.createElement("span");

        span.innerHTML = `💸 ${task.text} - ₹${task.price}`;

        span.onclick = function () {

            tasks[index].completed = !tasks[index].completed;

            saveTasks();

            displayTasks();

        };

        const deleteBtn = document.createElement("button");

        deleteBtn.innerHTML = "Delete";

        deleteBtn.className = "deleteBtn";

        deleteBtn.onclick = function () {

            tasks.splice(index, 1);

            saveTasks();

            displayTasks();

        };

        li.appendChild(span);

        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });

    updateSummary();

}

// Update Budget Summary

function updateSummary() {

    spentDisplay.innerHTML = spent;

    remainingDisplay.innerHTML = budget - spent;

    if (spent > budget) {

        remainingDisplay.style.color = "red";

    } else {

        remainingDisplay.style.color = "green";

    }

}

// Save Tasks

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// Initial Load

displayTasks();