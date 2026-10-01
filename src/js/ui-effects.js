// Visual effects: text scramble, button wave, theme toggle, custom cursor,
// spotlight glow and the hero terminal tilt.

// Morphs an element's text into new text through random glyphs.
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = "!@#$%^&*+=[]{}|/?";
        this.charsLen = this.chars.length;
        this.update = this.update.bind(this);
        this.currentText = "";
    }

    setText(newText) {
        const oldText = this.currentText;
        const length = Math.max(oldText.length, newText.length);
        const done = new Promise((resolve) => (this.resolve = resolve));

        // Every character gets a random start/end frame for its scramble phase.
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || "";
            const to = newText[i] || "";
            let start = (40 * Math.random()) | 0;
            let end = start + ((40 * Math.random()) | 0);
            if (to === "") {
                // Trailing characters being removed disappear right to left.
                start = 0;
                end = (length - i) * 3;
            }
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return done;
    }

    update() {
        const output = [];
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            const item = this.queue[i];
            if (this.frame >= item.end) {
                complete++;
                output.push(item.to);
            } else if (this.frame >= item.start) {
                if (!item.char || Math.random() < 0.28) {
                    item.char = this.chars[(Math.random() * this.charsLen) | 0];
                }
                output.push(`<span class="dud">${item.char}</span>`);
            } else {
                output.push(item.from);
            }
        }

        this.el.innerHTML = output.join("");
        if (complete === this.queue.length) {
            this.currentText = output.join("");
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

// Rotating role line in the hero. With reduced motion it swaps text plainly.
function initTextAnimation() {
    const el = document.querySelector(".multiple-text");
    if (!el) return;

    const roles = ["Implementation Specialist", "Unity Developer", "Software Engineer"];
    const scramble = new TextScramble(el);
    let index = 0;

    const next = () => {
        if (document.body.classList.contains("motion-reduced")) {
            el.textContent = roles[index];
            scramble.currentText = roles[index];
            index = (index + 1) % roles.length;
            setTimeout(next, 3500);
            return;
        }
        scramble.setText(roles[index]).then(() => {
            setTimeout(next, 2500);
        });
        index = (index + 1) % roles.length;
    };
    next();
}

// "Wave" fill on `.wave` elements: the fill enters from the edge the pointer
// came in through and leaves through the edge it exits.
function initButtonEffects() {
    if (!isHoverSupported()) return;

    const WAVE_TRANSITION = "transform .6s cubic-bezier(.25,.1,.25,1),opacity .3s";
    // Off-screen offsets for the fill, indexed by edge: top, right, bottom, left.
    const EDGE_OFFSETS = [
        ["0%", "-76%"],
        ["84%", "0%"],
        ["0%", "76%"],
        ["-84%", "0%"],
    ];

    function closestEdge(event, el) {
        const rect = el.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        // Normalise to a square so the diagonals split the edges evenly.
        const x = (event.clientX - rect.left - w / 2) * (w > h ? h / w : 1);
        const y = (event.clientY - rect.top - h / 2) * (h > w ? w / h : 1);
        return Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4;
    }

    function setOffset(el, edge) {
        el.style.setProperty("--wave-x", EDGE_OFFSETS[edge][0]);
        el.style.setProperty("--wave-y", EDGE_OFFSETS[edge][1]);
    }

    document.querySelectorAll(".wave").forEach((el) => {
        el.addEventListener("pointerenter", (event) => {
            if (event.pointerType === "touch") return;
            // Jump (no transition) to the entry edge, then animate to the centre.
            el.style.setProperty("--wave-t", "none");
            setOffset(el, closestEdge(event, el));
            el.offsetHeight; // force reflow
            el.style.setProperty("--wave-t", WAVE_TRANSITION);
            el.style.setProperty("--wave-x", "0%");
            el.style.setProperty("--wave-y", "0%");
        });
        el.addEventListener("pointerleave", (event) => {
            if (event.pointerType === "touch") return;
            el.style.setProperty("--wave-t", WAVE_TRANSITION);
            setOffset(el, closestEdge(event, el));
        });
    });
}

// Light/dark toggle. The initial class is already set by an inline script in
// <body> to avoid a flash; this keeps the icon, label and theme-color in sync.
function initTheme() {
    const buttons = document.querySelectorAll(".theme-btn");
    const stored = localStorage.getItem("theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

    function syncUi(isLight) {
        buttons.forEach((button) => {
            const icon = button.querySelector("use");
            if (icon) icon.setAttribute("href", isLight ? "#icon-sun" : "#icon-moon");
            button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
        });
        document
            .querySelectorAll('meta[name="theme-color"]')
            .forEach((meta) => meta.setAttribute("content", isLight ? "#f3f4f6" : "#111111"));
    }

    const startLight = stored === "light" || (!stored && prefersLight);
    if (startLight) document.body.classList.add("light-mode");
    syncUi(startLight);

    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.currentTarget.blur();
            document.body.classList.toggle("light-mode");
            const isLight = document.body.classList.contains("light-mode");
            localStorage.setItem("theme", isLight ? "light" : "dark");
            syncUi(isLight);
        });
    });

    // Follow the OS only until the user picks a theme manually.
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (event) => {
        if (localStorage.getItem("theme")) return;
        if (event.matches) {
            document.body.classList.add("light-mode");
            syncUi(true);
        } else {
            document.body.classList.remove("light-mode");
            syncUi(false);
        }
    });
}

