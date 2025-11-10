// Weather App with improved error handling and performance
const WeatherAPI = {
  apiKey: "YOUR_API_KEY_HERE", // Replace with actual API key from OpenWeatherMap
  baseUrl: "https://api.openweathermap.org/data/2.5/weather",
  cache: new Map(),
  cacheTimeout: 10 * 60 * 1000, // 10 minutes

  async fetchWeather(city) {
    // Input validation
    if (!city || typeof city !== "string") {
      throw new Error("Invalid city name");
    }

    const sanitizedCity = city.trim();
    if (!sanitizedCity) {
      throw new Error("City name cannot be empty");
    }

    // Check cache first
    const cacheKey = sanitizedCity.toLowerCase();
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?q=${encodeURIComponent(sanitizedCity)}&appid=${
          this.apiKey
        }&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found");
        } else if (response.status === 401) {
          throw new Error("Invalid API key");
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      }

      const data = await response.json();

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Network error. Please check your internet connection."
        );
      }
      throw error;
    }
  },
};

// Mock data for demonstration when API key is not set
function getMockWeatherData(city) {
  const mockData = {
    london: {
      name: "London",
      sys: { country: "GB" },
      main: { temp: 15, humidity: 72, pressure: 1013 },
      weather: [{ description: "Partly cloudy", icon: "02d" }],
      wind: { speed: 3.5 },
    },
    "new york": {
      name: "New York",
      sys: { country: "US" },
      main: { temp: 22, humidity: 65, pressure: 1015 },
      weather: [{ description: "Sunny", icon: "01d" }],
      wind: { speed: 2.1 },
    },
    tokyo: {
      name: "Tokyo",
      sys: { country: "JP" },
      main: { temp: 18, humidity: 78, pressure: 1012 },
      weather: [{ description: "Light rain", icon: "10d" }],
      wind: { speed: 4.2 },
    },
  };
  return mockData[city.toLowerCase()] || null;
}

const WeatherUI = {
  elements: {},

  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadDefaultCity();
  },

  cacheElements() {
    this.elements = {
      cityInput: document.getElementById("cityInput"),
      searchBtn: document.getElementById("searchBtn"),
      weatherInfo: document.getElementById("weatherInfo"),
      errorMessage: document.getElementById("errorMessage"),
      loading: document.getElementById("loading"),
    };
  },

  bindEvents() {
    this.elements.searchBtn.addEventListener("click", () =>
      this.searchWeather()
    );
    this.elements.cityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.searchWeather();
      }
    });

    // Debounced input for better performance
    let debounceTimer;
    this.elements.cityInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // Could implement autocomplete here
      }, 300);
    });
  },

  async searchWeather() {
    const city = this.elements.cityInput.value.trim();
    if (!city) {
      this.showError("Please enter a city name");
      return;
    }

    try {
      this.showLoading();
      let data;

      if (WeatherAPI.apiKey === "YOUR_API_KEY_HERE") {
        // Use mock data if no API key
        data = getMockWeatherData(city);
        if (!data) {
          throw new Error("City not found in demo data");
        }
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        data = await WeatherAPI.fetchWeather(city);
      }

      this.displayWeather(data);
    } catch (error) {
      this.showError(error.message);
    }
  },

  showLoading() {
    this.elements.weatherInfo.classList.add("hidden");
    this.elements.errorMessage.classList.add("hidden");
    this.elements.loading.classList.remove("hidden");
  },

  showWeather() {
    this.elements.weatherInfo.classList.remove("hidden");
    this.elements.errorMessage.classList.add("hidden");
    this.elements.loading.classList.add("hidden");
  },

  showError(message) {
    this.elements.weatherInfo.classList.add("hidden");
    this.elements.errorMessage.classList.remove("hidden");
    this.elements.loading.classList.add("hidden");
    this.elements.errorMessage.textContent = message;
  },

  displayWeather(data) {
    document.getElementById(
      "cityName"
    ).textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temp").textContent = Math.round(data.main.temp);
    document.getElementById("description").textContent =
      data.weather[0].description;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("windSpeed").textContent = `${data.wind.speed} m/s`;
    document.getElementById(
      "pressure"
    ).textContent = `${data.main.pressure} hPa`;

    const iconCode = data.weather[0].icon;
    document.getElementById(
      "weatherIcon"
    ).src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    this.showWeather();
  },

  async loadDefaultCity() {
    try {
      this.showLoading();
      let data;

      if (WeatherAPI.apiKey === "YOUR_API_KEY_HERE") {
        data = getMockWeatherData("London");
      } else {
        data = await WeatherAPI.fetchWeather("London");
      }

      this.displayWeather(data);
    } catch (error) {
      this.showError("Failed to load default weather data");
    }
  },
};

// Initialize the weather app
document.addEventListener("DOMContentLoaded", () => {
  WeatherUI.init();
});
