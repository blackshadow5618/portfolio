// Drawing App with improved error handling and performance
const DrawingApp = {
  canvas: null,
  ctx: null,
  isDrawing: false,
  lastX: 0,
  lastY: 0,
  currentColor: "#000000",
  currentBrushSize: 5,

  init() {
    try {
      this.cacheElements();
      this.setupCanvas();
      this.bindEvents();
      this.resizeCanvas();
    } catch (error) {
      console.error("Failed to initialize drawing app:", error);
      this.showError("Failed to initialize drawing app");
    }
  },

  cacheElements() {
    this.elements = {
      canvas: document.getElementById("canvas"),
      colorPicker: document.getElementById("color"),
      brushSize: document.getElementById("brushSize"),
      sizeValue: document.getElementById("sizeValue"),
      clearBtn: document.getElementById("clearBtn"),
      saveBtn: document.getElementById("saveBtn"),
    };

    if (!this.elements.canvas) {
      throw new Error("Canvas element not found");
    }
  },

  setupCanvas() {
    this.canvas = this.elements.canvas;
    this.ctx = this.canvas.getContext("2d");

    if (!this.ctx) {
      throw new Error("Canvas context not supported");
    }

    // Set initial canvas properties
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = this.currentBrushSize;
    this.ctx.strokeStyle = this.currentColor;

    // Set canvas background to white
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  bindEvents() {
    // Brush size control
    this.elements.brushSize.addEventListener("input", (e) => {
      this.currentBrushSize = parseInt(e.target.value) || 1;
      this.elements.sizeValue.textContent = this.currentBrushSize;
      this.ctx.lineWidth = this.currentBrushSize;
    });

    // Color picker
    this.elements.colorPicker.addEventListener("input", (e) => {
      this.currentColor = e.target.value;
      this.ctx.strokeStyle = this.currentColor;
    });

    // Clear canvas
    this.elements.clearBtn.addEventListener("click", () => this.clearCanvas());

    // Save canvas
    this.elements.saveBtn.addEventListener("click", () => this.saveCanvas());

    // Drawing events
    this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
    this.canvas.addEventListener("mousemove", (e) => this.draw(e));
    this.canvas.addEventListener("mouseup", () => this.stopDrawing());
    this.canvas.addEventListener("mouseout", () => this.stopDrawing());

    // Touch events for mobile
    this.canvas.addEventListener("touchstart", (e) => this.handleTouchStart(e));
    this.canvas.addEventListener("touchmove", (e) => this.handleTouchMove(e));
    this.canvas.addEventListener("touchend", () => this.stopDrawing());

    // Window resize
    window.addEventListener("resize", () => this.resizeCanvas());

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  },

  handleKeyboard(e) {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "z":
          e.preventDefault();
          // Could implement undo functionality here
          break;
        case "s":
          e.preventDefault();
          this.saveCanvas();
          break;
        case "c":
          if (e.shiftKey) {
            e.preventDefault();
            this.clearCanvas();
          }
          break;
      }
    }
  },

  getCanvasCoordinates(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  },

  startDrawing(e) {
    e.preventDefault();
    const coords = this.getCanvasCoordinates(e);
    this.isDrawing = true;
    [this.lastX, this.lastY] = [coords.x, coords.y];
  },

  draw(e) {
    if (!this.isDrawing) return;

    e.preventDefault();
    const coords = this.getCanvasCoordinates(e);

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(coords.x, coords.y);
    this.ctx.stroke();

    [this.lastX, this.lastY] = [coords.x, coords.y];
  },

  stopDrawing() {
    this.isDrawing = false;
  },

  handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const coords = this.getCanvasCoordinates(touch);
      this.startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
    }
  },

  handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.draw({ clientX: touch.clientX, clientY: touch.clientY });
    }
  },

  clearCanvas() {
    if (confirm("Are you sure you want to clear the canvas?")) {
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  saveCanvas() {
    try {
      const link = document.createElement("a");
      link.download = `drawing_${new Date().toISOString().split("T")[0]}.png`;
      link.href = this.canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error saving canvas:", error);
      this.showError("Failed to save drawing");
    }
  },

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    // Restore canvas properties after resize
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.lineWidth = this.currentBrushSize;
    this.ctx.strokeStyle = this.currentColor;

    // Restore the drawing
    this.ctx.putImageData(imageData, 0, 0);
  },

  showError(message) {
    let errorEl = document.getElementById("drawing-error");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.id = "drawing-error";
      errorEl.style.color = "red";
      errorEl.style.marginTop = "10px";
      errorEl.style.textAlign = "center";
      document.body.appendChild(errorEl);
    }
    errorEl.textContent = message;

    setTimeout(() => {
      if (errorEl) {
        errorEl.remove();
      }
    }, 3000);
  },
};

// Initialize the drawing app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  DrawingApp.init();
});
