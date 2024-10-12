document.addEventListener("DOMContentLoaded", function() {
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const totalTasksEl = document.getElementById("taskCount");
    const completedTasksEl = document.getElementById("completedCount");
    const filters = document.querySelectorAll('.filters button');

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = loadFilter();

    // Update task counters
    function updateTaskInfo() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;

        totalTasksEl.textContent = totalTasks;
        completedTasksEl.textContent = completedTasks;
    }

    // Render tasks
    function renderTasks(filter = 'all') {
        taskList.innerHTML = "";  // Clear the list
        let filteredTasks = tasks;

        if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (filter === 'incomplete') {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        filteredTasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.textContent = task.text;
            if (task.completed) {
                li.classList.add("completed");
            }

            // Mark task as completed
            li.addEventListener("click", function() {
                task.completed = !task.completed;
                saveTasks();
                renderTasks(filter);
                updateTaskInfo();
            });

            // Remove task button
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", function() {
                if (confirm("Deseja realmente remover esta tarefa?")) {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks(filter);
                    updateTaskInfo();
                }
            });

            li.appendChild(removeBtn);
            taskList.appendChild(li);
        });

        updateTaskInfo();
    }

    // Add new task
    addTaskBtn.addEventListener("click", function() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            tasks.push({ text: taskText, completed: false });
            saveTasks();
            renderTasks(currentFilter);
            taskInput.value = "";  // Clear input after adding
        }
    });

    // Add task by pressing Enter key
    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            addTaskBtn.click();
        }
    });

    // Disable add button if input is empty
    taskInput.addEventListener("input", function() {
        addTaskBtn.disabled = taskInput.value.trim() === "";
    });

    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Save filter to local storage
    function saveFilter(filter) {
        localStorage.setItem("taskFilter", filter);
    }

    // Load filter from local storage
    function loadFilter() {
        return localStorage.getItem("taskFilter") || 'all';
    }

    // Filter tasks
    filters.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('id').replace('show', '').toLowerCase();
            filters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            saveFilter(filter);
            currentFilter = filter;
            renderTasks(filter);
        });
    });

    // Initial rendering of tasks and set filter button active
    renderTasks(currentFilter);
    filters.forEach(button => {
        if (button.getAttribute('id').replace('show', '').toLowerCase() === currentFilter) {
            button.classList.add('active');
        }
    });
});


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registrado com sucesso: ', registration.scope);
            }).catch(err => {
                console.log('Falha ao registrar o ServiceWorker: ', err);
            });
    });
}
