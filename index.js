const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const message = document.getElementById("message");

let tasks = [];

try {
  const saveTasks = localStorage.getItem("studyTasks");
  tasks = saveTasks ? JSON.parse(saveTasks) : [];
} catch (error) {
  tasks = [];
  console.error("Failed to load saved tasks", error);
}

let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(function(task) {
      return !task.completed;
    });
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(function(task) {
      return task.completed;
    });
  }

  filteredTasks.forEach(function(task) {
    const element = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function() {
      task.completed = checkbox.checked;

      saveTasks();
      renderTasks();
    });

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    element.classList.toggle("completed", task.completed);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.type = "button";

    editButton.addEventListener("click", function() {
      editButton.disabled = true;

      const newInput = document.createElement("input");
      newInput.type = "text";
      newInput.value = task.text;

      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.type = "button";

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.type = "button";

      saveButton.addEventListener("click", function() {
        const newText = newInput.value.trim();

        if(newText == "") {
          message.textContent = "Task cannot be empty";
          return;
        }

        task.text = newText;
        saveTasks();
        renderTasks();

        message.textContent = "";
      });

      cancelButton.addEventListener("click", function() {
        newInput.remove();
        saveButton.remove();
        cancelButton.remove();

        editButton.disabled = false;
      });

      element.appendChild(newInput);
      element.appendChild(saveButton);
      element.appendChild(cancelButton);

      newInput.focus();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function() {
      tasks = tasks.filter(function(item) {
        return item.id !== task.id;
      });

      saveTasks();
      renderTasks();
    });

    element.appendChild(checkbox);
    element.appendChild(taskText);
    element.appendChild(editButton);
    element.appendChild(deleteButton);

    list.appendChild(element);
  });
}

const filterButtons = document.querySelectorAll("#taskFilters button");

filterButtons.forEach(function(filterButton) {
  filterButton.addEventListener("click", function() {
    currentFilter = filterButton.dataset.filter;
    renderTasks();
  });
});

button.addEventListener("click", function() {
  const text = input.value.trim();

  if (text === "") {
    message.textContent = "Please enter a task";
    return;
  }

  const task = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(task);

  saveTasks();
  renderTasks();

  input.value = "";
  message.textContent = "";
});

renderTasks();
