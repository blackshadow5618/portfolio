class PasswordGenerator {
  constructor() {
    this.recentPasswords =
      JSON.parse(localStorage.getItem("recentPasswords")) || [];
    this.charSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateLengthDisplay();
    this.renderRecentPasswords();
  }

  bindEvents() {
    // Generate button
    document.getElementById("generateBtn").addEventListener("click", () => {
      this.generatePassword();
    });

    // Refresh button
    document.getElementById("refreshBtn").addEventListener("click", () => {
      this.generatePassword();
    });

    // Copy button
    document.getElementById("copyBtn").addEventListener("click", () => {
      this.copyToClipboard();
    });

    // Length slider
    document.getElementById("length").addEventListener("input", () => {
      this.updateLengthDisplay();
    });

    // Keyboard shortcut
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "Enter":
            e.preventDefault();
            this.generatePassword();
            break;
          case "c":
            if (document.getElementById("passwordOutput").value) {
              e.preventDefault();
              this.copyToClipboard();
            }
            break;
        }
      }
    });
  }

  generatePassword() {
    const length = parseInt(document.getElementById("length").value);
    const options = {
      uppercase: document.getElementById("uppercase").checked,
      lowercase: document.getElementById("lowercase").checked,
      numbers: document.getElementById("numbers").checked,
      symbols: document.getElementById("symbols").checked,
    };

    // Validate at least one option is selected
    const hasSelection = Object.values(options).some((option) => option);
    if (!hasSelection) {
      this.showNotification(
        "Please select at least one character type",
        "error"
      );
      return;
    }

    let charset = "";
    if (options.uppercase) charset += this.charSets.uppercase;
    if (options.lowercase) charset += this.charSets.lowercase;
    if (options.numbers) charset += this.charSets.numbers;
    if (options.symbols) charset += this.charSets.symbols;

    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Ensure password contains at least one character from each selected type
    password = this.ensureComplexity(password, options);

    document.getElementById("passwordOutput").value = password;
    this.updateStrengthIndicator(password);
    this.addToRecent(password);
    this.showNotification("Password generated successfully!", "success");
  }

  ensureComplexity(password, options) {
    const chars = password.split("");
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      let valid = true;

      if (options.uppercase && !/[A-Z]/.test(password)) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        chars[randomIndex] = this.charSets.uppercase.charAt(
          Math.floor(Math.random() * this.charSets.uppercase.length)
        );
        valid = false;
      }

      if (options.lowercase && !/[a-z]/.test(password)) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        chars[randomIndex] = this.charSets.lowercase.charAt(
          Math.floor(Math.random() * this.charSets.lowercase.length)
        );
        valid = false;
      }

      if (options.numbers && !/\d/.test(password)) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        chars[randomIndex] = this.charSets.numbers.charAt(
          Math.floor(Math.random() * this.charSets.numbers.length)
        );
        valid = false;
      }

      if (
        options.symbols &&
        !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
      ) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        chars[randomIndex] = this.charSets.symbols.charAt(
          Math.floor(Math.random() * this.charSets.symbols.length)
        );
        valid = false;
      }

      if (valid) break;

      password = chars.join("");
      attempts++;
    }

    return password;
  }

  updateStrengthIndicator(password) {
    const strength = this.calculateStrength(password);
    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");

    strengthBar.className = "strength-fill";

    switch (strength.level) {
      case "very-weak":
        strengthBar.classList.add("very-weak");
        strengthText.textContent = "Very Weak";
        break;
      case "weak":
        strengthBar.classList.add("weak");
        strengthText.textContent = "Weak";
        break;
      case "fair":
        strengthBar.classList.add("fair");
        strengthText.textContent = "Fair";
        break;
      case "good":
        strengthBar.classList.add("good");
        strengthText.textContent = "Good";
        break;
      case "strong":
        strengthBar.classList.add("strong");
        strengthText.textContent = "Strong";
        break;
      case "very-strong":
        strengthBar.classList.add("very-strong");
        strengthText.textContent = "Very Strong";
        break;
    }

    strengthBar.style.width = strength.score + "%";
  }

  calculateStrength(password) {
    let score = 0;
    let level = "very-weak";

    // Length scoring
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    // Character variety scoring
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/\d/.test(password)) score += 15;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 15;

    // Complexity bonuses
    if (
      password.length >= 12 &&
      /[a-zA-Z]/.test(password) &&
      /\d/.test(password)
    )
      score += 5;
    if (
      password.length >= 12 &&
      /[a-zA-Z]/.test(password) &&
      /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
    )
      score += 5;

    // Determine level
    if (score >= 90) level = "very-strong";
    else if (score >= 80) level = "strong";
    else if (score >= 70) level = "good";
    else if (score >= 60) level = "fair";
    else if (score >= 40) level = "weak";

    return { score: Math.min(score, 100), level };
  }

  copyToClipboard() {
    const passwordOutput = document.getElementById("passwordOutput");
    const password = passwordOutput.value;

    if (!password) {
      this.showNotification("No password to copy", "error");
      return;
    }

    passwordOutput.select();
    document.execCommand("copy");

    // Visual feedback
    const copyBtn = document.getElementById("copyBtn");
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
        `;
    copyBtn.style.background = "#4CAF50";

    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
      copyBtn.style.background = "";
    }, 2000);

    this.showNotification("Password copied to clipboard!", "success");
  }

  updateLengthDisplay() {
    const length = document.getElementById("length").value;
    document.getElementById("lengthValue").textContent = length;
  }

  addToRecent(password) {
    // Remove if already exists
    this.recentPasswords = this.recentPasswords.filter((p) => p !== password);

    // Add to beginning
    this.recentPasswords.unshift(password);

    // Keep only last 10
    if (this.recentPasswords.length > 10) {
      this.recentPasswords = this.recentPasswords.slice(0, 10);
    }

    this.saveRecentPasswords();
    this.renderRecentPasswords();
  }

  renderRecentPasswords() {
    const recentList = document.getElementById("recentPasswords");

    if (this.recentPasswords.length === 0) {
      recentList.innerHTML =
        '<p class="empty-message">No passwords generated yet</p>';
      return;
    }

    recentList.innerHTML = "";

    this.recentPasswords.forEach((password, index) => {
      const passwordItem = document.createElement("div");
      passwordItem.className = "recent-password-item";
      passwordItem.innerHTML = `
                <span class="password-text">${this.maskPassword(
                  password
                )}</span>
                <div class="password-actions">
                    <button onclick="passwordGenerator.copyRecent(${index})" class="btn-icon copy-recent" title="Copy">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                    <button onclick="passwordGenerator.useRecent(${index})" class="btn-icon use-recent" title="Use this password">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                    </button>
                </div>
            `;
      recentList.appendChild(passwordItem);
    });
  }

  maskPassword(password) {
    if (password.length <= 8) return password;
    return (
      password.substring(0, 4) +
      "•".repeat(password.length - 8) +
      password.substring(password.length - 4)
    );
  }

  copyRecent(index) {
    const password = this.recentPasswords[index];
    navigator.clipboard.writeText(password).then(() => {
      this.showNotification("Password copied to clipboard!", "success");
    });
  }

  useRecent(index) {
    const password = this.recentPasswords[index];
    document.getElementById("passwordOutput").value = password;
    this.updateStrengthIndicator(password);
    this.showNotification("Password loaded!", "success");
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

  saveRecentPasswords() {
    localStorage.setItem(
      "recentPasswords",
      JSON.stringify(this.recentPasswords)
    );
  }
}

// Initialize the password generator
const passwordGenerator = new PasswordGenerator();
