// Hero: the name is a window onto the photo.
// An SVG mask made of the name reveals the photo. Scrolling through the pinned
// hero zooms into the stem of the final "I" until the photo fills the screen,
// the whoami card lands on it, then everything fades into About.
// Enabled by the `hero-mask` class on <html> (set in <head>); without JS the
// original hero layout stays.
function initHeroMask() {
    if (!document.documentElement.classList.contains("hero-mask")) return;

    const home = document.getElementById("home");
    const container = document.querySelector("#home .home");
    const copy = document.querySelector(".home-copy");
    if (!home || !container || !copy) return;

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const isReduced = () => document.body.classList.contains("motion-reduced");

    // Scroll progress (0..1) through the pinned #home section.
    const progress = () => {
        const range = home.offsetHeight - window.innerHeight;
        return range > 0 ? clamp01(-home.getBoundingClientRect().top / range) : 0;
    };

    // The whoami card lands on the full-screen photo near the end of the zoom.
    // initVisibility() writes inline opacity on elements visible at load, so the
    // card's visibility is driven inline too, starting hidden.
    const card = document.querySelector(".hero-terminal-wrap");
    const cardLines = card ? [...card.querySelectorAll(".hero-terminal-body p")] : [];
    if (card) card.style.opacity = "0";

    const NS = "http://www.w3.org/2000/svg";
    const stage = document.createElement("div");
    stage.className = "mask-stage";
    stage.setAttribute("aria-hidden", "true");
    stage.innerHTML = `
        <svg xmlns="${NS}">
            <defs>
                <mask id="name-mask" maskUnits="userSpaceOnUse">
                    <rect fill="#000" />
                    <g class="mask-zoom"><g class="mask-text-fill" fill="#fff"></g></g>
                    <rect class="mask-open" fill="#fff" opacity="0" />
                </mask>
                <linearGradient id="mask-fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0.55" stop-color="var(--bg-color)" stop-opacity="0" />
                    <stop offset="1" stop-color="var(--bg-color)" stop-opacity="1" />
                </linearGradient>
            </defs>
            <g mask="url(#name-mask)"><image class="mask-photo" preserveAspectRatio="none" /></g>
            <g class="mask-zoom mask-floor"><g class="mask-text-floor"></g></g>
            <rect class="mask-bottom" fill="url(#mask-fade)" opacity="0" />
            <rect class="mask-dim" fill="var(--bg-color)" opacity="0" />
        </svg>
        <div class="mask-grain"></div>`;
    container.appendChild(stage);

    const svg = stage.querySelector("svg");
    const zooms = stage.querySelectorAll(".mask-zoom");
    const fillGroup = stage.querySelector(".mask-text-fill");
    const floorGroup = stage.querySelector(".mask-text-floor");
    const floor = stage.querySelector(".mask-floor");
    const maskOpen = stage.querySelector(".mask-open");
    const photo = stage.querySelector(".mask-photo");
    const rects = stage.querySelectorAll("rect");
    const dim = stage.querySelector(".mask-dim");
    const bottom = stage.querySelector(".mask-bottom");

    // Face position in the source photo (fractions of width / height).
    const FACE = { x: 0.41, y: 0.37 };
    const source = new Image();
    let sourceReady = false;

    let origin = { x: 0, y: 0 }; // zoom origin: the final "I" stem
    let maxScale = 1;
    let focus = { x: 0, y: 0 }; // where the face sits on screen
    let nameBandY = 0; // vertical centre of the "PAWEŁ" letters
    let lastText = null;

    // Small tileable noise texture for film grain.
    function makeGrain() {
        const c = document.createElement("canvas");
        c.width = c.height = 160;
        const ctx = c.getContext("2d");
        const data = ctx.createImageData(160, 160);
        for (let i = 0; i < data.data.length; i += 4) {
            const v = (Math.random() * 255) | 0;
            data.data[i] = data.data[i + 1] = data.data[i + 2] = v;
            data.data[i + 3] = 255;
        }
        ctx.putImageData(data, 0, 0);
        return c.toDataURL("image/png");
    }
    stage.querySelector(".mask-grain").style.backgroundImage = `url("${makeGrain()}")`;

    function makeText(y, size, content) {
        const t = document.createElementNS(NS, "text");
        t.setAttribute("class", "mask-name");
        t.setAttribute("x", "50%");
        t.setAttribute("y", y);
        t.setAttribute("text-anchor", "middle");
        t.setAttribute("font-size", size);
        t.textContent = content;
        return t;
    }

    // Cover the viewport with ~15% spare so the face can sit inside "PAWEŁ".
    function placePhoto(vw, vh) {
        if (!sourceReady) return;
        const scale = Math.max(vw / source.width, vh / source.height) * 1.15;
        const w = source.width * scale;
        const h = source.height * scale;
        const x = Math.min(0, Math.max(vw - w, vw / 2 - w * FACE.x));
        const y = Math.min(0, Math.max(vh - h, nameBandY - h * FACE.y));
        photo.setAttribute("x", x);
        photo.setAttribute("y", y);
        photo.setAttribute("width", w);
        photo.setAttribute("height", h);
        focus = { x: x + w * FACE.x, y: y + h * FACE.y };
    }

    function layout() {
        const vw = container.clientWidth;
        const vh = container.clientHeight;
        svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);
        rects.forEach((r) => {
            r.setAttribute("width", vw);
            r.setAttribute("height", vh);
        });

        // Measure the long line at 100px, then size it to 86% of the width.
        fillGroup.textContent = "";
        const probe = makeText(0, 100, "TROJAŃSKI");
        fillGroup.appendChild(probe);
        const size = Math.min((vw * 0.86 * 100) / probe.getComputedTextLength(), vh * 0.3);
        const y1 = vh * 0.44;
        const y2 = y1 + size * 0.9;
        nameBandY = y1 - size * 0.36;

        // The same letters twice: once as the mask, once blended with "lighten"
        // so dark parts of the photo never drop below a readable tone.
        [fillGroup, floorGroup].forEach((group) => {
            group.textContent = "";
            group.appendChild(makeText(y1, size, "PAWEŁ"));
            group.appendChild(makeText(y2, size, "TROJAŃSKI"));
        });
        lastText = fillGroup.querySelectorAll("text")[1];

        placePhoto(vw, vh);
        // Enough scale for the stem (~0.2em wide) to cover the screen.
        maxScale = (Math.max(vw, vh) / (size * 0.2)) * 1.3;
        requestRender();
    }

    // Read live so a late font swap can never leave the zoom on the wrong spot.
    function updateOrigin() {
        if (!lastText) return;
        const ext = lastText.getExtentOfChar(lastText.getNumberOfChars() - 1);
        origin = { x: ext.x + ext.width / 2, y: ext.y + ext.height * 0.62 };
    }

    function render() {
        rafId = 0;
        const p = isReduced() ? 0 : progress();
        const vw = container.clientWidth;
        const vh = container.clientHeight;
        updateOrigin();

        const z = clamp01(p / 0.75);
        // Exponential scale reads as a constant-speed zoom.
        const s = Math.pow(maxScale, z * z);
        const move = easeInOut(clamp01(z * 1.4));
        const cx = lerp(origin.x, vw / 2, move);
        const cy = lerp(origin.y, vh / 2, move);
        const transform = `translate(${cx} ${cy}) scale(${s}) translate(${-origin.x} ${-origin.y})`;
        zooms.forEach((g) => g.setAttribute("transform", transform));

        // Near the end open the whole mask so the photo always fills the screen.
        maskOpen.setAttribute("opacity", String(clamp01((z - 0.7) / 0.3)));
        floor.style.opacity = String(1 - clamp01(z * 2.5));
        // Slow push-in on the photo for depth.
        const ps = lerp(1.12, 1, z);
        photo.setAttribute("transform", `translate(${focus.x} ${focus.y}) scale(${ps}) translate(${-focus.x} ${-focus.y})`);
        bottom.setAttribute("opacity", String(clamp01((p - 0.7) / 0.15)));
        dim.setAttribute("opacity", String(clamp01((p - 0.86) / 0.14)));
        copy.style.setProperty("--m", p.toFixed(3));

        if (card) {
            // In after the photo fills the screen, out before the fade to About.
            const cardIn = clamp01((p - 0.55) / 0.12) * (1 - clamp01((p - 0.86) / 0.08));
            card.style.setProperty("--t", cardIn.toFixed(3));
            card.style.opacity = cardIn.toFixed(3);
            card.classList.toggle("is-live", cardIn > 0.6);
            // Lines appear one by one, like commands being typed.
            cardLines.forEach((line, i) => line.classList.toggle("on", p >= 0.6 + i * 0.022));
        }
    }

    // Render only when something changed (scroll, resize, layout).
    let rafId = 0;
    function requestRender() {
        if (!rafId) rafId = requestAnimationFrame(render);
    }

    // me-hero.webp: 2400px with the green duotone baked in.
    source.src = "./assets/img/me-hero.webp";
    // A failed photo or font must never leave the hero blank: lay out anyway.
    Promise.all([
        source
            .decode()
            .then(() => {
                photo.setAttribute("href", source.src);
                sourceReady = true;
            })
            .catch(() => {}),
        // Measure only once Geist is really in use.
        document.fonts
            .load('900 100px "Geist"')
            .then(() => document.fonts.ready)
            .catch(() => {}),
    ]).then(() => {
        layout();
        onPageScroll(requestRender);
        document.fonts.addEventListener("loadingdone", layout);
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(layout, 120);
    });
}
