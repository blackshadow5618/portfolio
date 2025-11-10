// Portfolio Application - Modern JavaScript Implementation
class PortfolioApp {
  constructor() {
    this.projects = [];
    this.currentFilter = "all";
    this.searchTerm = "";
    this.elements = {};
    this.init();
  }

  init() {
    this.loadProjects();
    this.cacheElements();
    this.bindEvents();
    this.renderProjects();
  }

  loadProjects() {
    this.projects = [
      {
        id: 1,
        title: "E-commerce Dashboard",
        description:
          "A comprehensive dashboard for managing online store operations with real-time analytics.",
        tech: "React, Node.js, MongoDB",
        category: "advanced",
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY0NmY0Ii8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXNob3AgRGFzaGJvYXJkPC90ZXh0PjxjaXJjbGUgY3g9IjUwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iIzMzMyIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEyMCIgcj0iMjAiIGZpbGw9IiM2NmY2NmYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMjAiIHI9IjIwIiBmaWxsPSIjZmY2YjZiIi8+PHRleHQgeD0iNTAlIiB5PSI3NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UmVhY3QgJiBBbmFseXRpY3M8L3RleHQ+PC9zdmc+",
        demo: "projects/advanced/project1/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/advanced/project1",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0NzUxIi8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U29jaWFsIE1lZGlhPC90ZXh0PjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIxNDAiIGN5PSIxMDAiIHI9IjIwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeD0iODAiIHk9IjE0MCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC44Ii8+PHRleHQgeD0iNTAlIiB5PSI3NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UG9zdHMgJiBDaGF0czwvdGV4dD48L3N2Zz4+",
        demo: "projects/advanced/project2/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/advanced/project2",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjgzNDM2Ii8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RGF0YSBWaXouPC90ZXh0PjxwYXRoIGQ9Ik0gNTAgMTIwIEwgMTAwIDEwMCBMIDE1MCAxMzAgTCAyMDAgOTAgTCAyNTAgMTEwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMTIwIiByPSI0IiBmaWxsPSIjZmY2YjZiIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI0IiBmaWxsPSIjNGZhNGZmIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTMwIiByPSI0IiBmaWxsPSIjZmY2YjZiIi8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iOTAiIHI9IjQiIGZpbGw9IiM0ZmE0ZmYiLz48Y2lyY2xlIGN4PSIyNTAiIGN5PSIxMTAiIHI9IjQiIGZpbGw9IiNmZjZiNmIiLz48dGV4dCB4PSI1MCUiIHk9Ijc1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DaGFydHMgJiBHcmFwaHM8L3RleHQ+PC9zdmc+",
        demo: "projects/advanced/project3/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/advanced/project3",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2FsY3VsYXRvcjwvdGV4dD48cmVjdCB4PSI3MCIgeT0iODAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI4NSIgeT0iMTE1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjEyMzwvdGV4dD48cmVjdCB4PSI3MCIgeT0iMTQwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI3NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TWF0aCBPcGVyYXRpb25zPC90ZXh0Pjwvc3ZnPg==",
        demo: "projects/vanilla-js/project1/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/vanilla-js/project1",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY0NmY0Ii8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VG8tRG8gTGlzdDwvdGV4dD48cmVjdCB4PSI2MCIgeT0iNzAiIHdpZHRoPSIxODAiIGhlaWdodD0iIzkwIiBmaWxsPSIjZmZmIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHg9IjgwIiB5MT0iOTAiIHgyPSIxMDAiIHkyPSI5MCIgc3Ryb2tlPSIjNDQ0IiBzdHJva2Utd2lkdGg9IjMiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjEwNSIgcj0iNSIgZmlsbD0iIzQ0NCIvPjx0ZXh0IHg9IjExMCIgeT0iOTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyI+Q29tcGxldGUgdGFzazwvdGV4dD48dGV4dCB4PSIxMTAiIHk9IjExNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIj5OZXh0IHRvIGRvPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iODAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRhc2sgTWFuYWdlbWVudDwvdGV4dD48L3N2Zz4=",
        demo: "projects/vanilla-js/project2/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/vanilla-js/project2",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjODdiY2VkIi8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+V2VhdGhlciBBcHA8L3RleHQ+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTEwIiByPSIzMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjE1MCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPtCfmjwvdGV4dD48Y2lyY2xlIGN4PSIxMjAiIGN5PSI4NSIgcj0iOCIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9IjE4MCIgY3k9IjgwIiByPSI2IiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMTQwIiBjeT0iNzUiIHI9IjUiIGZpbGw9IiNmZmYiLz48dGV4dCB4PSI1MCUiIHk9Ijc1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Gb3JlY2FzdHMgJiBNYXBzPC90ZXh0Pjwvc3ZnPg==",
        demo: "projects/vanilla-js/project3/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/vanilla-js/project3",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY5OTJiIi8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UXVpeiBHYW1lPC90ZXh0PjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiM0ZmE0ZmYiLz48Y2lyY2xlIGN4PSIxNDAiIGN5PSIxMDAiIHI9IjIwIiBmaWxsPSIjZmY2YjZiIi8+PGNpcmNsZSBjeD0iMTgwIiBjeT0iMTAwIiByPSIyMCIgZmlsbD0iI2ZmNmI2YiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkE8L3RleHQ+PHRleHQgeD0iMTQwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QjwvdGV4dD48dGV4dCB4PSIxODAiIHk9IjExMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNzUlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk11bHRpcGxlIENob2ljZXM8L3RleHQ+PC9zdmc+",
        demo: "projects/vanilla-js/project4/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/vanilla-js/project4",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RGF3aW5nIEFwcDwvdGV4dD48cGF0aCBkPSJNIDUwIDEwMCBRIDEwMCA4MCAxNTAgMTEwIFQgMjUwIDEwMCIgc3Ryb2tlPSIjZmY2YjZiIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNIDYwIDEyMCBRIDExMCAxMDAgMTYwIDEyNSBUIDI0MCAxMTUiIHN0cm9rZT0iIzRmYTRmZiIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+PGNpcmNsZSBjeD0iMjIwIiBjeT0iMTMwIiByPSI4IiBmaWxsPSIjZmY2YjZiIi8+PGNpcmNsZSBjeD0iMjQwIiBjeT0iMTQwIiByPSI2IiBmaWxsPSIjNGZhNGZmIi8+PGNpcmNsZSBjeD0iMjYwIiBjeT0iMTUwIiByPSI0IiBmaWxsPSIjZmY2YjZiIi8+PHRleHQgeD0iNTAlIiB5PSI3NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QnJ1c2hlcyAmIENvbG9yczwvdGV4dD48L3N2Zz4=",
        demo: "projects/vanilla-js/project5/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/vanilla-js/project5",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjEyNGQ4Ii8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VURLIFNob3J0ZW5lcjwvdGV4dD48cmVjdCB4PSI2MCIgeT0iNzAiIHdpZHRoPSIxODAiIGhlaWdodD0iIzkwIiBmaWxsPSIjZmZmIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjgwIiB5PSI5NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMzMzIj5odHRwczovL2V4YW1wbGUuY29tLzwvdGV4dD48dGV4dCB4PSI4MCIgeT0iMTE1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM0ZmE0ZmYiPkJpdC5seS8xMjN4eXo8L3RleHQ+PGNpcmNsZSBjeD0iMjIwIiBjeT0iMTAwIiByPSI4IiBmaWxsPSIjNGZhNGZmIi8+PHRleHQgeD0iNTAlIiB5PSI3NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2xpY2sgVHJhY2tpbmc8L3RleHQ+PC9zdmc+",
        demo: "projects/useful/project1/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/useful/project1",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTBhMGEwIi8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXhwZW5zZSBUcmFja2VyPC90ZXh0PjxwYXRoIGQ9Ik0gNTAgMTIwIEwgMTAwIDEwMCBMIDE1MCAxMzAgTCAyMDAgOTAgTCAyNTAgMTEwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMTIwIiByPSI0IiBmaWxsPSIjZmY2YjZiIi8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI0IiBmaWxsPSIjNGZhNGZmIi8+PGNpcmNsZSBjeD0iMTUwIiBjeT0iMTMwIiByPSI0IiBmaWxsPSIjZmY2YjZiIi8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iOTAiIHI9IjQiIGZpbGw9IiM0ZmE0ZmYiLz48Y2lyY2xlIGN4PSIyNTAiIGN5PSIxMTAiIHI9IjQiIGZpbGw9IiNmZjZiNmIiLz48dGV4dCB4PSI1MCUiIHk9Ijc1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DaGFydHMgJiBCdWRnZXQ8L3RleHQ+PC9zdmc+",
        demo: "projects/useful/project2/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/useful/project2",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmZmNjIi8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm90ZS1Ua2luZyBBcHA8L3RleHQ+PHJlY3QgeD0iNjAiIHk9IjcwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjZmZmIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjgwIiB5PSI5NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMzMzIj5NeSBUb2RvIExpc3Q8L3RleHQ+PHRleHQgeD0iODAiIHk9IjExNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMzMzIj5Xb3JrIE5vdGVzPC90ZXh0Pjx0ZXh0IHg9IjgwIiB5PSIxMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzMzMyI+UHJvamVjdCBJZGVhczwvdGV4dD48dGV4dCB4PSI1MCUiIHk9Ijc1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Pmdhbml6YXRpb24gJiBTZWFyY2g8L3RleHQ+PC9zdmc+",
        demo: "projects/useful/project3/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/useful/project3",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgR2FsbGVyeTwvdGV4dD48cmVjdCB4PSI2MCIgeT0iNzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2NjYyIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjkwIiByPSIyMCIgZmlsbD0iIzk5OSIgb3BhY2l0eT0iMC41Ii8+PHJlY3QgeD0iMTQwIiB5PSI3MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNDQ0Ii8+PHJlY3QgeD0iMTgwIiB5PSI3MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNjY2Ii8+PGNpcmNsZSBjeD0iMjIwIiBjeT0iOTAiIHI9IjIwIiBmaWxsPSIjOTk5IiBvcGFjaXR5PSIwLjUiLz48dGV4dCB4PSI1MCUiIHk9Ijc1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MaWdodGJveCAmIEZpbHRlcjwvdGV4dD48L3N2Zz4=",
        demo: "projects/useful/project4/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/useful/project4",
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
        image:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY0NmY0Ii8+PHRleHQgeD0iNTAlIiB5PSI0MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGFzc3dvcmQgR2VuPC90ZXh0PjxwYXRoIGQ9Ik0gODAgMTAwIEwgMTIwIDEwMCBMIDEyMCAxMzAgTCA4MCAxMzAgWiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSI5NSIgY3k9IjEwNSIgcj0iNSIgZmlsbD0iIzMzMyIvPjxjaXJjbGUgY3g9IjEwNSIgY3k9IjEwNSIgcj0iNSIgZmlsbD0iIzMzMyIvPjxjaXJjbGUgY3g9IjEwNSIgY3k9IjExNSIgcj0iNSIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjE0MCIgeT0iMTE1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiPkFiYzEyMyFAIzwvdGV4dD48dGV4dCB4PSI1MCUiIHk9Ijc1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TZWN1cmUgUGFzc3dvcmRzPC90ZXh0Pjwvc3ZnPg==",
        demo: "projects/useful/project5/index.html",
        code: "https://github.com/blackshadow5618/portfolio/tree/main/projects/useful/project5",
        tags: ["security", "password", "generator"],
        featured: false,
      },
    ];
  }

