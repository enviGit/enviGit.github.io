document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SYSTEM INITIALIZATION ---
    // Using a helper to safely run functions so one error doesn't break the whole site
    safeInit(initThemeToggle);
    safeInit(initTypedEffect);
    safeInit(initDynamicYear);
    safeInit(initMobileMenu);
    safeInit(initNavigationMarker);
    safeInit(initCursorSystem);      // Single Dot Cursor
    safeInit(initButtonHoverEffect); // Directional Hover
    safeInit(initScrollReveal);
    safeInit(initStatsCounter);
    safeInit(initTimelineProgress);
    safeInit(initBackToTop);
    safeInit(initCopyEmail);

    function safeInit(func) {
        try { func(); } catch (e) { console.error(`Error in ${func.name}:`, e); }
    }


    // --- 2. LOGIC DEFINITIONS ---

    // --- Custom Cursor (Single Dot Version) ---
    function initCursorSystem() {
        const cursor = document.querySelector(".cursor");
        if (!cursor) return;

        // 1. Basic Movement (Instant position update for precision)
        document.addEventListener("mousemove", (e) => {
            // Show cursor on first movement if hidden
            if (!cursor.classList.contains("visible")) {
                cursor.classList.add("visible");
            }

            // Direct position assignment
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });

        // 2. Hide/Show on window leave/enter
        document.addEventListener("mouseleave", () => cursor.classList.remove("visible"));
        document.addEventListener("mouseenter", () => cursor.classList.add("visible"));

        // 3. Click Interaction (Shrink effect)
        document.addEventListener("mousedown", () => document.body.classList.add("click-active"));
        document.addEventListener("mouseup", () => document.body.classList.remove("click-active"));

        // 4. Hover Interaction (Expand effect on interactive elements)
        const expandSelectors = `
            a:not(.cta):not(.ctaProjects):not(.copy-email), 
            button:not(#back-to-top), 
            .nav-link
        `;
        const expandElements = document.querySelectorAll(expandSelectors);

        expandElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add("hover-active"));
            el.addEventListener('mouseleave', () => document.body.classList.remove("hover-active"));
        });

        const ctaSelectors = '.cta, .ctaProjects';
        const ctaElements = document.querySelectorAll(ctaSelectors);

        ctaElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add("cta-hover-active"));
            el.addEventListener('mouseleave', () => document.body.classList.remove("cta-hover-active"));
        });

        // 5. Contrast Interaction
        const contrastSelectors = `
            #back-to-top,
            .copy-email,
            .timeline-icon, 
            .skills-list span
        `;
        const contrastElements = document.querySelectorAll(contrastSelectors);

        contrastElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add("contrast-active"));
            el.addEventListener('mouseleave', () => document.body.classList.remove("contrast-active"));
        });

        // 6. Image Interaction
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            img.addEventListener('mouseenter', () => document.body.classList.add("image-hover"));
            img.addEventListener('mouseleave', () => document.body.classList.remove("image-hover"));
        });
    }

    // --- Direction Aware Buttons (Hover Effect) ---
    function initButtonHoverEffect() {
        const buttons = document.querySelectorAll('.btn-hover');

        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', function (e) {
                const directions = getDirection(e, btn);

                // Disable transition to set start position instantly
                btn.style.setProperty('--transition', 'none');
                setCoords(btn, directions); // Enter state

                btn.offsetHeight; // Force reflow

                // Enable transition and move to center
                btn.style.setProperty('--transition', 'transform 0.3s cubic-bezier(0.215, 0.610, 0.355, 1.000)');
                btn.style.setProperty('--tx', '0%');
                btn.style.setProperty('--ty', '0%');
            });

            btn.addEventListener('mouseleave', function (e) {
                const directions = getDirection(e, btn);
                btn.style.setProperty('--transition', 'transform 0.3s cubic-bezier(0.215, 0.610, 0.355, 1.000)');
                setCoords(btn, directions, true); // Exit state
            });
        });

        function setCoords(btn, dir, exit = false) {
            let tx = '0%', ty = '0%';
            if (!exit) {
                // Entry logic
                if (dir === 0) ty = '-100%'; else if (dir === 1) tx = '100%'; else if (dir === 2) ty = '100%'; else tx = '-100%';
            } else {
                // Exit logic
                if (dir === 0) ty = '-100%'; else if (dir === 1) tx = '100%'; else if (dir === 2) ty = '100%'; else tx = '-100%';
            }
            btn.style.setProperty('--tx', tx);
            btn.style.setProperty('--ty', ty);
        }

        function getDirection(e, item) {
            const w = item.offsetWidth;
            const h = item.offsetHeight;
            const position = item.getBoundingClientRect();
            const x = (e.clientX - position.left - (w / 2)) * (w > h ? (h / w) : 1);
            const y = (e.clientY - position.top - (h / 2)) * (h > w ? (w / h) : 1);
            return Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
        }
    }

    // --- Dark / Light Mode Toggle ---
    function initThemeToggle() {
        const themeBtn = document.getElementById('theme-toggle');
        if (!themeBtn) return;

        const themeIcon = themeBtn.querySelector('i');
        const currentTheme = localStorage.getItem('theme');
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

        // Apply saved or system theme on load
        if (currentTheme === 'light' || (!currentTheme && systemPrefersLight)) {
            document.body.classList.add('light-mode');
            updateIcon(true);
        }

        // Toggle click handler
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateIcon(isLight);
        });

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.body.classList.add('light-mode');
                    updateIcon(true);
                } else {
                    document.body.classList.remove('light-mode');
                    updateIcon(false);
                }
            }
        });

        function updateIcon(isLight) {
            if (!themeIcon) return;
            if (isLight) {
                themeIcon.classList.remove('fa-sun-o');
                themeIcon.classList.add('fa-moon-o');
            } else {
                themeIcon.classList.remove('fa-moon-o');
                themeIcon.classList.add('fa-sun-o');
            }
        }
    }

    // --- Typed.js Effect ---
    function initTypedEffect() {
        if (document.querySelector(".multiple-text") && typeof Typed !== 'undefined') {
            new Typed(".multiple-text", {
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
    }

    // --- Dynamic Footer Year ---
    function initDynamicYear() {
        const yearSpan = document.querySelector(".year");
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    }

    // --- Mobile Menu (Hamburger) ---
    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.nav-list ul');
        const menuItems = document.querySelectorAll('.nav-list ul li a');

        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });

            // Close menu when a link is clicked
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                });
            });
        }
    }

    // --- Navigation Marker & Scroll Spy ---
    function initNavigationMarker() {
        const marker = document.querySelector('.marker');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section');
        const header = document.querySelector('.header.container');

        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.nav-list ul');

        let isManualScrolling = false;
        let scrollTimeout;

        function moveMarker(element) {
            if (!element || !marker) return;
            marker.style.left = element.offsetLeft + "px";
            marker.style.width = element.offsetWidth + "px";
        }

        // Set initial position
        const homeLink = document.querySelector('a[data-section="home"]');
        if (homeLink) moveMarker(homeLink);

        // Click Handler
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                isManualScrolling = true;
                navLinks.forEach(l => l.classList.remove('active-link'));
                link.classList.add('active-link');
                moveMarker(link);

                if (hamburger) hamburger.classList.remove('active');
                if (mobileMenu) mobileMenu.classList.remove('active');

                document.body.classList.remove('no-scroll');

                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => { isManualScrolling = false; }, 1000);
            });
        });

        // Scroll Handler
        window.addEventListener('scroll', () => {
            // Header background logic
            if (header) {
                if (window.scrollY > 100) header.style.backgroundColor = 'var(--header-bg)';
                else header.style.backgroundColor = 'var(--header-bg)';
            }

            if (isManualScrolling) return;

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.dataset.section === current) {
                    link.classList.add('active-link');
                    moveMarker(link);
                }
            });

            // Reset to home if at top
            if (window.scrollY < 100 && homeLink) moveMarker(homeLink);
        });
    }

    // --- Scroll Reveal Animation ---
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                } else {
                    entry.target.classList.remove('show');
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
    }

    // --- Stats Counter ---
    function initStatsCounter() {
        const statsSection = document.querySelector("#stats");
        const counters = document.querySelectorAll(".counter");
        let hasCounted = false;

        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                hasCounted = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute("data-target");
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const update = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.ceil(current);
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target + (target > 100 ? "+" : "");
                        }
                    };
                    update();
                });
            }
        }, { threshold: 0.5 });

        if (statsSection) statsObserver.observe(statsSection);
    }

    // --- Timeline Progress Bar ---
    function initTimelineProgress() {
        const section = document.querySelector("#timeline");
        const fill = document.querySelector(".timeline-line-fill");

        if (section && fill) {
            window.addEventListener("scroll", () => {
                const rect = section.getBoundingClientRect();
                const startOffset = window.innerHeight / 2;
                const dist = -rect.top + startOffset;
                let percentage = (dist / section.offsetHeight) * 100;
                percentage = Math.max(0, Math.min(100, percentage));
                fill.style.height = `${percentage}%`;
            });
        }
    }

    // --- Back To Top Button ---
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Copy Email Feature ---
    function initCopyEmail() {
        const emailLinks = document.querySelectorAll('.copy-email');

        // Helper: Create and show toast
        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.innerHTML = `<i class="fa fa-check-circle"></i> <span>${message}</span>`;

            document.body.appendChild(toast);

            // Reflow
            toast.offsetHeight;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 400);
            }, 3000);
        }

        emailLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const email = link.getAttribute('data-email');

                navigator.clipboard.writeText(email).then(() => {
                    const icon = link.querySelector('i');
                    const originalClass = icon.className;

                    icon.className = 'fa fa-check';
                    link.style.color = 'var(--accent)';

                    setTimeout(() => {
                        icon.className = originalClass;
                        link.style.color = '';
                    }, 2000);

                    showToast("Email copied to clipboard!");
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    showToast("Failed to copy email.");
                });
            });
        });
    }
});