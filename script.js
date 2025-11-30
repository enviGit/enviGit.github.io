document.addEventListener('DOMContentLoaded', () => {

    // --- Typed.js ---
    if (document.querySelector(".multiple-text")) {
        var typed = new Typed(".multiple-text", {
            strings: [
                "Student",
                "Unity Developer",
                "Technical Implementation Specialist"
            ],
            typeSpeed: 50,
            backSpeed: 70,
            backDelay: 300,
            loop: false
        });
    }

    // --- Dynamic Year ---
    const yearSpan = document.querySelector(".year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.nav-list ul');
    const menuItems = document.querySelectorAll('.nav-list ul li a');
    const header = document.querySelector('.header.container');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // --- Marker Animation & Glitch Fix ---
    const marker = document.querySelector('.marker');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Variable to block scroll spy during click-scrolling
    let isManualScrolling = false;
    let scrollTimeout;

    // Function to move marker
    function indicator(e) {
        if (!e) return;
        marker.style.left = e.offsetLeft + "px";
        marker.style.width = e.offsetWidth + "px";
    }

    // Click Event for Nav Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 1. Set flag to true to disable scroll spy
            isManualScrolling = true;

            // 2. Immediately move marker to clicked link
            navLinks.forEach(l => l.classList.remove('active-link'));
            link.classList.add('active-link');
            indicator(link);

            // 3. Close mobile menu if open
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');

            // 4. Reset flag after scroll animation (approx 1000ms)
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isManualScrolling = false;
            }, 1000);
        });
    });

    // Scroll Spy (Marker follows scroll)
    window.addEventListener('scroll', () => {
        // Header background logic
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(17, 17, 17, 0.95)';
        } else {
            header.style.backgroundColor = 'rgba(17, 17, 17, 0.8)';
        }

        // CRITICAL FIX: Stop if we are manually scrolling via click
        if (isManualScrolling) return;

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Offset logic to switch marker slightly before section hits top
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        // Update active link based on scroll position
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.dataset.section === current) {
                link.classList.add('active-link');
                indicator(link);
            }
        });

        // Fix for top of page
        if (window.scrollY < 100) {
            const homeLink = document.querySelector('a[data-section="home"]');
            if (homeLink) indicator(homeLink);
        }
    });

    // Initialize marker on load
    const homeLink = document.querySelector('a[data-section="home"]');
    if (homeLink) indicator(homeLink);


    // --- Direction Aware Hover Button Effect ---
    const buttons = document.querySelectorAll('.btn-hover');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function (e) {
            const directions = getDirection(e, btn);

            // Disable transition to instantly place background at entry point
            btn.style.setProperty('--transition', 'none');

            // Set start position based on entry direction
            switch (directions) {
                case 0: // Top
                    btn.style.setProperty('--tx', '0%');
                    btn.style.setProperty('--ty', '-100%');
                    break;
                case 1: // Right
                    btn.style.setProperty('--tx', '100%');
                    btn.style.setProperty('--ty', '0%');
                    break;
                case 2: // Bottom
                    btn.style.setProperty('--tx', '0%');
                    btn.style.setProperty('--ty', '100%');
                    break;
                case 3: // Left
                    btn.style.setProperty('--tx', '-100%');
                    btn.style.setProperty('--ty', '0%');
                    break;
            }

            // Force reflow
            btn.offsetHeight;

            // Enable transition and move to center
            btn.style.setProperty('--transition', 'transform 0.3s cubic-bezier(0.215, 0.610, 0.355, 1.000)');
            btn.style.setProperty('--tx', '0%');
            btn.style.setProperty('--ty', '0%');
        });

        btn.addEventListener('mouseleave', function (e) {
            const directions = getDirection(e, btn);

            btn.style.setProperty('--transition', 'transform 0.3s cubic-bezier(0.215, 0.610, 0.355, 1.000)');

            // Move background out based on exit direction
            switch (directions) {
                case 0: // Top
                    btn.style.setProperty('--tx', '0%');
                    btn.style.setProperty('--ty', '-100%');
                    break;
                case 1: // Right
                    btn.style.setProperty('--tx', '100%');
                    btn.style.setProperty('--ty', '0%');
                    break;
                case 2: // Bottom
                    btn.style.setProperty('--tx', '0%');
                    btn.style.setProperty('--ty', '100%');
                    break;
                case 3: // Left
                    btn.style.setProperty('--tx', '-100%');
                    btn.style.setProperty('--ty', '0%');
                    break;
            }
        });
    });

    // Helper function for direction detection (0:Top, 1:Right, 2:Bottom, 3:Left)
    function getDirection(e, item) {
        const w = item.offsetWidth;
        const h = item.offsetHeight;
        const position = item.getBoundingClientRect();
        const x = (e.clientX - position.left - (w / 2)) * (w > h ? (h / w) : 1);
        const y = (e.clientY - position.top - (h / 2)) * (h > w ? (w / h) : 1);
        const direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
        return direction;
    }

    // --- Cursor Logic (Fixed Teleport Issue) ---
    const coords = { x: 0, y: 0 };
    const circles = document.querySelectorAll(".circle");
    const cursor = document.querySelector(".cursor");

    // Initialize circles off-screen
    circles.forEach(function (circle) {
        circle.x = 0;
        circle.y = 0;
    });

    window.addEventListener("mousemove", function (e) {
        coords.x = e.clientX;
        coords.y = e.clientY;

        if (!cursor.classList.contains("visible")) {
            cursor.classList.add("visible");
            resetCirclesPosition();
        }
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
        cursor.classList.remove("visible");
    });

    // Show cursor when entering window & RESET POSITION immediately
    document.addEventListener("mouseenter", (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;

        resetCirclesPosition();

        cursor.classList.add("visible");
    });

    // Helper to reset circles to current mouse position
    function resetCirclesPosition() {
        circles.forEach(function (circle) {
            circle.x = coords.x;
            circle.y = coords.y;
            circle.style.left = coords.x - 10 + "px";
            circle.style.top = coords.y - 10 + "px";
            // Important: Disable transition temporarily if set in CSS, though JS animation handles movement
            circle.style.transition = 'none';
        });

        // Restore transition after a tiny delay (optional if CSS transitions are used for scaling/color)
        setTimeout(() => {
            circles.forEach(c => c.style.transition = '');
        }, 10);
    }

    // --- Interactions ---
    window.addEventListener("mousedown", () => {
        document.body.classList.add("click-active");
    });
    window.addEventListener("mouseup", () => {
        document.body.classList.remove("click-active");
    });

    const clickableElements = document.querySelectorAll('a, button, .cta, .ctaProjects, .project-item');
    clickableElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add("hover-active");
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove("hover-active");
        });
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach(function (circle, index) {
            const offset = circle.offsetWidth / 2;

            circle.style.left = x - offset + "px";
            circle.style.top = y - offset + "px";
            circle.style.scale = (circles.length - index) / circles.length;

            circle.x = x;
            circle.y = y;

            const nextCircle = circles[index + 1] || circles[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();

    // --- Scroll Reveal Animation (Intersection Observer) ---
    const observerOptions = {
        root: null, // viewport
        threshold: 0.15,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
});