  cacheElements() {
    this.elements = {
      projectGrid: document.getElementById("projectGrid"),
      filterButtons: document.querySelectorAll(".filter-btn"),
      searchInput: document.getElementById("searchInput"),
      sortSelect: document.getElementById("sortSelect"),
    };
  }

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
  }

  setActiveFilter(button) {
    this.elements.filterButtons.forEach((btn) =>
      btn.classList.remove("active")
    );
    button.classList.add("active");
    this.currentFilter = button.dataset.filter;
    this.renderProjects();
  }

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
  }

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
  }

  renderProjects() {
    const filteredProjects = this.getFilteredProjects();
    this.elements.projectGrid.innerHTML = "";

    if (filteredProjects.length === 0) {
      this.elements.projectGrid.innerHTML = `
        <div class="no-results">
          <p>No projects found matching your criteria.</p>
          <button onclick="portfolioApp.clearFilters()">Clear filters</button>
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
  }

  createProjectCard(project) {
    const card = document.createElement("div");
    card.className = `project-card ${project.featured ? "featured" : ""}`;
    card.setAttribute("data-project-id", project.id);

    card.innerHTML = `
      <img src="${project.image}" alt="${
      project.title
    }" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4='">
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
  }

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
  }

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
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the portfolio when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const portfolioApp = new PortfolioApp();
});
