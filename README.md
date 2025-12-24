# 🚀 Paweł Trojański's Portfolio

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Tech](https://img.shields.io/badge/built%20with-Vanilla%20JS-yellow.svg)
![Size](https://img.shields.io/github/repo-size/envigit/envigit.github.io)

> **Live Demo:** [envigit.github.io](https://envigit.github.io/)

![image](https://github.com/user-attachments/assets/91c990de-831c-4039-bb56-eff414588442)

## ⚡ Overview

Welcome to my personal portfolio website.

This project has been completely refactored from a jQuery-heavy template to a **performance-oriented, Vanilla JavaScript** application. The goal was to achieve a modern cyber aesthetic without sacrificing speed or accessibility. It features a custom-built digital resume, a virtual file system terminal, and interactive UI elements built from scratch.

## 🛠 Tech Stack

- **Core:** HTML5, CSS3 (Variables, Flexbox/Grid), Vanilla JavaScript (ES6+).
- **Icons:** Font Awesome.
- **Tools:** Git, VS Code.
- **Philosophy:** No frameworks, no bloat. Just clean, semantic code.

## 🌟 Key Features

### 🖥️ Interactive Terminal
A fully functional, simulated terminal environment accessible via the UI. It's not just an animation - it parses commands!
- **Virtual File System (VFS):** Navigate directories and read files.
- **Commands:** Try typing `help`, `ls -la`, `whoami`, `cat about.txt`, or even `reboot`.

### 🎨 UI/UX & Animations
- **Text Scramble Effect:** Custom cybersecurity themed text decoding on load.
- **Context-Aware Cursor:** A custom cursor that reacts to hover states with blend modes and size changes.
- **Smart Custom Scrollbar:** A JS-driven scrollbar that hides the system cursor for immersion, and adapts to Light/Dark themes.
- **Direction-Aware Buttons:** Hover fills that track your mouse entry/exit angle.
- **Light/Dark Mode:** Instant theme switching using CSS Variables and LocalStorage persistence.

### ⚡ Performance & SEO
- **Lazy Loading & Reveal:** Sections animate in using the `Intersection Observer API` only when needed.
- **Zero Dependencies:** Removed jQuery and external animation libraries to minimize payload.
- **Accessibility:** Semantic HTML structure, ARIA labels, and keyboard navigation support.

## 📂 Project Structure

The project separates source code (`src`) from minified production assets (`assets`).

```text
/
├── assets/
│   ├── css/
│   │   └── style.min.css       # Minified production styles
│   ├── files/
│   │   └── cv.pdf              # Downloadable resume
│   ├── img/                    # Optimized WebP images
│   │   ├── me.webp
│   │   ├── netSentry.webp
│   │   ├── operationDeratization.webp
│   │   ├── pomodoroTimer.webp
│   │   ├── reviewExtractor.webp
│   │   ├── vibrantIcons.webp
│   │   └── weatherProphet.webp
│   └── js/                     # Minified production scripts
│       ├── main.min.js
│       └── terminal.min.js
├── src/                        # Source code (Development)
│   ├── main.js                 # Core logic (Scroll, Theme, UI interactions)
│   ├── style.css               # Main stylesheet (Variables, Animations)
│   └── terminal.js             # Terminal emulator logic & command parsing
├── .gitignore
├── 404.html                    # Custom Error Page
├── index.html                  # Main entry point
└── README.md
```

## 📬 Contact
If you have any questions or feedback, feel free to reach out:

- **Email:** [paweltrojanski@gmail.com](mailto:paweltrojanski@gmail.com)
- **LinkedIn:** [Paweł Trojański](https://www.linkedin.com/in/ptrojanski/)

---
*© 2025 Paweł Trojański. Built with coffee and code.*
