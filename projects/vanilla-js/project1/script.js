let display = document.getElementById("display");

// Safe mathematical expression evaluator
function safeEval(expression) {
  // Remove any non-mathematical characters for security
  const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, "");

  // Check for division by zero
  if (/\/0/.test(sanitized)) {
    throw new Error("Division by zero");
  }

  // Use Function constructor instead of eval for better security
  try {
    // eslint-disable-next-line no-new-func
    return new Function("return " + sanitized)();
  } catch (error) {
    throw new Error("Invalid expression");
  }
}

function appendToDisplay(value) {
  // Limit input length to prevent overflow
  if (display.value.length >= 50) {
    showError("Input too long");
    return;
  }
  display.value += value;
}

function clearDisplay() {
  display.value = "";
  hideError();
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
  hideError();
}

function calculateResult() {
  try {
    if (!display.value.trim()) {
      throw new Error("Empty expression");
    }
    const result = safeEval(display.value);
    if (!isFinite(result)) {
      throw new Error("Invalid result");
    }
    display.value = result;
    hideError();
  } catch (error) {
    showError(error.message);
  }
}

function showError(message) {
  let errorEl = document.getElementById("error-message");
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "error-message";
    errorEl.style.color = "red";
    errorEl.style.fontSize = "0.9em";
    errorEl.style.marginTop = "5px";
    display.parentNode.insertBefore(errorEl, display.nextSibling);
  }
  errorEl.textContent = message;
}

function hideError() {
  const errorEl = document.getElementById("error-message");
  if (errorEl) {
    errorEl.remove();
  }
}

// Keyboard support
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    appendToDisplay(key);
  } else if (
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/" ||
    key === "."
  ) {
    appendToDisplay(key);
  } else if (key === "Enter" || key === "=") {
    calculateResult();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape" || key === "c" || key === "C") {
    clearDisplay();
  }
});
