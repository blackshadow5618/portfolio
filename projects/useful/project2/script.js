class ExpenseTracker {
  constructor() {
    this.expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    this.income = parseFloat(localStorage.getItem("income")) || 0;
    this.chart = null;
    this.init();
  }

  init() {
    this.renderExpenses();
    this.updateSummary();
    this.createChart();
    this.bindEvents();
  }

  bindEvents() {
    document.getElementById("expenseForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.addExpense();
    });

    document.getElementById("exportBtn").addEventListener("click", () => {
      this.exportData();
    });
  }

  addExpense() {
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!description || isNaN(amount) || amount <= 0) {
      this.showNotification(
        "Please enter valid description and amount",
        "error"
      );
      return;
    }

    const expense = {
      id: Date.now(),
      description,
      amount,
      category,
      date: new Date().toISOString(),
      type: amount > 0 ? "expense" : "income",
    };

    this.expenses.push(expense);
    this.saveData();

    // Clear form
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";

    this.renderExpenses();
    this.updateSummary();
    this.updateChart();
    this.showNotification("Expense added successfully!", "success");
  }

  deleteExpense(id) {
    this.expenses = this.expenses.filter((expense) => expense.id !== id);
    this.saveData();
    this.renderExpenses();
    this.updateSummary();
    this.updateChart();
    this.showNotification("Expense deleted successfully!", "success");
  }

  renderExpenses() {
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    if (this.expenses.length === 0) {
      expenseList.innerHTML =
        '<p class="text-gray-500 text-center py-8">No expenses yet. Add your first expense above!</p>';
      return;
    }

    // Sort by date (newest first)
    const sortedExpenses = [...this.expenses].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    sortedExpenses.forEach((expense) => {
      const expenseItem = document.createElement("div");
      expenseItem.className =
        "flex items-center justify-between p-4 bg-gray-50 rounded-lg";
      expenseItem.innerHTML = `
                <div class="flex-1">
                    <div class="font-semibold">${expense.description}</div>
                    <div class="text-sm text-gray-600">${
                      expense.category
                    } • ${this.formatDate(expense.date)}</div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="font-bold ${
                      expense.amount > 0 ? "text-red-600" : "text-green-600"
                    }">
                        ${expense.amount > 0 ? "-" : "+"}$${Math.abs(
        expense.amount
      ).toFixed(2)}
                    </span>
                    <button onclick="expenseTracker.deleteExpense(${
                      expense.id
                    })" class="text-red-500 hover:text-red-700 transition duration-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            `;
      expenseList.appendChild(expenseItem);
    });
  }

  updateSummary() {
    const expenses = this.expenses.filter((e) => e.amount > 0);
    const income = this.expenses.filter((e) => e.amount < 0);

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const totalIncome = Math.abs(
      income.reduce((sum, inc) => sum + inc.amount, 0)
    );
    const balance = totalIncome - totalExpenses;

    document.getElementById(
      "totalExpenses"
    ).textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById(
      "totalIncome"
    ).textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById("balance").textContent = `$${balance.toFixed(2)}`;

    // Update balance color
    const balanceEl = document.getElementById("balance");
    balanceEl.className =
      balance >= 0
        ? "text-2xl font-bold text-green-600"
        : "text-2xl font-bold text-red-600";
  }

  createChart() {
    const ctx = document.getElementById("expenseChart").getContext("2d");

    // Group expenses by category
    const categoryTotals = {};
    this.expenses
      .filter((e) => e.amount > 0)
      .forEach((expense) => {
        categoryTotals[expense.category] =
          (categoryTotals[expense.category] || 0) + expense.amount;
      });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#FF6384",
              "#C9CBCF",
            ],
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ": $" + context.parsed.toFixed(2);
              },
            },
          },
        },
      },
    });
  }

  exportData() {
    const data = {
      expenses: this.expenses,
      summary: {
        totalExpenses: this.expenses
          .filter((e) => e.amount > 0)
          .reduce((sum, e) => sum + e.amount, 0),
        totalIncome: Math.abs(
          this.expenses
            .filter((e) => e.amount < 0)
            .reduce((sum, e) => sum + e.amount, 0)
        ),
        balance:
          Math.abs(
            this.expenses
              .filter((e) => e.amount < 0)
              .reduce((sum, e) => sum + e.amount, 0)
          ) -
          this.expenses
            .filter((e) => e.amount > 0)
            .reduce((sum, e) => sum + e.amount, 0),
      },
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expense-tracker-export-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification("Data exported successfully!", "success");
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-semibold z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  saveData() {
    localStorage.setItem("expenses", JSON.stringify(this.expenses));
  }
}

// Initialize the expense tracker
const expenseTracker = new ExpenseTracker();
