// Portfolio Application with improved performance and organization
const PortfolioApp = {
  projects: [],
  currentFilter: "all",
  searchTerm: "",

  init() {
    this.loadProjects();
    this.cacheElements();
    this.bindEvents();
    this.renderProjects();
  },

  loadProjects() {
    // Project data with improved structure
    this.projects = [
      {
        id: 1,
        title: "E-commerce Dashboard",
        description:
          "A comprehensive dashboard for managing online store operations with real-time analytics.",
        tech: "React, Node.js, MongoDB",
        category: "advanced",
        image: "https://via.placeholder.com/300x200?text=E-commerce+Dashboard",
        demo: "projects/advanced/project1/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/advanced/project1",
        tags: ["react", "dashboard", "analytics"],
        featured: true,
      },
      {
        id: 2,
        title: "Social Media Clone",
        description:
          "A full-featured social media platform with posts, comments, and user interactions.",
        tech: "React, Firebase, Material-UI",
        category: "advanced",
        image: "https://via.placeholder.com/300x200?text=Social+Media+Clone",
        demo: "projects/advanced/project2/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/advanced/project2",
        tags: ["react", "social", "firebase"],
        featured: false,
      },
      {
        id: 3,
        title: "Data Visualization Tool",
        description:
          "Interactive charts and graphs for analyzing complex datasets with export capabilities.",
        tech: "React, D3.js, Chart.js",
        category: "advanced",
        image: "https://via.placeholder.com/300x200?text=Data+Visualization",
        demo: "projects/advanced/project3/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/advanced/project3",
        tags: ["react", "charts", "data"],
        featured: false,
      },
      {
        id: 4,
        title: "Calculator",
        description:
          "A fully functional calculator with basic and scientific operations.",
        tech: "HTML, CSS, JavaScript",
        category: "vanilla-js",
        image: "https://via.placeholder.com/300x200?text=Calculator",
        demo: "projects/vanilla-js/project1/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/vanilla-js/project1",
        tags: ["math", "utility", "calculator"],
        featured: false,
      },
      {
        id: 5,
        title: "To-Do List",
        description:
          "A task management app with local storage and drag-and-drop functionality.",
        tech: "HTML, CSS, JavaScript",
        category: "vanilla-js",
        image: "https://via.placeholder.com/300x200?text=To-Do+List",
        demo: "projects/vanilla-js/project2/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/vanilla-js/project2",
        tags: ["productivity", "drag-drop", "localStorage"],
        featured: true,
      },
      {
        id: 6,
        title: "Weather App",
        description:
          "Real-time weather information with location-based forecasts and maps.",
        tech: "HTML, CSS, JavaScript, OpenWeather API",
        category: "vanilla-js",
        image: "https://via.placeholder.com/300x200?text=Weather+App",
        demo: "projects/vanilla-js/project3/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/vanilla-js/project3",
        tags: ["api", "weather", "async"],
        featured: false,
      },
      {
        id: 7,
        title: "Quiz Game",
        description:
          "Interactive quiz with multiple categories, scoring, and timer functionality.",
        tech: "HTML, CSS, JavaScript",
        category: "vanilla-js",
        image: "https://via.placeholder.com/300x200?text=Quiz+Game",
        demo: "projects/vanilla-js/project4/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/vanilla-js/project4",
        tags: ["game", "quiz", "interactive"],
        featured: false,
      },
      {
        id: 8,
        title: "Drawing App",
        description:
          "Digital drawing tool with various brushes, colors, and save functionality.",
        tech: "HTML, CSS, JavaScript, Canvas API",
        category: "vanilla-js",
        image: "https://via.placeholder.com/300x200?text=Drawing+App",
        demo: "projects/vanilla-js/project5/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/vanilla-js/project5",
        tags: ["canvas", "art", "creative"],
        featured: false,
      },
      {
        id: 9,
        title: "URL Shortener",
        description:
          "Shorten long URLs with custom aliases and click tracking using Bootstrap.",
        tech: "HTML, CSS, JavaScript, Bootstrap",
        category: "useful",
        image: "https://via.placeholder.com/300x200?text=URL+Shortener",
        demo: "projects/useful/project1/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/useful/project1",
        tags: ["utility", "url", "bootstrap"],
        featured: false,
      },
      {
        id: 10,
        title: "Expense Tracker",
        description:
          "Track income and expenses with charts and budget planning using Tailwind.",
        tech: "HTML, CSS, JavaScript, Tailwind CSS",
        category: "useful",
        image: "https://via.placeholder.com/300x200?text=Expense+Tracker",
        demo: "projects/useful/project2/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/useful/project2",
        tags: ["finance", "charts", "tailwind"],
        featured: false,
      },
      {
        id: 11,
        title: "Note-Taking App",
        description:
          "Create, edit, and organize notes with search and categorization features.",
        tech: "HTML, CSS, JavaScript",
        category: "useful",
        image: "https://via.placeholder.com/300x200?text=Note-Taking+App",
        demo: "projects/useful/project3/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/useful/project3",
        tags: ["productivity", "notes", "search"],
        featured: false,
      },
      {
        id: 12,
        title: "Image Gallery",
        description:
          "Responsive image gallery with lightbox, filtering, and upload capabilities.",
        tech: "HTML, CSS, JavaScript",
        category: "useful",
        image: "https://via.placeholder.com/300x200?text=Image+Gallery",
        demo: "projects/useful/project4/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/useful/project4",
        tags: ["gallery", "images", "lightbox"],
        featured: false,
      },
      {
        id: 13,
        title: "Password Generator",
        description:
          "Generate secure passwords with customizable options and strength meter.",
        tech: "HTML, CSS, JavaScript",
        category: "useful",
        image: "https://via.placeholder.com/300x200?text=Password+Generator",
        demo: "projects/useful/project5/index.html",
        code: "https://github.com/yourusername/portfolio/tree/main/projects/useful/project5",
        tags: ["security", "password", "generator"],
        featured: false,
      },
    ];
  },

  cacheElements() {
    this.elements = {
      projectGrid: document.getElementById("projectGrid"),
      filterButtons: document.querySelectorAll(".filter-btn"),
      searchInput: document.getElementById("searchInput"),
      sortSelect: document.getElementById("sortSelect"),
    };
  },

  bindEvents() {
    // Filter buttons with event delegation
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-btn")) {
        this.setActiveFilter(e.target);
      }
    });

    // Search input with debouncing
    let searchTimeout;
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.searchTerm = e.target.value.toLowerCase().trim();
          this.renderProjects();
        }, 300);
      });
    }

    // Sort select
    if (this.elements.sortSelect) {
      this.elements.sortSelect.addEventListener("change", (e) => {
        this.sortProjects(e.target.value);
      });
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !e.target.matches("input, textarea")) {
        e.preventDefault();
        if (this.elements.searchInput) {
          this.elements.searchInput.focus();
        }
      }
    });
  },

  setActiveFilter(button) {
    this.elements.filterButtons.forEach((btn) =>
      btn.classList.remove("active")
    );
    button.classList.add("active");
    this.currentFilter = button.dataset.filter;
    this.renderProjects();
  },

  getFilteredProjects() {
    return this.projects.filter((project) => {
      // Category filter
      const categoryMatch =
        this.currentFilter === "all" || project.category === this.currentFilter;

      // Search filter
      const searchMatch =
        !this.searchTerm ||
        project.title.toLowerCase().includes(this.searchTerm) ||
        project.description.toLowerCase().includes(this.searchTerm) ||
        project.tech.toLowerCase().includes(this.searchTerm) ||
        project.tags.some((tag) => tag.toLowerCase().includes(this.searchTerm));

      return categoryMatch && searchMatch;
    });
  },

  sortProjects(sortBy) {
    switch (sortBy) {
      case "title":
        this.projects.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "category":
        this.projects.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "featured":
        this.projects.sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
        break;
      default:
        // Keep original order
        break;
    }
    this.renderProjects();
  },

  renderProjects() {
    const filteredProjects = this.getFilteredProjects();
    this.elements.projectGrid.innerHTML = "";

    if (filteredProjects.length === 0) {
      this.elements.projectGrid.innerHTML = `
        <div class="no-results">
          <p>No projects found matching your criteria.</p>
          <button onclick="PortfolioApp.clearFilters()">Clear filters</button>
        </div>
      `;
      return;
    }

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();

    filteredProjects.forEach((project) => {
      const projectCard = this.createProjectCard(project);
      fragment.appendChild(projectCard);
    });

    this.elements.projectGrid.appendChild(fragment);

    // Update results count
    this.updateResultsCount(filteredProjects.length);
  },

  createProjectCard(project) {
    const card = document.createElement("div");
    card.className = `project-card ${project.featured ? "featured" : ""}`;
    card.setAttribute("data-project-id", project.id);

    card.innerHTML = `
      <img src="${project.image}" alt="${
      project.title
    }" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
      <h3>${this.escapeHtml(project.title)}</h3>
      <p>${this.escapeHtml(project.description)}</p>
      <p class="tech-stack">Tech: ${this.escapeHtml(project.tech)}</p>
      <div class="project-tags">
        ${project.tags
          .map((tag) => `<span class="tag">${this.escapeHtml(tag)}</span>`)
          .join("")}
      </div>
      <div class="links">
        <a href="${project.demo}" target="_blank" aria-label="View ${
      project.title
    } live demo">Live Demo</a>
        <a href="${project.code}" target="_blank" aria-label="View ${
      project.title
    } source code">Source Code</a>
      </div>
    `;

    return card;
  },

  updateResultsCount(count) {
    let countEl = document.getElementById("results-count");
    if (!countEl) {
      countEl = document.createElement("div");
      countEl.id = "results-count";
      countEl.className = "results-count";
      this.elements.projectGrid.parentNode.insertBefore(
        countEl,
        this.elements.projectGrid
      );
    }
    countEl.textContent = `Showing ${count} project${count !== 1 ? "s" : ""}`;
  },

  clearFilters() {
    this.currentFilter = "all";
    this.searchTerm = "";
    if (this.elements.searchInput) {
      this.elements.searchInput.value = "";
    }
    this.elements.filterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === "all");
    });
    this.renderProjects();
  },

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },
};

// Function to filter projects (legacy support)
function filterProjects(category) {
  PortfolioApp.currentFilter = category;
  PortfolioApp.renderProjects();
}

// Function to display projects (legacy support)
function displayProjects(projectsToShow) {
  PortfolioApp.renderProjects();
}

// Initialize the portfolio when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  PortfolioApp.init();
});
