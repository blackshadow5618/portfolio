class NoteTakingApp {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.currentNoteId = null;
    this.selectedColor = "#e2e3e5";
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderNotes();
    this.loadSampleNotes();
  }

  bindEvents() {
    // Add note button
    document.getElementById("addNoteBtn").addEventListener("click", () => {
      this.openModal();
    });

    // Modal close
    document.querySelector(".close").addEventListener("click", () => {
      this.closeModal();
    });

    document.getElementById("cancelBtn").addEventListener("click", () => {
      this.closeModal();
    });

    // Click outside modal to close
    window.addEventListener("click", (e) => {
      const modal = document.getElementById("noteModal");
      if (e.target === modal) {
        this.closeModal();
      }
    });

    // Form submission
    document.getElementById("noteForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveNote();
    });

    // Search and filter
    document.getElementById("searchInput").addEventListener("input", () => {
      this.renderNotes();
    });

    document.getElementById("categoryFilter").addEventListener("change", () => {
      this.renderNotes();
    });

    // Color picker
    document.querySelectorAll(".color-option").forEach((option) => {
      option.addEventListener("click", () => {
        this.selectColor(option);
      });
    });
  }

  openModal(noteId = null) {
    const modal = document.getElementById("noteModal");
    const form = document.getElementById("noteForm");

    if (noteId) {
      this.currentNoteId = noteId;
      const note = this.notes.find((n) => n.id === noteId);
      if (note) {
        document.getElementById("noteTitle").value = note.title;
        document.getElementById("noteContent").value = note.content;
        document.getElementById("noteCategory").value = note.category;
        this.selectedColor = note.color;
        this.updateColorSelection();
        document.getElementById("modalTitle").textContent = "Edit Note";
      }
    } else {
      this.currentNoteId = null;
      form.reset();
      document.getElementById("modalTitle").textContent = "Add New Note";
      this.selectedColor = "#e2e3e5";
      this.updateColorSelection();
    }

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    const modal = document.getElementById("noteModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    this.currentNoteId = null;
  }

  selectColor(option) {
    document.querySelectorAll(".color-option").forEach((opt) => {
      opt.classList.remove("selected");
    });
    option.classList.add("selected");
    this.selectedColor = option.dataset.color;
  }

  updateColorSelection() {
    document.querySelectorAll(".color-option").forEach((option) => {
      if (option.dataset.color === this.selectedColor) {
        option.classList.add("selected");
      } else {
        option.classList.remove("selected");
      }
    });
  }

  saveNote() {
    const title = document.getElementById("noteTitle").value.trim();
    const content = document.getElementById("noteContent").value.trim();
    const category = document.getElementById("noteCategory").value;

    if (!title || !content) {
      this.showNotification("Please fill in all fields", "error");
      return;
    }

    const noteData = {
      title,
      content,
      category,
      color: this.selectedColor,
      updatedAt: new Date().toISOString(),
    };

    if (this.currentNoteId) {
      // Update existing note
      const index = this.notes.findIndex((n) => n.id === this.currentNoteId);
      if (index !== -1) {
        this.notes[index] = { ...this.notes[index], ...noteData };
        this.showNotification("Note updated successfully!", "success");
      }
    } else {
      // Create new note
      const newNote = {
        id: Date.now(),
        ...noteData,
        createdAt: new Date().toISOString(),
      };
      this.notes.unshift(newNote);
      this.showNotification("Note created successfully!", "success");
    }

    this.saveNotes();
    this.renderNotes();
    this.closeModal();
  }

  deleteNote(id) {
    if (confirm("Are you sure you want to delete this note?")) {
      this.notes = this.notes.filter((note) => note.id !== id);
      this.saveNotes();
      this.renderNotes();
      this.showNotification("Note deleted successfully!", "success");
    }
  }

  renderNotes() {
    const notesGrid = document.getElementById("notesGrid");
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const categoryFilter = document.getElementById("categoryFilter").value;

    let filteredNotes = this.notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm);
      const matchesCategory =
        categoryFilter === "all" || note.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Sort by updated date (newest first)
    filteredNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    notesGrid.innerHTML = "";

    if (filteredNotes.length === 0) {
      notesGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No notes found</h3>
                    <p>${
                      searchTerm || categoryFilter !== "all"
                        ? "Try adjusting your search or filter"
                        : "Create your first note to get started"
                    }</p>
                </div>
            `;
      return;
    }

    filteredNotes.forEach((note) => {
      const noteElement = this.createNoteElement(note);
      notesGrid.appendChild(noteElement);
    });
  }

  createNoteElement(note) {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note-card";
    noteDiv.style.backgroundColor = note.color;

    const truncatedContent =
      note.content.length > 150
        ? note.content.substring(0, 150) + "..."
        : note.content;

    noteDiv.innerHTML = `
            <div class="note-header">
                <h3 class="note-title">${this.escapeHtml(note.title)}</h3>
                <div class="note-actions">
                    <button onclick="noteApp.editNote(${
                      note.id
                    })" class="btn-icon edit-btn" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button onclick="noteApp.deleteNote(${
                      note.id
                    })" class="btn-icon delete-btn" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="note-content">${this.escapeHtml(truncatedContent)}</div>
            <div class="note-footer">
                <span class="note-category">${note.category}</span>
                <span class="note-date">${this.formatDate(
                  note.updatedAt
                )}</span>
            </div>
        `;

    return noteDiv;
  }

  editNote(id) {
    this.openModal(id);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Today";
    } else if (diffDays === 2) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  loadSampleNotes() {
    if (this.notes.length === 0) {
      const sampleNotes = [
        {
          id: Date.now() + 1,
          title: "Welcome to Notes App",
          content:
            "This is your first note! You can create, edit, and organize your notes here. Try adding different categories and colors.",
          category: "personal",
          color: "#d4edda",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: Date.now() + 2,
          title: "Project Ideas",
          content:
            "1. Weather dashboard with charts\n2. Recipe finder app\n3. Personal finance tracker\n4. Task management tool",
          category: "ideas",
          color: "#fff3cd",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      this.notes = sampleNotes;
      this.saveNotes();
      this.renderNotes();
    }
  }
}

// Initialize the note-taking app
const noteApp = new NoteTakingApp();
