// Data management module
const TaskManager = {
  tasks: [],
  currentFilter: "all",

  init() {
    this.loadTasks();
  },

  loadTasks() {
    try {
      const stored = localStorage.getItem("tasks");
      this.tasks = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      this.tasks = [];
    }
  },

  saveTasks() {
    try {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
      alert("Failed to save tasks. Storage might be full.");
    }
  },

  addTask(text) {
    if (!text || typeof text !== "string") {
      throw new Error("Invalid task text");
    }

    const task = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks.unshift(task);
    this.saveTasks();
    return task;
  },

  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    task.completed = !task.completed;
    this.saveTasks();
  },

  deleteTask(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks.splice(index, 1);
    this.saveTasks();
  },

  reorderTasks(fromIndex, toIndex) {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= this.tasks.length ||
      toIndex >= this.tasks.length
    ) {
      throw new Error("Invalid indices for reordering");
    }

    const [movedTask] = this.tasks.splice(fromIndex, 1);
    this.tasks.splice(toIndex, 0, movedTask);
    this.saveTasks();
  },

  getFilteredTasks() {
    return this.tasks.filter((task) => {
      switch (this.currentFilter) {
        case "active":
          return !task.completed;
        case "completed":
          return task.completed;
        default:
          return true;
      }
    });
  },

  getStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    return { total, completed };
  },
};

// UI management module
const UIManager = {
  elements: {},

  init() {
    this.cacheElements();
    this.bindEvents();
    this.render();
  },

  cacheElements() {
    this.elements = {
      taskInput: document.getElementById("taskInput"),
      addTaskBtn: document.getElementById("addTaskBtn"),
      taskList: document.getElementById("taskList"),
      filterButtons: document.querySelectorAll(".filter-btn"),
      totalTasksSpan: document.getElementById("totalTasks"),
      completedTasksSpan: document.getElementById("completedTasks"),
    };
  },

  bindEvents() {
    this.elements.addTaskBtn.addEventListener("click", () =>
      this.handleAddTask()
    );
    this.elements.taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleAddTask();
    });

    // Use event delegation for filter buttons
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-btn")) {
        this.handleFilter(e.target.dataset.filter);
      }
    });

    // Use event delegation for task actions
    this.elements.taskList.addEventListener("click", (e) => {
      const taskItem = e.target.closest(".task-item");
      if (!taskItem) return;

      const taskId = taskItem.dataset.id;

      if (e.target.type === "checkbox") {
        this.handleToggleTask(taskId);
      } else if (e.target.classList.contains("delete-btn")) {
        this.handleDeleteTask(taskId);
      }
    });

    // Drag and drop with delegation
    this.elements.taskList.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("task-item")) {
        e.dataTransfer.setData("text/plain", e.target.dataset.id);
        e.target.classList.add("dragging");
      }
    });

    this.elements.taskList.addEventListener("dragend", (e) => {
      if (e.target.classList.contains("task-item")) {
        e.target.classList.remove("dragging");
      }
    });

    this.elements.taskList.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = this.getDragAfterElement(e.clientY);
      const draggable = document.querySelector(".dragging");

      if (afterElement == null) {
        this.elements.taskList.appendChild(draggable);
      } else {
        this.elements.taskList.insertBefore(draggable, afterElement);
      }
    });

    this.elements.taskList.addEventListener("drop", (e) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const afterElement = this.getDragAfterElement(e.clientY);

      const draggedIndex = TaskManager.tasks.findIndex(
        (t) => t.id === draggedId
      );
      let targetIndex;

      if (afterElement) {
        const targetId = afterElement.dataset.id;
        targetIndex = TaskManager.tasks.findIndex((t) => t.id === targetId);
      } else {
        targetIndex = TaskManager.tasks.length - 1;
      }

      try {
        TaskManager.reorderTasks(draggedIndex, targetIndex);
      } catch (error) {
        console.error("Error reordering tasks:", error);
        this.render(); // Re-render to fix any inconsistencies
      }
    });
  },

  getDragAfterElement(y) {
    const draggableElements = [
      ...this.elements.taskList.querySelectorAll(".task-item:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  },

  handleAddTask() {
    const text = this.elements.taskInput.value.trim();
    if (!text) {
      this.showError("Please enter a task");
      return;
    }

    try {
      TaskManager.addTask(text);
      this.elements.taskInput.value = "";
      this.hideError();
      this.render();
    } catch (error) {
      this.showError(error.message);
    }
  },

  handleToggleTask(id) {
    try {
      TaskManager.toggleTask(id);
      this.render();
    } catch (error) {
      console.error("Error toggling task:", error);
      this.showError("Failed to update task");
    }
  },

  handleDeleteTask(id) {
    try {
      TaskManager.deleteTask(id);
      this.render();
    } catch (error) {
      console.error("Error deleting task:", error);
      this.showError("Failed to delete task");
    }
  },

  handleFilter(filter) {
    TaskManager.currentFilter = filter;
    this.elements.filterButtons.forEach((btn) =>
      btn.classList.remove("active")
    );
    document.querySelector(`[data-filter="${filter}"]`).classList.add("active");
    this.render();
  },

  render() {
    const filteredTasks = TaskManager.getFilteredTasks();
    this.elements.taskList.innerHTML = "";

    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item ${task.completed ? "completed" : ""}`;
      li.draggable = true;
      li.dataset.id = task.id;

      li.innerHTML = `
        <input type="checkbox" ${
          task.completed ? "checked" : ""
        } aria-label="Mark task as complete">
        <span class="task-text">${this.escapeHtml(task.text)}</span>
        <button class="delete-btn" aria-label="Delete task">×</button>
      `;

      this.elements.taskList.appendChild(li);
    });

    this.updateStats();
  },

  updateStats() {
    const stats = TaskManager.getStats();
    this.elements.totalTasksSpan.textContent = `${stats.total} total`;
    this.elements.completedTasksSpan.textContent = `${stats.completed} completed`;
  },

  showError(message) {
    let errorEl = document.getElementById("error-message");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.id = "error-message";
      errorEl.style.color = "red";
      errorEl.style.marginBottom = "10px";
      this.elements.taskInput.parentNode.insertBefore(
        errorEl,
        this.elements.taskInput
      );
    }
    errorEl.textContent = message;
  },

  hideError() {
    const errorEl = document.getElementById("error-message");
    if (errorEl) {
      errorEl.remove();
    }
  },

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },
};

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  TaskManager.init();
  UIManager.init();
});
