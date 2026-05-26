# 🚀 Paweł Trojański's Portfolio

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Tech](https://img.shields.io/badge/built%20with-Vanilla%20JS-yellow.svg)
![Size](https://img.shields.io/github/repo-size/envigit/envigit.github.io)

> **Live Demo:** [envigit.github.io](https://envigit.github.io/)

![Paweł Trojański Portfolio Preview](https://github.com/user-attachments/assets/91c990de-831c-4039-bb56-eff414588442)

## ⚡ Overview

Welcome to my personal portfolio website.

This project has been completely refactored from a jQuery-heavy template to a **performance-oriented, Vanilla JavaScript** application. The goal was to achieve a modern cyber aesthetic without sacrificing speed or accessibility. It features a custom-built digital resume, a virtual file system terminal, and interactive UI elements built from scratch.

## 🛠 Tech Stack

- **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Icons:** Font Awesome.
- **Tools:** Git, Zed.
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
- **Cross-Browser Compatibility:** Solved complex CSS blending mode issues on Safari and implemented custom scrollbar logic to ensure a consistent experience across Chrome, Firefox, and Safari.

## 📂 Project Structure

The project utilizes a clean structure within the `assets` directory, organizing styles into modular components and sections for better maintainability.

```text
/
├── assets/
│   ├── css/                        # Modular & Minified Styles
│   │   ├── base/                   # Global definitions
│   │   │   ├── reset.min.css       # CSS Reset & typography
│   │   │   ├── utils.min.css       # Helper classes
│   │   │   └── variables.min.css   # Colors & CSS variables
│   │   ├── components/             # UI Components
│   │   │   ├── buttons.min.css     # Buttons & CTA styles
│   │   │   ├── cursor.min.css      # Custom cursor logic
│   │   │   ├── navigation.min.css  # Header, nav & hamburger
│   │   │   ├── scrollbar.min.css   # Custom scrollbar logic
│   │   │   ├── stats.min.css       # Statistics counters
│   │   │   ├── terminal.min.css    # Terminal overlay styling
│   │   │   └── timeline.min.css    # Experience timeline
│   │   ├── sections/               # Specific page sections
│   │   │   ├── about.min.css
│   │   │   ├── contact.min.css
│   │   │   ├── footer.min.css
│   │   │   ├── home.min.css
│   │   │   └── projects.min.css
│   │   ├── main.min.css            # Main entry point
│   ├── files/
│   │   └── cv.pdf                  # Downloadable resume
│   ├── img/                        # Optimized WebP images
│   │   ├── me.webp
│   │   ├── operationDeratization.webp
│   │   ├── pomodoroTimer.webp
│   │   ├── psCatch.webp
│   │   ├── vibrantIcons.webp
│   │   ├── weatherProphet.webp
│   │   └── wingetPortable.webp
│   └── js/                         # Minified production scripts
│       ├── main.min.js             # Core logic & initializers
│       └── terminal.min.js         # Terminal emulator logic
├── .gitignore
├── 404.html                        # Custom Error Page
├── index.html                      # Main entry point
└── README.md
```

## 📬 Contact

If you have any questions or feedback, feel free to reach out:

- **Email:** [paweltrojanski@gmail.com](mailto:paweltrojanski@gmail.com)
- **LinkedIn:** [Paweł Trojański](https://www.linkedin.com/in/ptrojanski/)

## 📄 License & Copyright

This repository operates under a **Dual License** model to allow learning while protecting personal identity.

### 💻 Source Code
The underlying source code (HTML, CSS, JS logic) is open source and available under the **[MIT License](LICENSE.md)**.
You are free to use the code structure, logic, and techniques for your own projects.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### 🎨 Design & Content
The content, including personal photos, the specific visual design/layout, resume (`cv.pdf`), and autobiographical text, is licensed under **[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)**.

**What this means:**
- ✅ **You can:** View the code, learn from it, and fork the repo for educational purposes.
- ❌ **You cannot:** Clone this site to use as your own portfolio, use my photos/CV, or sell this design.

[![License: CC BY-NC-ND 4.0](https://licensebuttons.net/l/by-nc-nd/4.0/80x15.png)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

---
*© 2023-2026 Paweł Trojański. Built with coffee and code.*
