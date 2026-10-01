// Floating nav with a sliding "pill", back-to-top button and the custom scrollbar.

function initNavigation() {
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");
    const nav = document.querySelector(".glass-nav");
    const pill = document.querySelector(".nav-pill");
    if (links.length === 0) return;

    // Moves the pill under `link`. When jumping between links it first stretches
    // over both, then shrinks onto the target (the "morphing" animation).
    function movePill(link) {
        if (!pill || !nav) return;
        requestAnimationFrame(() => {
            const navRect = nav.getBoundingClientRect();
            const linkRect = link.getBoundingClientRect();
            const left = linkRect.left - navRect.left;
            const width = linkRect.width;
            const prevLeft = parseFloat(pill.style.left);
            const prevWidth = parseFloat(pill.style.width);
            const hasPrevious = !isNaN(prevLeft) && !isNaN(prevWidth);

            if (hasPrevious && (Math.round(prevLeft) !== Math.round(left) || Math.round(prevWidth) !== Math.round(width))) {
                const start = Math.min(prevLeft, left);
                const end = Math.max(prevLeft + prevWidth, left + width);
                pill.style.transition = "none";
                pill.style.left = `${start}px`;
                pill.style.width = `${end - start}px`;
                pill.classList.add("visible");
                requestAnimationFrame(() => {
                    pill.style.transition = "";
                    pill.style.left = `${left}px`;
                    pill.style.width = `${width}px`;
                    pill.classList.remove("morphing");
                    void pill.offsetWidth; // restart the morphing animation
                    pill.classList.add("morphing");
                });
            } else {
                pill.style.left = `${left}px`;
                pill.style.width = `${width}px`;
                pill.classList.add("visible");
            }
        });
    }

    function setActive(link) {
        links.forEach((l) => l.classList.remove("active-link"));
        link.classList.add("active-link");
        movePill(link);
    }

    links.forEach((link) => {
        link.addEventListener("click", function () {
            setActive(this);
        });
    });

    // Scroll spy: the section crossing the band at 40-50% of the viewport is active.
    const spy = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.getAttribute("id");
                const link = document.querySelector(`.nav-link[data-section="${id}"]`);
                if (link) setActive(link);
            });
        },
        { root: null, rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));

    const realignActive = () => {
        const active = document.querySelector(".nav-link.active-link");
        if (active) movePill(active);
    };

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(realignActive, 100);
    });
    // Fonts may shift the layout right after load.
    setTimeout(realignActive, 300);
}

function initBackToTop() {
    const button = document.getElementById("back-to-top");
    if (!button) return;

    onPageScroll(() => {
        if (getScrollEl().scrollTop > 500) button.classList.add("visible");
        else button.classList.remove("visible");
    });

    button.addEventListener("click", (event) => {
        event.currentTarget.blur();
        getScrollEl().scrollTo({
            top: 0,
            behavior: document.body.classList.contains("motion-reduced") ? "instant" : "smooth",
        });
    });
}

// Custom overlay scrollbar for fine-pointer devices. It shows while scrolling,
// can be dragged, and a click on the track jumps to that position.
function initScrollbar() {
    if (!isHoverSupported()) return;

    const track = document.createElement("div");
    track.id = "custom-scrollbar";
    const thumb = document.createElement("div");
    thumb.id = "custom-thumb";
    track.appendChild(thumb);
    document.body.appendChild(track);

    const currentScroll = () =>
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let dragging = false;
    let dragStartY;
    let dragStartScroll;
    let viewportHeight;
    let thumbHeight;
    let scrollRange;
    let hideTimer;

    function update() {
        if (dragging) return;
        const viewport = window.innerHeight;
        const content = document.body.scrollHeight;
        const scrolled = currentScroll();

        if (content <= viewport) {
            track.style.opacity = "0";
            track.style.pointerEvents = "none";
            return;
        }
        track.style.pointerEvents = "auto";

        const height = Math.max(50, (viewport / content) * viewport);
        thumb.style.height = `${height}px`;
        thumb.style.transform = `translate3d(0, ${(scrolled / (content - viewport)) * (viewport - height)}px, 0)`;
    }

    thumb.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        event.preventDefault();
        dragging = true;
        track.classList.add("dragging");
        dragStartY = event.clientY;
        dragStartScroll = currentScroll();
        viewportHeight = window.innerHeight;
        thumbHeight = thumb.offsetHeight;
        scrollRange = document.body.scrollHeight - viewportHeight;
        document.body.style.userSelect = "none";
    });

    window.addEventListener(
        "mousemove",
        (event) => {
            if (!dragging) return;
            event.preventDefault();
            const travel = viewportHeight - thumbHeight;
            let thumbTop = (dragStartScroll / scrollRange) * travel + (event.clientY - dragStartY);
            thumbTop = Math.max(0, Math.min(thumbTop, travel));
            thumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`;

            const target = (thumbTop / travel) * scrollRange;
            document.body.scrollTop = target;
            document.documentElement.scrollTop = target;
            window.scrollTo(0, target);
        },
        { passive: false }
    );

    window.addEventListener("mouseup", () => {
        if (!dragging) return;
        dragging = false;
        track.classList.remove("dragging");
        document.body.style.userSelect = "";
    });

    // Click on the empty track: jump proportionally.
    track.addEventListener("mousedown", (event) => {
        if (event.target === thumb || thumb.contains(event.target)) return;
        const viewport = window.innerHeight;
        const content = document.body.scrollHeight;
        const options = { top: (event.clientY / viewport) * (content - viewport), behavior: "smooth" };
        if (document.body.scrollTo) document.body.scrollTo(options);
        if (document.documentElement.scrollTo) document.documentElement.scrollTo(options);
        window.scrollTo(options);
    });

    const onScroll = () => {
        if (!dragging) requestAnimationFrame(update);
        track.classList.add("visible");
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            if (!track.matches(":hover") && !dragging) track.classList.remove("visible");
        }, 1000);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.body.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    new ResizeObserver(() => update()).observe(document.body);
    update();
}
