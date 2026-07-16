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

const progressFill = document.getElementById("progressFill");

const progressPercent = document.getElementById("progressPercent");

const statusBox = document.getElementById("statusBox");

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

// Add Expense from Pasted UPI SMS

function addFromUpiSms() {

    const input = document.getElementById("upiSmsInput");

    const text = input.value.trim();

    if (text === "") {

        alert("Paste a UPI SMS first.");

        return;

    }

    const parsed = parseUpiSms(text);

    if (!parsed) {

        alert("Couldn't detect an amount in that SMS. Please add the expense manually instead.");

        return;

    }

    tasks.push({

        text: parsed.merchant,

        price: parsed.amount,

        completed: false

    });

    input.value = "";

    saveTasks();

    displayTasks();

}

// Extract Amount & Merchant from UPI SMS Text

function parseUpiSms(text) {

    const amountMatch = text.match(/(?:rs\.?|inr)\s?([\d,]+(?:\.\d{1,2})?)/i);

    if (!amountMatch) return null;

    const amount = Number(amountMatch[1].replace(/,/g, ""));

    if (!amount || amount <= 0) return null;

    let merchant = "UPI Payment";

    const vpaMatch = text.match(/vpa\s+([a-zA-Z0-9.\-_@]+)/i);

    const toMatch = text.match(/\bto\s+([a-zA-Z0-9.\-_@ ]+?)(?:\s+on\b|\.|,|$)/i);

    if (vpaMatch) {

        merchant = vpaMatch[1];

    } else if (toMatch) {

        merchant = toMatch[1].trim();

    }

    return { amount, merchant };

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

    const remaining = budget - spent;

    spentDisplay.innerHTML = spent;

    remainingDisplay.innerHTML = remaining;

    remainingDisplay.style.color = spent > budget ? "red" : "green";

    // Progress Bar

    const percentage = budget === 0 ? 0 : (spent / budget) * 100;

    progressFill.style.width = Math.min(percentage, 100) + "%";

    progressPercent.innerHTML = percentage.toFixed(0) + "%";

    // Change Color

    if (percentage < 60) {

        progressFill.style.background =
            "linear-gradient(90deg,#22c55e,#16a34a)";

    }

    else if (percentage < 90) {

        progressFill.style.background =
            "linear-gradient(90deg,#facc15,#f59e0b)";

    }

    else {

        progressFill.style.background =
            "linear-gradient(90deg,#ef4444,#dc2626)";

    }

    // Status Message

    if (budget === 0) {

        statusBox.className = "status warning";

        statusBox.innerHTML = "⚠ Please set your budget.";

    }

    else if (spent < budget) {

        statusBox.className = "status safe";

        statusBox.innerHTML = "✅ You still have ₹" + remaining + " remaining today.";

    }

    else if (spent === budget) {

        statusBox.className = "status warning";

        statusBox.innerHTML = "⚠ Budget Limit Reached!";

        alert("Daily Budget Reached!");

    }

    else {

        statusBox.className = "status danger";

        statusBox.innerHTML = "🚫 Budget Exceeded by ₹" + (spent - budget);

        alert("Budget Exceeded!");

    }

}

// Save Tasks

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// Initial Load

displayTasks();
