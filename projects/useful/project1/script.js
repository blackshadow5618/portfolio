class URLShortener {
  constructor() {
    this.urls = JSON.parse(localStorage.getItem("shortenedUrls")) || {};
    this.init();
  }

  init() {
    document.getElementById("urlForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.shortenUrl();
    });

    document.getElementById("copyBtn").addEventListener("click", () => {
      this.copyToClipboard();
    });

    this.renderUrlList();
  }

  validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  shortenUrl() {
    const longUrl = document.getElementById("longUrl").value.trim();
    const errorDiv = document.getElementById("error");

    if (!longUrl) {
      this.showError("Please enter a URL");
      return;
    }

    if (!this.validateUrl(longUrl)) {
      this.showError("Please enter a valid URL");
      return;
    }

    // Generate short code
    const shortCode = this.generateShortCode();
    const shortUrl = `${window.location.origin}/s/${shortCode}`;

    // Store URL data
    this.urls[shortCode] = {
      longUrl: longUrl,
      shortUrl: shortUrl,
      clicks: 0,
      created: new Date().toISOString(),
    };

    this.saveUrls();
    this.showResult(shortUrl, shortCode);
    this.renderUrlList();
    document.getElementById("longUrl").value = "";
  }

  generateShortCode() {
    let code;
    do {
      code = Math.random().toString(36).substring(2, 8);
    } while (this.urls[code]);
    return code;
  }

  showResult(shortUrl, shortCode) {
    document.getElementById("shortUrl").value = shortUrl;
    document.getElementById("clickCount").textContent =
      this.urls[shortCode].clicks;
    document.getElementById("result").classList.remove("d-none");
    document.getElementById("error").classList.add("d-none");
  }

  showError(message) {
    document.getElementById("error").textContent = message;
    document.getElementById("error").classList.remove("d-none");
    document.getElementById("result").classList.add("d-none");
  }

  copyToClipboard() {
    const shortUrlInput = document.getElementById("shortUrl");
    shortUrlInput.select();
    document.execCommand("copy");

    const copyBtn = document.getElementById("copyBtn");
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    copyBtn.classList.remove("btn-outline-secondary");
    copyBtn.classList.add("btn-success");

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.classList.remove("btn-success");
      copyBtn.classList.add("btn-outline-secondary");
    }, 2000);
  }

  renderUrlList() {
    const urlList = document.getElementById("urlList");
    urlList.innerHTML = "";

    if (Object.keys(this.urls).length === 0) {
      urlList.innerHTML =
        '<p class="text-muted mb-0">No shortened URLs yet.</p>';
      return;
    }

    Object.entries(this.urls)
      .reverse()
      .forEach(([shortCode, data]) => {
        const item = document.createElement("div");
        item.className =
          "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
                <div class="flex-grow-1">
                    <div class="fw-bold text-truncate">${data.longUrl}</div>
                    <small class="text-muted">${data.shortUrl} • ${data.clicks} clicks</small>
                </div>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="urlShortener.copyUrl('${shortCode}')">Copy</button>
                    <button class="btn btn-outline-danger" onclick="urlShortener.deleteUrl('${shortCode}')">Delete</button>
                </div>
            `;
        urlList.appendChild(item);
      });
  }

  copyUrl(shortCode) {
    const tempInput = document.createElement("input");
    tempInput.value = this.urls[shortCode].shortUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    // Show temporary success message
    const notification = document.createElement("div");
    notification.className =
      "alert alert-success position-fixed top-50 start-50 translate-middle";
    notification.style.zIndex = "9999";
    notification.textContent = "URL copied to clipboard!";
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  }

  deleteUrl(shortCode) {
    if (confirm("Are you sure you want to delete this shortened URL?")) {
      delete this.urls[shortCode];
      this.saveUrls();
      this.renderUrlList();
    }
  }

  saveUrls() {
    localStorage.setItem("shortenedUrls", JSON.stringify(this.urls));
  }

  // Method to handle clicks (would be used in a real deployment)
  trackClick(shortCode) {
    if (this.urls[shortCode]) {
      this.urls[shortCode].clicks++;
      this.saveUrls();
      return this.urls[shortCode].longUrl;
    }
    return null;
  }
}

// Initialize the URL shortener
const urlShortener = new URLShortener();
