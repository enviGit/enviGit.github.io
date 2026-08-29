# 🚀 Paweł Trojański's Portfolio

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Tech](https://img.shields.io/badge/built%20with-Vanilla%20JS-yellow.svg)
![Size](https://img.shields.io/github/repo-size/envigit/envigit.github.io)

> **Live Demo:** [envigit.github.io](https://envigit.github.io/)

![Paweł Trojański Portfolio Preview](https://github.com/user-attachments/assets/4fae1204-d912-4bde-b869-1f6122e8cac2)


## ⚡ Overview

Personal portfolio built from scratch — no frameworks, no jQuery, no bloat. A performance-first Vanilla JS application with a cyber aesthetic, an interactive terminal, adaptive performance/motion handling, and polished UI details that most portfolios skip.

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
- macOS-style traffic-light window controls — functional **minimize** (docks to a small bar at the bottom), **maximize** (fills the viewport), and an animated **close** (scale + fade instead of a hard cutoff)
- `motion [auto|on|off]` command to override reduced-motion site-wide, straight from the terminal
- Drag to reposition, command history with arrow navigation

### 🎨 UI/UX & Animations
- **Bento Grid About:** Modular glass tiles for bio, tech stack, experience (animated counters), and tools
- **Liquid Nav Pill:** The active-tab indicator stretches into a "bridge" spanning both the old and new tab before contracting into place, instead of a plain slide
- **3D Project Slider:** Scroll-driven on desktop, swipe-driven on mobile with gesture intent detection, synced to real scroll position (dragging the slider no longer desyncs from the page scroll)
- **Text Scramble Effect:** Cyberpunk-style character decoding on load
- **Context-Aware Cursor:** Reacts to hover states, blend modes, element types
- **Direction-Aware Buttons:** Hover fills that track mouse entry/exit angle
- **Light/Dark Mode:** CSS variable-based theming with LocalStorage persistence

### 🧠 Adaptive Performance
The site detects device capability and quality of experience independently, instead of a single blunt toggle:
- **Performance Mode:** Checks `hardwareConcurrency`, `deviceMemory`, and a live frame-time probe right after load. On low-power devices it skips the custom cursor, spotlight and hero-tilt, and drops `backdrop-filter` blur in favor of flat backgrounds — while keeping the layout and content identical.
- **Motion Preference:** Fully decoupled from performance mode. Respects the OS `prefers-reduced-motion` setting site-wide (pauses decorative animations *and* disables transitions), and can be overridden in either direction from the terminal (`motion on|off|auto`) without touching hardware detection.

### ♿ Accessibility & SEO
- Skip-to-content link for keyboard navigation
- Single `<h1>` per page with a sane heading hierarchy
- Descriptive `alt` text and explicit `width`/`height` on every image (no layout shift)
- `robots.txt` + `sitemap.xml`, complete Open Graph/Twitter Card tags with image dimensions
- Respects `prefers-reduced-motion` automatically, on top of the manual terminal override above

### ⚡ Performance & Optimization
- **Zero Dependencies:** Pure Vanilla JS — no jQuery, no animation libraries, minimal footprint.
- **Parallel CSS Loading:** Stylesheets are linked directly in `<head>` (no `@import` chain), so the browser fetches all of them in parallel instead of discovering each one sequentially.
- **Deferred Scripts:** All JS is loaded with `defer`, fetching in parallel while parsing continues.
- **Intersection Observer:** Lazy-loaded animations, timeline progress tracking, and on-scroll triggers to keep the main thread lightweight.
- **Frame-Budgeted Animations:** Smooth interaction and 3D slider logic using `requestAnimationFrame`, minimizing layout thrashing.
- **Resource Preloading:** Strategic use of `rel="preload"` for critical fonts to prevent FOIT/FOUT.
- **Eco-Friendly Logic:** Automatic animation pausing via `VisibilityChange` API when the tab is inactive to preserve CPU and battery.
- **Optimized Asset Pipeline:** WebP format for all imagery, explicit dimensions to prevent layout shift, and inlined SVG sprites for instant icon rendering.
- **Passive Event Listeners:** Optimized scroll handling using `{ passive: true }` to maximize scroll performance and responsiveness.

## 📂 Project Structure

The project utilizes a clean structure within the `assets` directory, organizing styles into modular components and sections for better maintainability. CSS files are linked individually in `index.html` — there's no bundler and no single entry stylesheet.

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
│   │   │   ├── terminal.min.css
│   │   │   └── timeline.min.css
│   │   └── sections/
│   │       ├── about.min.css
│   │       ├── contact.min.css
│   │       ├── footer.min.css
│   │       ├── home.min.css
│   │       └── projects.min.css
│   ├── files/
│   │   └── cv.pdf
│   ├── fonts/
│   │   ├── JetBrainsMono-Bold.woff2
│   │   ├── Montserrat-Bold.woff2
│   │   ├── Montserrat-Italic.woff2
│   │   ├── Montserrat-Light.woff2
│   │   ├── Montserrat-Medium.woff2
│   │   ├── Montserrat-Regular.woff2
│   │   └── Montserrat-SemiBold.woff2
│   ├── img/
│   │   ├── me-large.webp
│   │   ├── me-medium.webp
│   │   ├── me-small.webp
│   │   ├── operationDeratization.webp
│   │   ├── pomodoroTimer.webp
│   │   ├── psCatch.webp
│   │   ├── vibrantIcons.webp
│   │   ├── weatherProphet.webp
│   │   └── wingetPortable.webp
│   └── js/
│       ├── main.min.js
│       ├── navigation.min.js
│       ├── slider.min.js
│       ├── terminal.min.js
│       ├── ui-effects.min.js
│       └── utils.min.js
├── .gitignore
├── 404.html
├── index.html
├── LICENSE.md
├── README.md
├── robots.txt
└── sitemap.xml
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
