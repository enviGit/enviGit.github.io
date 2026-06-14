# 🚀 Paweł Trojański's Portfolio

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Tech](https://img.shields.io/badge/built%20with-Vanilla%20JS-yellow.svg)
![Size](https://img.shields.io/github/repo-size/envigit/envigit.github.io)

> **Live Demo:** [envigit.github.io](https://envigit.github.io/)

![Paweł Trojański Portfolio Preview](https://github.com/user-attachments/assets/91c990de-831c-4039-bb56-eff414588442)

## ⚡ Overview

Personal portfolio built from scratch — no frameworks, no jQuery, no bloat. A performance-first Vanilla JS application with a cyber aesthetic, interactive terminal, and polished UI details that most portfolios skip.

## 🛠 Tech Stack

- **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Icons:** Inline SVG sprite
- **Tools:** Git, Zed
- **Philosophy:** Zero dependencies. Every interaction hand-crafted.

## 🌟 Key Features

### 🖥️ Interactive Terminal
A simulated terminal with a real command parser and virtual file system. Not a gimmick — it actually works.
- Navigate directories, read files, switch themes, change accent colors
- Persistent accent color with per-theme preset resolution
- Drag to reposition, command history with arrow navigation

### 🎨 UI/UX & Animations
- **3D Project Slider:** Scroll-driven on desktop, swipe-driven on mobile with gesture intent detection
- **Text Scramble Effect:** Cyberpunk-style character decoding on load
- **Context-Aware Cursor:** Reacts to hover states, blend modes, element types
- **Direction-Aware Buttons:** Hover fills that track mouse entry/exit angle
- **Light/Dark Mode:** CSS variable-based theming with LocalStorage persistence

### ⚡ Performance
- **Zero Dependencies:** Pure Vanilla JS — no jQuery, no animation libraries
- **Intersection Observer:** Lazy reveal animations, timeline fill, counter triggers
- **SVG Sprite:** Single inline sprite for all icons, zero network requests
- **WebP Images:** All assets optimized for web delivery

## 📂 Project Structure

The project utilizes a clean structure within the `assets` directory, organizing styles into modular components and sections for better maintainability.

```text
/
├── assets/
│   ├── css/
│   │   ├── base/
│   │   │   ├── reset.min.css
│   │   │   ├── utils.min.css
│   │   │   └── variables.min.css
│   │   ├── components/
│   │   │   ├── buttons.min.css
│   │   │   ├── cursor.min.css
│   │   │   ├── navigation.min.css 
│   │   │   ├── scrollbar.min.css
│   │   │   ├── stats.min.css
│   │   │   ├── terminal.min.css
│   │   │   └── timeline.min.css
│   │   ├── sections/
│   │   │   ├── about.min.css
│   │   │   ├── contact.min.css
│   │   │   ├── footer.min.css
│   │   │   ├── home.min.css
│   │   │   └── projects.min.css
│   │   ├── main.min.css
│   ├── files/
│   │   └── cv.pdf
│   ├── fonts/
│   │   ├── JetBrainsMono-Bold.woff2
│   │   ├── Montserrat-Bold.woff2
│   │   ├── Montserrat-Italic.woff2
│   │   ├── Montserrat-Light.woff2
│   │   ├── Montserrat-Medium.woff2
│   │   └── Montserrat-Regular.woff2
│   ├── img/
│   │   ├── me.webp
│   │   ├── operationDeratization.webp
│   │   ├── pomodoroTimer.webp
│   │   ├── psCatch.webp
│   │   ├── vibrantIcons.webp
│   │   ├── weatherProphet.webp
│   │   └── wingetPortable.webp
│   └── js/
│       ├── main.min.js
│       └── terminal.min.js
├── .gitignore
├── 404.html
├── index.html
├── LICENSE.md
└── README.md
```

## 📬 Contact

If you have any questions or feedback, feel free to reach out:

- **Email:** [paweltrojanski@gmail.com](mailto:paweltrojanski@gmail.com)
- **LinkedIn:** [Paweł Trojański](https://www.linkedin.com/in/ptrojanski/)

## 📄 License & Copyright

Dual license model — code is open, identity is not.

### 💻 Source Code — **[MIT](LICENSE.md)**
The HTML, CSS, and JS logic are open source. Use the structure, patterns, and techniques freely.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### 🎨 Design & Content — **[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)**
Personal photos, visual design, resume, and autobiographical content are protected.

- ✅ View, learn, fork for educational purposes
- ❌ Don't clone as your own portfolio, use my assets, or sell the design

[![License: CC BY-NC-ND 4.0](https://licensebuttons.net/l/by-nc-nd/4.0/80x15.png)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

---
*© 2023-2026 Paweł Trojański. Built with coffee and code.*
