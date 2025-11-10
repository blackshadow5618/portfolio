class ImageGallery {
  constructor() {
    this.images = JSON.parse(localStorage.getItem("galleryImages")) || [];
    this.currentView = "grid";
    this.currentFilter = "all";
    this.currentImageIndex = 0;
    this.searchTerm = "";
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderGallery();
    this.updateStats();
    this.loadSampleImages();
  }

  bindEvents() {
    // Upload functionality
    document.getElementById("uploadBtn").addEventListener("click", () => {
      document.getElementById("fileInput").click();
    });

    document.getElementById("fileInput").addEventListener("change", (e) => {
      this.handleFileUpload(e.target.files);
    });

    // Search
    document.getElementById("searchInput").addEventListener("input", (e) => {
      this.searchTerm = e.target.value.toLowerCase();
      this.renderGallery();
    });

    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setActiveFilter(btn);
      });
    });

    // View toggle
    document.getElementById("gridView").addEventListener("click", () => {
      this.setView("grid");
    });

    document.getElementById("listView").addEventListener("click", () => {
      this.setView("list");
    });

    // Lightbox controls
    document.getElementById("closeLightbox").addEventListener("click", () => {
      this.closeLightbox();
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
      this.showPrevImage();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
      this.showNextImage();
    });

    document.getElementById("favoriteBtn").addEventListener("click", () => {
      this.toggleFavorite();
    });

    document.getElementById("downloadBtn").addEventListener("click", () => {
      this.downloadImage();
    });

    document.getElementById("deleteBtn").addEventListener("click", () => {
      this.deleteImage();
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (document.getElementById("lightbox").style.display === "flex") {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            this.showPrevImage();
            break;
          case "ArrowRight":
            e.preventDefault();
            this.showNextImage();
            break;
          case "Escape":
            this.closeLightbox();
            break;
          case "Delete":
            this.deleteImage();
            break;
        }
      }
    });

    // Drag and drop
    const gallery = document.getElementById("gallery");
    gallery.addEventListener("dragover", (e) => {
      e.preventDefault();
      gallery.classList.add("drag-over");
    });

    gallery.addEventListener("dragleave", () => {
      gallery.classList.remove("drag-over");
    });

    gallery.addEventListener("drop", (e) => {
      e.preventDefault();
      gallery.classList.remove("drag-over");
      this.handleFileUpload(e.dataTransfer.files);
    });
  }

  handleFileUpload(files) {
    if (files.length === 0) return;

    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (validFiles.length === 0) {
      this.showNotification("Please select valid image files", "error");
      return;
    }

    this.showUploadModal();
    let processed = 0;

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          id: Date.now() + index,
          name: file.name,
          src: e.target.result,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          favorite: false,
          tags: this.extractTags(file.name),
        };

        this.images.unshift(imageData);
        processed++;

        this.updateUploadProgress((processed / validFiles.length) * 100);

        if (processed === validFiles.length) {
          this.saveImages();
          this.renderGallery();
          this.updateStats();
          this.hideUploadModal();
          this.showNotification(
            `Successfully uploaded ${validFiles.length} image(s)!`,
            "success"
          );
        }
      };
      reader.readAsDataURL(file);
    });
  }

  extractTags(filename) {
    // Extract tags from filename (remove extension and split by common separators)
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    return nameWithoutExt
      .toLowerCase()
      .split(/[-_\s]+/)
      .filter((tag) => tag.length > 0);
  }

  setActiveFilter(button) {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");
    this.currentFilter = button.dataset.filter;
    this.renderGallery();
  }

  setView(view) {
    this.currentView = view;
    const gallery = document.getElementById("gallery");
    gallery.className = `gallery ${view}-view`;

    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById(`${view}View`).classList.add("active");
  }

  renderGallery() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    let filteredImages = this.getFilteredImages();

    if (filteredImages.length === 0) {
      gallery.innerHTML = `
                <div class="empty-gallery">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>
                    <h3>No images found</h3>
                    <p>${
                      this.searchTerm || this.currentFilter !== "all"
                        ? "Try adjusting your search or filter"
                        : "Upload some images to get started"
                    }</p>
                </div>
            `;
      return;
    }

    filteredImages.forEach((image, index) => {
      const imageElement = this.createImageElement(image, index);
      gallery.appendChild(imageElement);
    });
  }

  getFilteredImages() {
    let filtered = [...this.images];

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(
        (image) =>
          image.name.toLowerCase().includes(this.searchTerm) ||
          image.tags.some((tag) => tag.includes(this.searchTerm))
      );
    }

    // Apply category filter
    switch (this.currentFilter) {
      case "recent":
        filtered = filtered.filter((image) => {
          const uploadDate = new Date(image.uploadedAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return uploadDate > weekAgo;
        });
        break;
      case "favorites":
        filtered = filtered.filter((image) => image.favorite);
        break;
    }

    return filtered;
  }

  createImageElement(image, index) {
    const div = document.createElement("div");
    div.className = "image-item";
    div.innerHTML = `
            <div class="image-container">
                <img src="${image.src}" alt="${
      image.name
    }" loading="lazy" onclick="gallery.openLightbox(${index})">
                <div class="image-overlay">
                    <div class="image-info">
                        <h4>${this.escapeHtml(image.name)}</h4>
                        <span class="image-size">${this.formatFileSize(
                          image.size
                        )}</span>
                    </div>
                    <div class="image-actions">
                        <button onclick="gallery.toggleFavoriteFromGallery(${
                          image.id
                        })" class="action-btn ${
      image.favorite ? "active" : ""
    }">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="${
                              image.favorite ? "currentColor" : "none"
                            }" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                        <button onclick="gallery.downloadImageFromGallery(${
                          image.id
                        })" class="action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7,10 12,15 17,10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                ${image.favorite ? '<div class="favorite-badge">★</div>' : ""}
            </div>
        `;
    return div;
  }

  openLightbox(index) {
    const filteredImages = this.getFilteredImages();
    this.currentImageIndex = index;
    const image = filteredImages[index];

    if (!image) return;

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const title = document.getElementById("lightboxTitle");
    const date = document.getElementById("lightboxDate");
    const favoriteBtn = document.getElementById("favoriteBtn");

    lightboxImage.src = image.src;
    title.textContent = image.name;
    date.textContent = this.formatDate(image.uploadedAt);
    favoriteBtn.classList.toggle("active", image.favorite);

    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
    document.body.style.overflow = "auto";
  }

  showPrevImage() {
    const filteredImages = this.getFilteredImages();
    this.currentImageIndex =
      (this.currentImageIndex - 1 + filteredImages.length) %
      filteredImages.length;
    this.openLightbox(this.currentImageIndex);
  }

  showNextImage() {
    const filteredImages = this.getFilteredImages();
    this.currentImageIndex =
      (this.currentImageIndex + 1) % filteredImages.length;
    this.openLightbox(this.currentImageIndex);
  }

  toggleFavorite() {
    const filteredImages = this.getFilteredImages();
    const image = filteredImages[this.currentImageIndex];
    if (image) {
      image.favorite = !image.favorite;
      this.saveImages();
      this.renderGallery();
      document
        .getElementById("favoriteBtn")
        .classList.toggle("active", image.favorite);
      this.showNotification(
        image.favorite ? "Added to favorites!" : "Removed from favorites!",
        "success"
      );
    }
  }

  toggleFavoriteFromGallery(imageId) {
    event.stopPropagation();
    const image = this.images.find((img) => img.id === imageId);
    if (image) {
      image.favorite = !image.favorite;
      this.saveImages();
      this.renderGallery();
      this.showNotification(
        image.favorite ? "Added to favorites!" : "Removed from favorites!",
        "success"
      );
    }
  }

  downloadImage() {
    const filteredImages = this.getFilteredImages();
    const image = filteredImages[this.currentImageIndex];
    if (image) {
      const link = document.createElement("a");
      link.href = image.src;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.showNotification("Image downloaded!", "success");
    }
  }

  downloadImageFromGallery(imageId) {
    event.stopPropagation();
    const image = this.images.find((img) => img.id === imageId);
    if (image) {
      const link = document.createElement("a");
      link.href = image.src;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.showNotification("Image downloaded!", "success");
    }
  }

  deleteImage() {
    const filteredImages = this.getFilteredImages();
    const image = filteredImages[this.currentImageIndex];
    if (image && confirm(`Are you sure you want to delete "${image.name}"?`)) {
      this.images = this.images.filter((img) => img.id !== image.id);
      this.saveImages();
      this.closeLightbox();
      this.renderGallery();
      this.updateStats();
      this.showNotification("Image deleted!", "success");
    }
  }

  updateStats() {
    const imageCount = this.images.length;
    const totalSize = this.images.reduce((sum, img) => sum + img.size, 0);

    document.getElementById("imageCount").textContent = `${imageCount} image${
      imageCount !== 1 ? "s" : ""
    }`;
    document.getElementById("storageUsed").textContent =
      this.formatFileSize(totalSize) + " used";
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  showUploadModal() {
    document.getElementById("uploadModal").style.display = "flex";
  }

  hideUploadModal() {
    document.getElementById("uploadModal").style.display = "none";
    document.getElementById("progressFill").style.width = "0%";
    document.getElementById("progressText").textContent = "0%";
  }

  updateUploadProgress(percentage) {
    document.getElementById("progressFill").style.width = percentage + "%";
    document.getElementById("progressText").textContent =
      Math.round(percentage) + "%";
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

  saveImages() {
    localStorage.setItem("galleryImages", JSON.stringify(this.images));
  }

  loadSampleImages() {
    if (this.images.length === 0) {
      // Add some sample images using placeholder service
      const sampleImages = [
        {
          id: Date.now() + 1,
          name: "Mountain Landscape.jpg",
          src: "https://picsum.photos/400/300?random=1",
          size: 245760,
          type: "image/jpeg",
          uploadedAt: new Date().toISOString(),
          favorite: true,
          tags: ["mountain", "landscape", "nature"],
        },
        {
          id: Date.now() + 2,
          name: "City Skyline.png",
          src: "https://picsum.photos/400/300?random=2",
          size: 189440,
          type: "image/png",
          uploadedAt: new Date().toISOString(),
          favorite: false,
          tags: ["city", "skyline", "urban"],
        },
        {
          id: Date.now() + 3,
          name: "Forest Path.jpg",
          src: "https://picsum.photos/400/300?random=3",
          size: 312320,
          type: "image/jpeg",
          uploadedAt: new Date().toISOString(),
          favorite: false,
          tags: ["forest", "path", "nature"],
        },
      ];

      this.images = sampleImages;
      this.saveImages();
      this.renderGallery();
      this.updateStats();
    }
  }
}

// Initialize the gallery
const gallery = new ImageGallery();
