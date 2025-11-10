// Quiz Game with improved error handling and validation
const QuizData = {
  questions: [
    {
      id: 1,
      question: "What is the capital of France?",
      answers: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      answers: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
    },
    {
      id: 3,
      question: "What is 2 + 2?",
      answers: ["3", "4", "5", "6"],
      correct: 1,
    },
    {
      id: 4,
      question: "Who painted the Mona Lisa?",
      answers: [
        "Vincent van Gogh",
        "Pablo Picasso",
        "Leonardo da Vinci",
        "Michelangelo",
      ],
      correct: 2,
    },
    {
      id: 5,
      question: "What is the largest ocean on Earth?",
      answers: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean",
      ],
      correct: 3,
    },
  ],

  validate() {
    if (!Array.isArray(this.questions) || this.questions.length === 0) {
      throw new Error("No questions available");
    }

    this.questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.answers) || q.answers.length < 2) {
        throw new Error(`Invalid question at index ${index}`);
      }
      if (
        typeof q.correct !== "number" ||
        q.correct < 0 ||
        q.correct >= q.answers.length
      ) {
        throw new Error(`Invalid correct answer for question ${index}`);
      }
    });
  },
};

const QuizGame = {
  currentQuestionIndex: 0,
  score: 0,
  selectedAnswer: null,
  timeLimit: 30, // seconds per question
  timer: null,

  init() {
    try {
      QuizData.validate();
      this.cacheElements();
      this.bindEvents();
      this.showScreen("start");
    } catch (error) {
      console.error("Quiz initialization failed:", error);
      this.showError("Failed to load quiz. Please refresh the page.");
    }
  },

  cacheElements() {
    this.elements = {
      startScreen: document.getElementById("startScreen"),
      quizScreen: document.getElementById("quizScreen"),
      resultScreen: document.getElementById("resultScreen"),
      startBtn: document.getElementById("startBtn"),
      restartBtn: document.getElementById("restartBtn"),
      questionEl: document.getElementById("question"),
      answersEl: document.getElementById("answers"),
      scoreEl: document.getElementById("score"),
      progressEl: document.getElementById("progress"),
      finalScoreEl: document.getElementById("finalScore"),
      percentageEl: document.getElementById("percentage"),
      timerEl: document.getElementById("timer"),
    };
  },

  bindEvents() {
    this.elements.startBtn.addEventListener("click", () => this.startQuiz());
    this.elements.restartBtn.addEventListener("click", () =>
      this.restartQuiz()
    );

    // Keyboard navigation
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));

    // Create and add next button
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.id = "nextBtn";
    nextBtn.setAttribute("aria-label", "Next question");
    nextBtn.addEventListener("click", () => this.nextQuestion());
    this.elements.quizScreen.appendChild(nextBtn);
  },

  handleKeyPress(e) {
    if (
      this.elements.startScreen &&
      !this.elements.startScreen.classList.contains("hidden")
    ) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.startQuiz();
      }
    } else if (
      this.elements.quizScreen &&
      !this.elements.quizScreen.classList.contains("hidden")
    ) {
      if (e.key >= "1" && e.key <= "4") {
        e.preventDefault();
        const answerIndex = parseInt(e.key) - 1;
        this.selectAnswer(answerIndex);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.nextQuestion();
      }
    } else if (
      this.elements.resultScreen &&
      !this.elements.resultScreen.classList.contains("hidden")
    ) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.restartQuiz();
      }
    }
  },

  startQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedAnswer = null;
    this.showScreen("quiz");
    this.loadQuestion();
  },

  showScreen(screenName) {
    const screens = ["startScreen", "quizScreen", "resultScreen"];
    screens.forEach((name) => {
      const screen = this.elements[name];
      if (screen) {
        screen.classList.add("hidden");
      }
    });

    const targetScreen = this.elements[screenName];
    if (targetScreen) {
      targetScreen.classList.remove("hidden");
    }
  },

  loadQuestion() {
    try {
      const question = QuizData.questions[this.currentQuestionIndex];
      if (!question) {
        throw new Error("Question not found");
      }

      this.elements.questionEl.textContent = question.question;
      this.elements.answersEl.innerHTML = "";

      question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = `${index + 1}. ${answer}`;
        button.className = "answer-btn";
        button.setAttribute("aria-label", `Answer ${index + 1}: ${answer}`);
        button.addEventListener("click", () => this.selectAnswer(index));
        this.elements.answersEl.appendChild(button);
      });

      this.selectedAnswer = null;
      this.updateProgress();
      this.updateScore();
      this.startTimer();
    } catch (error) {
      console.error("Error loading question:", error);
      this.showError("Failed to load question");
    }
  },

  selectAnswer(index) {
    if (
      index < 0 ||
      index >= QuizData.questions[this.currentQuestionIndex].answers.length
    ) {
      return;
    }

    this.selectedAnswer = index;
    const buttons = this.elements.answersEl.querySelectorAll(".answer-btn");
    buttons.forEach((btn, i) => {
      btn.classList.toggle("selected", i === index);
    });
  },

  nextQuestion() {
    if (this.selectedAnswer === null) {
      this.showError("Please select an answer before continuing");
      return;
    }

    this.clearTimer();

    const currentQuestion = QuizData.questions[this.currentQuestionIndex];
    if (this.selectedAnswer === currentQuestion.correct) {
      this.score++;
    }

    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < QuizData.questions.length) {
      this.loadQuestion();
    } else {
      this.showResult();
    }
  },

  startTimer() {
    let timeLeft = this.timeLimit;
    this.updateTimer(timeLeft);

    this.timer = setInterval(() => {
      timeLeft--;
      this.updateTimer(timeLeft);

      if (timeLeft <= 0) {
        this.clearTimer();
        this.nextQuestion(); // Auto-advance if time runs out
      }
    }, 1000);
  },

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  updateTimer(timeLeft) {
    if (this.elements.timerEl) {
      this.elements.timerEl.textContent = `Time: ${timeLeft}s`;
      this.elements.timerEl.style.color = timeLeft <= 10 ? "red" : "inherit";
    }
  },

  updateProgress() {
    const progress =
      ((this.currentQuestionIndex + 1) / QuizData.questions.length) * 100;
    this.elements.progressEl.style.width = `${progress}%`;
  },

  updateScore() {
    this.elements.scoreEl.textContent = this.score;
  },

  showResult() {
    this.clearTimer();

    const percentage = Math.round(
      (this.score / QuizData.questions.length) * 100
    );
    this.elements.finalScoreEl.textContent = `${this.score}/${QuizData.questions.length}`;
    this.elements.percentageEl.textContent = `${percentage}%`;

    this.showScreen("result");
  },

  restartQuiz() {
    this.clearTimer();
    this.showScreen("start");
  },

  showError(message) {
    // Create or update error message element
    let errorEl = document.getElementById("quiz-error");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.id = "quiz-error";
      errorEl.style.color = "red";
      errorEl.style.marginTop = "10px";
      errorEl.style.textAlign = "center";
      document.body.appendChild(errorEl);
    }
    errorEl.textContent = message;

    // Auto-hide error after 3 seconds
    setTimeout(() => {
      if (errorEl) {
        errorEl.remove();
      }
    }, 3000);
  },
};

// Initialize the quiz when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  QuizGame.init();
});