// Custom cursor. Body classes switch its look (see cursor.css) depending on
// what is under the pointer.
function initCursor() {
    if (!isHoverSupported()) return;
    const cursor = document.querySelector(".cursor");
    if (!cursor) return;
    document.body.classList.add("custom-cursor-ready");

    let x = 0;
    let y = 0;
    let pending = false;
    const render = () => {
        if (!pending) return;
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        pending = false;
    };

    window.addEventListener(
        "mousemove",
        (event) => {
            x = event.clientX;
            y = event.clientY;
            if (!pending) {
                window.requestAnimationFrame(render);
                pending = true;
            }
            if (!cursor.classList.contains("visible")) cursor.classList.add("visible");
        },
        { passive: true }
    );
    document.addEventListener("mouseleave", () => cursor.classList.remove("visible"));
    document.addEventListener("mouseenter", () => cursor.classList.add("visible"));
    window.addEventListener("mousedown", () => {
        document.body.classList.add("click-active");
    });
    window.addEventListener("mouseup", () => {
        document.body.classList.remove("click-active");
    });

    const disableDrag = (el) => {
        el.setAttribute("draggable", "false");
        el.addEventListener("dragstart", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    };

    const bindHoverClass = (selector, className, extra) => {
        document.querySelectorAll(selector).forEach((el) => {
            el.addEventListener("mouseenter", () => document.body.classList.add(className));
            el.addEventListener("mouseleave", () => document.body.classList.remove(className));
            if (extra) extra(el);
        });
    };

    bindHoverClass(
        "a:not(.cta):not(.ctaProjects), button:not(#back-to-top):not(#terminal-toggle):not(.slider-btn):not(.slider-dot), .nav-link",
        "hover-active",
        disableDrag
    );
    bindHoverClass(".cta, .ctaProjects", "cta-hover-active", disableDrag);
    bindHoverClass("#back-to-top, #terminal-toggle, .timeline-icon, .skills-list span, .slider-btn", "contrast-active");
    bindHoverClass("img", "image-hover", disableDrag);

    // The front project card shows the "pressed" cursor.
    document.querySelectorAll(".project-item").forEach((item) => {
        item.addEventListener("mouseenter", () => {
            if (item.classList.contains("is-front")) document.body.classList.add("click-active");
        });
        item.addEventListener("mouseleave", () => {
            document.body.classList.remove("click-active");
        });
    });

    bindHoverClass('a[target="_blank"]', "external-link-hover");
}

// Radial glow that follows the pointer inside cards (reads --x / --y in CSS).
function initSpotlight() {
    if (!isHoverSupported()) return;

    const targets = [];
    let pending = false;

    function render() {
        targets.forEach((t) => {
            t.target.style.setProperty("--x", t.x + "px");
            t.target.style.setProperty("--y", t.y + "px");
        });
        pending = false;
    }

    document
        .querySelectorAll(".glass-social-link, .btn-hover, .stat-item, .project-item, .timeline-content, .terminal-window, .bento-tile")
        .forEach((el) => {
            const entry = { target: el, x: 0, y: 0 };
            targets.push(entry);
            el.addEventListener("mousemove", (event) => {
                const rect = el.getBoundingClientRect();
                entry.x = event.clientX - rect.left;
                entry.y = event.clientY - rect.top;
                if (!pending) {
                    requestAnimationFrame(render);
                    pending = true;
                }
            });
        });
}

// 3D tilt of the hero terminal towards the pointer; rests at 4deg / -8deg.
function initHeroTilt() {
    if (!isHoverSupported()) return;
    const wrap = document.querySelector(".hero-terminal-wrap");
    const terminal = document.getElementById("hero-terminal");
    if (!wrap || !terminal) return;

    const REST_X = 4;
    const REST_Y = -8;
    let tiltX = REST_X;
    let tiltY = REST_Y;
    let pending = false;

    function render() {
        terminal.style.setProperty("--tiltX", tiltX + "deg");
        terminal.style.setProperty("--tiltY", tiltY + "deg");
        pending = false;
    }

    wrap.addEventListener("mousemove", (event) => {
        const rect = wrap.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        tiltY = (px - 0.5) * 24;
        tiltX = (0.5 - py) * 16;
        if (!pending) {
            requestAnimationFrame(render);
            pending = true;
        }
    });
    wrap.addEventListener("mouseleave", () => {
        tiltX = REST_X;
        tiltY = REST_Y;
        if (!pending) {
            requestAnimationFrame(render);
            pending = true;
        }
    });
}

// "Open interactive terminal" button in the hero reuses the floating toggle.
function initHeroTerminalLink() {
    const button = document.querySelector(".hero-terminal-open");
    const toggle = document.getElementById("terminal-toggle");
    if (!button || !toggle) return;
    button.addEventListener("click", () => {
        button.blur();
        toggle.click();
    });
}
