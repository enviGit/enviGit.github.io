// 3D project carousel.
// Desktop: the section is pinned (sticky) and vertical scroll drives the slides.
// Mobile: horizontal drag / swipe with momentum. Buttons, dots and arrow keys
// work everywhere. Positions are fractional; `current` eases toward `target`.
function initSlider() {
    const section = document.getElementById("projects");
    const container = document.querySelector(".projects-slider-container");
    const stage = document.querySelector(".projects-orbit-wrapper");
    const items = [...document.querySelectorAll(".project-item")];
    const dots = [...document.querySelectorAll(".slider-dot")];
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const counter = document.querySelector(".slider-counter-current");
    const ambientLayers = [...document.querySelectorAll(".projects-ambient-layer")];
    if (!section || !container || !stage || items.length === 0) return;

    const lastIndex = items.length - 1;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const pad2 = (n) => String(n).padStart(2, "0");
    const isReduced = () => document.body.classList.contains("motion-reduced");
    const canTilt = () => isHoverSupported() && !isReduced() && !document.body.classList.contains("reduce-fx");

    let current = 0; // rendered position
    let target = 0; // where we are heading
    let frontIndex = -1;
    let spacing = 360; // px between neighbouring cards
    let rafId = 0;
    let snapTimer = 0;

    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const drag = {
        active: false,
        moved: false,
        pointerId: null,
        startX: 0,
        startTarget: 0,
        lastX: 0,
        lastT: 0,
        velocity: 0,
    };

    const counterScramble = counter && typeof TextScramble === "function" ? new TextScramble(counter) : null;
    if (counterScramble) counterScramble.currentText = counter.textContent;

    // ---------- Scroll mapping (pinned mode) ----------

    const scrollTop = () => document.body.scrollTop || document.documentElement.scrollTop || 0;
    // Pinned only when the container is taller than the viewport (desktop CSS).
    const isPinned = () => container.offsetHeight > window.innerHeight + 1;

    function getTrack() {
        const rect = container.getBoundingClientRect();
        return { rect, top: rect.top + scrollTop(), length: rect.height - window.innerHeight };
    }

    function scrollToSlide(index, smooth) {
        const { top, length } = getTrack();
        if (length <= 0) return;
        const options = { top: top + (index / lastIndex) * length, behavior: smooth ? "smooth" : "instant" };
        document.body.scrollTo(options);
        document.documentElement.scrollTo(options);
    }

    function onScroll() {
        if (drag.active || !isPinned()) return;
        const { rect, length } = getTrack();
        if (length <= 0) return;
        target = clamp(-rect.top / length, 0, 1) * lastIndex;
        requestRender();
        clearTimeout(snapTimer);
        snapTimer = setTimeout(snapToNearest, 160);
    }

    // After scrolling stops inside the pinned range, settle on the nearest slide.
    function snapToNearest() {
        if (drag.active) return;
        const { rect } = getTrack();
        const insidePin = rect.top <= 0 && rect.bottom >= window.innerHeight;
        const nearest = Math.round(target);
        if (insidePin && Math.abs(nearest - target) > 0.01) scrollToSlide(nearest, !isReduced());
    }

    function goTo(index) {
        target = clamp(index, 0, lastIndex);
        if (isPinned()) scrollToSlide(target, false);
        requestRender();
    }

    function updateSpacing() {
        const portraitPhone = window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
        spacing = portraitPhone ? window.innerWidth * 0.86 : Math.max(360, items[0].offsetWidth * 0.9);
        requestRender();
    }

    // ---------- Rendering ----------

    function requestRender() {
        if (!rafId) rafId = requestAnimationFrame(render);
    }

    function render() {
        rafId = 0;
        const reduced = isReduced();

        current += (target - current) * (reduced ? 1 : 0.1);
        if (Math.abs(target - current) < 5e-4) current = target;
        tilt.x += (tilt.targetX - tilt.x) * 0.12;
        tilt.y += (tilt.targetY - tilt.y) * 0.12;

        items.forEach((item, i) => {
            const offset = i - current;
            const distance = Math.abs(offset);
            const scale = distance < 0.4 ? 1 + (0.4 - distance) * 0.15 : 1;
            const tiltWeight = Math.max(0, 1 - distance / 0.5); // only the front card tilts
            const depth = reduced ? 0 : -350 * distance;
            const rotateY = (reduced ? 0 : -20 * offset) + tilt.y * tiltWeight;
            const rotateX = tilt.x * tiltWeight;

            item.style.transform = `translateX(${spacing * offset}px) translateZ(${depth}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
            item.style.opacity = distance > 2.5 ? "0" : String(Math.max(0, 1 - 0.3 * distance));
            item.style.zIndex = String(100 - Math.round(distance * 10));
            item.classList.toggle("is-front", distance < 0.35);
        });

        setFront(clamp(Math.round(current), 0, lastIndex));

        const tiltMoving = Math.abs(tilt.targetX - tilt.x) + Math.abs(tilt.targetY - tilt.y) > 0.01;
        if (current !== target || tiltMoving) requestRender();
    }

    // Updates everything tied to the front slide (only when it changes).
    function setFront(index) {
        if (index === frontIndex) return;
        frontIndex = index;

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
            if (i === index) dot.setAttribute("aria-current", "true");
            else dot.removeAttribute("aria-current");
        });
        items.forEach((item, i) => {
            item.setAttribute("aria-hidden", String(i !== index));
            item.querySelectorAll("a").forEach((link) => (link.tabIndex = i === index ? 0 : -1));
        });
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === lastIndex;
        if (counter) {
            if (counterScramble && !isReduced()) counterScramble.setText(pad2(index + 1));
            else counter.textContent = pad2(index + 1);
        }
        updateAmbient(index);
    }

    // Cross-fades two blurred copies of the front card's image behind the stage.
    let ambientIndex = 0;
    function updateAmbient(index) {
        const img = items[index].querySelector("img");
        if (ambientLayers.length < 2 || !img) return;
        ambientIndex ^= 1;
        ambientLayers[ambientIndex].style.backgroundImage = `url("${img.currentSrc || img.src}")`;
        ambientLayers[ambientIndex].classList.add("is-active");
        ambientLayers[ambientIndex ^ 1].classList.remove("is-active");
    }

    // ---------- Drag / swipe ----------

    stage.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 || event.target.closest("a, button")) return;
        Object.assign(drag, {
            active: true,
            moved: false,
            pointerId: event.pointerId,
            startX: event.clientX,
            lastX: event.clientX,
            lastT: event.timeStamp,
            startTarget: target,
            velocity: 0,
        });
    });

    stage.addEventListener("pointermove", (event) => {
        if (!drag.active || event.pointerId !== drag.pointerId) return;
        const dx = event.clientX - drag.startX;
        if (!drag.moved) {
            if (Math.abs(dx) < 6) return; // ignore jitter so clicks still work
            drag.moved = true;
            stage.setPointerCapture(event.pointerId);
            stage.classList.add("is-dragging");
        }

        const dt = event.timeStamp - drag.lastT;
        if (dt > 0) drag.velocity = 0.8 * ((event.clientX - drag.lastX) / dt) + 0.2 * drag.velocity;
        drag.lastX = event.clientX;
        drag.lastT = event.timeStamp;

        // Rubber-band past the first / last slide.
        let next = drag.startTarget - dx / spacing;
        if (next < 0) next *= 0.3;
        else if (next > lastIndex) next = lastIndex + (next - lastIndex) * 0.3;
        target = next;
        requestRender();
    });

    function endDrag(event) {
        if (!drag.active || event.pointerId !== drag.pointerId) return;
        drag.active = false;
        stage.classList.remove("is-dragging");
        if (!drag.moved) return;

        const startIndex = Math.round(drag.startTarget);
        const velocity = event.timeStamp - drag.lastT > 100 ? 0 : drag.velocity;
        let index = Math.round(target);
        // A quick flick advances one slide even if the drag was short.
        if (index === startIndex && Math.abs(velocity) > 0.35) index = startIndex - Math.sign(velocity);
        goTo(index);
        setTimeout(() => (drag.moved = false), 0);
    }

    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    // Swallow the click that ends a drag so links are not followed.
    stage.addEventListener(
        "click",
        (event) => {
            if (drag.moved) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        true
    );

    // ---------- Pointer tilt of the front card ----------

    stage.addEventListener("mousemove", (event) => {
        if (!canTilt() || drag.active) return;
        const front = items[frontIndex];
        let targetX = 0;
        let targetY = 0;
        if (front && front.classList.contains("is-front")) {
            const rect = front.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            if (Math.abs(px) <= 0.5 && Math.abs(py) <= 0.5) {
                targetX = -py * 8;
                targetY = px * 10;
            }
        }
        if (targetX !== tilt.targetX || targetY !== tilt.targetY) {
            tilt.targetX = targetX;
            tilt.targetY = targetY;
            requestRender();
        }
    });
    stage.addEventListener("mouseleave", () => {
        tilt.targetX = 0;
        tilt.targetY = 0;
        requestRender();
    });

    // ---------- Controls ----------

    prevBtn?.addEventListener("click", () => goTo(Math.round(target) - 1));
    nextBtn?.addEventListener("click", () => goTo(Math.round(target) + 1));
    dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));
    // Clicking a side card brings it to the front instead of following its link.
    items.forEach((item, i) => {
        item.addEventListener("click", (event) => {
            if (item.classList.contains("is-front")) return;
            event.preventDefault();
            goTo(i);
        });
    });

    section.addEventListener("keydown", (event) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
        if (step) {
            event.preventDefault();
            goTo(Math.round(target) + step);
        } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            goTo(event.key === "Home" ? 0 : lastIndex);
        }
    });

    // ---------- Accessibility ----------

    stage.setAttribute("role", "region");
    stage.setAttribute("aria-roledescription", "carousel");
    stage.setAttribute("aria-label", "Highlighted projects");
    items.forEach((item, i) => {
        const title = item.querySelector("h3")?.textContent.trim() ?? "";
        item.setAttribute("role", "group");
        item.setAttribute("aria-roledescription", "slide");
        item.setAttribute("aria-label", `${i + 1} of ${items.length}: ${title}`);
    });

    window.addEventListener("resize", updateSpacing, { passive: true });
    document.body.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    updateSpacing();
    onScroll();
    render();
}
