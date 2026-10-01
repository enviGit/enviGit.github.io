// Shared helpers and small page-wide behaviours.

const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;
const isHoverSupported = () => window.matchMedia("(hover: hover)").matches;

// Touch devices scroll the document natively; desktop scrolls <body> so the
// custom scrollbar can replace the native one. The class is set in <head>.
const isNativeScroll = () => document.documentElement.classList.contains("native-scroll");
const getScrollEl = () =>
    isNativeScroll() ? document.scrollingElement || document.documentElement : document.body;
const onPageScroll = (handler) =>
    (isNativeScroll() ? window : document.body).addEventListener("scroll", handler, { passive: true });

// localStorage "force-reduce-fx" = "1" / "0" overrides the hardware heuristic.
function isLowPowerDevice() {
    const forced = localStorage.getItem("force-reduce-fx");
    if (forced === "1") return true;
    if (forced === "0") return false;

    const cores = navigator.hardwareConcurrency;
    if (typeof cores === "number" && cores > 0 && cores <= 4) return true;

    const memory = navigator.deviceMemory;
    return typeof memory === "number" && memory <= 4;
}

// Turns on reduced effects for weak hardware, or when the first 24 frames
// average slower than ~38 fps.
function initPerformanceMode() {
    if (isLowPowerDevice()) document.body.classList.add("reduce-fx");

    const SAMPLE_FRAMES = 24;
    const SLOW_FRAME_MS = 26;
    let frames = 0;
    let lastTime = null;
    const deltas = [];

    requestAnimationFrame(function sample(time) {
        if (lastTime !== null) deltas.push(time - lastTime);
        lastTime = time;
        if (++frames < SAMPLE_FRAMES) {
            requestAnimationFrame(sample);
        } else if (deltas.reduce((sum, d) => sum + d, 0) / deltas.length > SLOW_FRAME_MS) {
            document.body.classList.add("reduce-fx");
        }
    });
}

// "terminal-motion": auto (follow the OS), on (force motion), off (force reduced).
function applyMotionPreference() {
    const setting = localStorage.getItem("terminal-motion") || "auto";
    const reduced =
        setting === "off" ||
        (setting !== "on" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    document.body.classList.toggle("motion-reduced", reduced);
}

function initMotionPreference() {
    applyMotionPreference();
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => {
        if ((localStorage.getItem("terminal-motion") || "auto") === "auto") applyMotionPreference();
    });
}

function initYear() {
    const year = document.querySelector(".year");
    if (year) year.textContent = new Date().getFullYear();
}

// Reveal-on-scroll for every `.hidden` element. Anything already on screen
// (or inside the section from the URL hash) is shown instantly.
function initVisibility() {
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("show");
                entry.target.classList.remove("hidden");
                obs.unobserve(entry.target);
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const hash = window.location.hash;
    document.querySelectorAll(".hidden").forEach((node) => {
        const rect = node.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom >= 0;
        const inHashTarget = hash && node.closest(hash);
        if (inViewport || inHashTarget) {
            node.classList.remove("hidden");
            node.style.transition = "none";
            node.style.opacity = "1";
            node.style.transform = "none";
            node.style.filter = "none";
        } else {
            observer.observe(node);
        }
    });
}

// Fills the timeline line up to the middle of the viewport.
function initTimeline() {
    const section = document.querySelector("#timeline");
    const fill = document.querySelector(".timeline-line-fill");
    if (!section || !fill) return;

    let ticking = false;
    function update() {
        const rect = section.getBoundingClientRect();
        let progress = ((window.innerHeight / 2 - rect.top) / section.offsetHeight) * 100;
        progress = Math.max(0, Math.min(100, progress));
        fill.style.height = `${progress}%`;
        ticking = false;
    }

    onPageScroll(() => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    });
    update();
}

function initCopyEmail() {
    const buttons = document.querySelectorAll(".copy-email");
    let busy = false;

    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast-notification";
        toast.innerHTML = `<svg class="icon"><use href="#icon-check-circle"></use></svg> <span>${message}</span>`;
        document.body.appendChild(toast);
        toast.offsetHeight; // force reflow so the enter transition runs
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                if (document.body.contains(toast)) document.body.removeChild(toast);
                busy = false;
            }, 400);
        }, 3000);
    }

    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.currentTarget.blur();
            if (busy) return;
            busy = true;

            const email = button.getAttribute("data-email");
            const icon = button.querySelector("use");
            navigator.clipboard
                .writeText(email)
                .then(() => {
                    const originalIcon = icon.getAttribute("href");
                    icon.setAttribute("href", "#icon-check");
                    button.style.color = "var(--accent)";
                    setTimeout(() => {
                        icon.setAttribute("href", originalIcon);
                        button.style.color = "";
                    }, 2000);
                    showToast("Email copied to clipboard!");
                })
                .catch((error) => {
                    console.error("Failed to copy:", error);
                    showToast("Failed to copy email.");
                });
        });
    });
}

// `is-scrolling` on <body> while the page moves (used to pause hover effects).
function initScrollState() {
    let timer;
    onPageScroll(() => {
        document.body.classList.add("is-scrolling");
        clearTimeout(timer);
        timer = setTimeout(() => {
            document.body.classList.remove("is-scrolling");
        }, 150);
    });
}

// Pauses CSS animations in hidden tabs and in sections that are off screen.
function initPauseAnimations() {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) document.body.classList.add("pause-animations");
        else document.body.classList.remove("pause-animations");
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.remove("pause-animations");
                else entry.target.classList.add("pause-animations");
            });
        },
        { threshold: 0, rootMargin: "100px" }
    );
    document.querySelectorAll("section, #terminal-overlay").forEach((section) => {
        observer.observe(section);
    });
}
