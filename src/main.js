document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SYSTEM INITIALIZATION ---
  safeInit(initThemeToggle);
  safeInit(initScrambleEffect);
  safeInit(initDynamicYear);
  safeInit(initMobileMenu);
  safeInit(initNavigationMarker);
  safeInit(initCursorSystem);
  safeInit(initCustomScrollbar);
  safeInit(initButtonHoverEffect);
  safeInit(initScrollReveal);
  safeInit(initStatsCounter);
  safeInit(initTimelineProgress);
  safeInit(initBackToTop);
  safeInit(initCopyEmail);

  function safeInit(func) {
    try {
      func();
    } catch (e) {
      console.error(`Error in ${func.name}:`, e);
    }
  }

  // --- 2. LOGIC DEFINITIONS ---

  function initCursorSystem() {
    if (window.matchMedia("(hover: none)").matches) return;

    const cursor = document.querySelector(".cursor");

    if (!cursor) return;

    const updateCursorPos = (e) => {
      requestAnimationFrame(() => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      });
    };

    window.addEventListener("mousemove", updateCursorPos);

    document.addEventListener("mouseleave", () =>
      cursor.classList.remove("visible"),
    );
    document.addEventListener("mouseenter", () =>
      cursor.classList.add("visible"),
    );

    window.addEventListener("mousedown", () => {
      document.body.classList.add("click-active");
      document.documentElement.style.cursor = "none";
    });

    window.addEventListener("mouseup", () => {
      document.body.classList.remove("click-active");
      document.documentElement.style.cursor = "";
    });

    const expandSelectors = `
            a:not(.cta):not(.ctaProjects),
            button:not(#back-to-top):not(#terminal-toggle),
            .nav-link
        `;
    const expandElements = document.querySelectorAll(expandSelectors);

    expandElements.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("hover-active"),
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("hover-active"),
      );
    });

    const ctaSelectors = ".cta, .ctaProjects";
    const ctaElements = document.querySelectorAll(ctaSelectors);

    ctaElements.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("cta-hover-active"),
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("cta-hover-active"),
      );
    });

    const contrastSelectors = `
            #back-to-top,
            #terminal-toggle,
            .timeline-icon,
            .skills-list span
        `;
    const contrastElements = document.querySelectorAll(contrastSelectors);

    contrastElements.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("contrast-active"),
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("contrast-active"),
      );
    });

    const allImages = document.querySelectorAll("img");
    allImages.forEach((img) => {
      img.addEventListener("mouseenter", () =>
        document.body.classList.add("image-hover"),
      );
      img.addEventListener("mouseleave", () =>
        document.body.classList.remove("image-hover"),
      );
    });
  }

  function initCustomScrollbar() {
    const scrollbar = document.createElement("div");
    scrollbar.id = "custom-scrollbar";
    const thumb = document.createElement("div");
    thumb.id = "custom-thumb";
    scrollbar.appendChild(thumb);
    document.body.appendChild(scrollbar);

    let isDragging = false;
    let startY, startScrollTop;
    let hideTimeout;

    function updateScrollbar() {
      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      const scrollTop = document.body.scrollTop;

      if (docHeight <= windowHeight + 1) {
        scrollbar.style.opacity = "0";
        scrollbar.style.pointerEvents = "none";
        return;
      } else {
        scrollbar.style.pointerEvents = "auto";
        if (isDragging || scrollbar.matches(":hover")) {
          scrollbar.style.opacity = "1";
        }
      }

      const scrollPercent = scrollTop / (docHeight - windowHeight);
      const thumbHeight = Math.max(
        50,
        (windowHeight / docHeight) * windowHeight,
      );
      const maxThumbTop = windowHeight - thumbHeight;
      const thumbTop = scrollPercent * maxThumbTop;

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${thumbTop}px)`;
    }

    // --- JUMP TO ---
    scrollbar.addEventListener("mousedown", (e) => {
      if (e.target === thumb) return;

      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      const clickY = e.clientY;

      const clickPercent = clickY / windowHeight;
      const targetScroll = clickPercent * (docHeight - windowHeight);

      document.body.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    });

    // --- DRAG LOGIC ---
    thumb.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      isDragging = true;
      scrollbar.classList.add("dragging");
      startY = e.clientY;
      startScrollTop = document.body.scrollTop;
      document.body.style.userSelect = "none";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      const thumbHeight = thumb.offsetHeight;
      const maxThumbTop = windowHeight - thumbHeight;

      const deltaY = e.clientY - startY;

      const movePercent = deltaY / maxThumbTop;

      const scrollAmount = movePercent * (docHeight - windowHeight);

      document.body.scrollTop = startScrollTop + scrollAmount;
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      scrollbar.classList.remove("dragging");
      document.body.style.userSelect = "";
    });

    // --- SCROLL & RESIZE LOGIC ---
    document.body.addEventListener(
      "scroll",
      () => {
        requestAnimationFrame(updateScrollbar);
        scrollbar.classList.add("visible");

        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          if (!scrollbar.matches(":hover") && !isDragging) {
            scrollbar.classList.remove("visible");
          }
        }, 1000);
      },
      { passive: true },
    );

    window.addEventListener("resize", updateScrollbar);

    const resizeObserver = new ResizeObserver(() => updateScrollbar());
    resizeObserver.observe(document.body);

    updateScrollbar();
  }

  // --- CYBER SCRAMBLE EFFECT ---
  function initScrambleEffect() {
    const el = document.querySelector(".multiple-text");
    if (!el) return;

    const phrases = [
      "Implementation Specialist",
      "Unity Developer",
      "Software Engineer",
      "Cybersecurity Student",
    ];

    class TextScramble {
      constructor(el) {
        this.el = el;
        this.chars = "!<>-_\\/[]{}—=+*^?#________";
        this.update = this.update.bind(this);
      }

      setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => (this.resolve = resolve));

        this.queue = [];
        for (let i = 0; i < length; i++) {
          const from = oldText[i] || "";
          const to = newText[i] || "";
          const start = Math.floor(Math.random() * 40);
          const end = start + Math.floor(Math.random() * 40);
          this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
      }

      update() {
        let output = "";
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i];

          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = this.randomChar();
              this.queue[i].char = char;
            }
            output += `<span class="dud">${char}</span>`;
          } else {
            output += from;
          }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
          this.resolve();
        } else {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
        }
      }

      randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
      }
    }

    const fx = new TextScramble(el);
    let counter = 0;

    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 2500);
      });
      counter = (counter + 1) % phrases.length;
    };

    next();
  }

  // --- Direction Aware Buttons ---
  function initButtonHoverEffect() {
    const buttons = document.querySelectorAll(".btn-hover");

    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", function (e) {
        const directions = getDirection(e, btn);

        btn.style.setProperty("--transition", "none");
        setCoords(btn, directions);
        btn.offsetHeight;
        btn.style.setProperty(
          "--transition",
          "transform 0.3s cubic-bezier(0.215, 0.610, 0.355, 1.000)",
        );
        btn.style.setProperty("--tx", "0%");
        btn.style.setProperty("--ty", "0%");
      });

      btn.addEventListener("mouseleave", function (e) {
        const directions = getDirection(e, btn);
        btn.style.setProperty(
          "--transition",
          "transform 0.3s cubic-bezier(0.215, 0.610, 0.355, 1.000)",
        );
        setCoords(btn, directions, true);
      });
    });

    function setCoords(btn, dir, exit = false) {
      let tx = "0%",
        ty = "0%";
      if (!exit) {
        if (dir === 0) ty = "-100%";
        else if (dir === 1) tx = "100%";
        else if (dir === 2) ty = "100%";
        else tx = "-100%";
      } else {
        if (dir === 0) ty = "-100%";
        else if (dir === 1) tx = "100%";
        else if (dir === 2) ty = "100%";
        else tx = "-100%";
      }
      btn.style.setProperty("--tx", tx);
      btn.style.setProperty("--ty", ty);
    }

    function getDirection(e, item) {
      const w = item.offsetWidth;
      const h = item.offsetHeight;
      const position = item.getBoundingClientRect();
      const x = (e.clientX - position.left - w / 2) * (w > h ? h / w : 1);
      const y = (e.clientY - position.top - h / 2) * (h > w ? w / h : 1);
      return (
        Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4
      );
    }
  }

  // --- Dark / Light Mode Toggle ---
  function initThemeToggle() {
    const themeBtn = document.getElementById("theme-toggle");
    if (!themeBtn) return;

    const themeIcon = themeBtn.querySelector("i");
    const currentTheme = localStorage.getItem("theme");
    const systemPrefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;

    if (currentTheme === "light" || (!currentTheme && systemPrefersLight)) {
      document.body.classList.add("light-mode");
      updateIcon(true);
    }

    themeBtn.addEventListener("click", () => {
      this.blur();
      document.body.classList.toggle("light-mode");
      const isLight = document.body.classList.contains("light-mode");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      updateIcon(isLight);
    });

    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          if (e.matches) {
            document.body.classList.add("light-mode");
            updateIcon(true);
          } else {
            document.body.classList.remove("light-mode");
            updateIcon(false);
          }
        }
      });

    function updateIcon(isLight) {
      if (!themeIcon) return;
      if (isLight) {
        themeIcon.classList.remove("fa-sun-o");
        themeIcon.classList.add("fa-moon-o");
      } else {
        themeIcon.classList.remove("fa-moon-o");
        themeIcon.classList.add("fa-sun-o");
      }
    }
  }

  // --- Dynamic Footer Year ---
  function initDynamicYear() {
    const yearSpan = document.querySelector(".year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }

  // --- Mobile Menu (Hamburger) ---
  function initMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".nav-list ul");
    const menuItems = document.querySelectorAll(".nav-list ul li a");

    if (hamburger && mobileMenu) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
      });

      menuItems.forEach((item) => {
        item.addEventListener("click", () => {
          hamburger.classList.remove("active");
          mobileMenu.classList.remove("active");
          document.body.classList.remove("no-scroll");
        });
      });
    }
  }

  // --- Navigation Marker ---
  function initNavigationMarker() {
    const marker = document.querySelector(".marker");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");
    const header = document.querySelector(".header.container");
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".nav-list ul");

    let isManualScrolling = false;
    let scrollTimeout;

    function moveMarker(element) {
      if (!element || !marker) return;
      marker.style.left = element.offsetLeft + "px";
      marker.style.width = element.offsetWidth + "px";
    }

    const homeLink = document.querySelector('a[data-section="home"]');
    if (homeLink) moveMarker(homeLink);

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        isManualScrolling = true;
        navLinks.forEach((l) => l.classList.remove("active-link"));
        link.classList.add("active-link");
        moveMarker(link);

        if (hamburger) hamburger.classList.remove("active");
        if (mobileMenu) mobileMenu.classList.remove("active");

        document.body.classList.remove("no-scroll");

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isManualScrolling = false;
        }, 1500);
      });
    });

    let isTicking = false;

    document.body.addEventListener(
      "scroll",
      () => {
        if (isTicking) return;

        window.requestAnimationFrame(() => {
          const currentScroll = document.body.scrollTop;

          if (header) {
            header.style.backgroundColor =
              currentScroll > 50 ? "var(--header-bg)" : "transparent";
            header.style.borderBottom =
              currentScroll > 50 ? "1px solid var(--border-color)" : "none";
            header.style.boxShadow =
              currentScroll > 50 ? "0 5px 20px var(--shadow-color)" : "none";
          }

          if (!isManualScrolling) {
            let current = "";
            sections.forEach((section) => {
              if (currentScroll >= section.offsetTop - 200) {
                current = section.getAttribute("id");
              }
            });

            navLinks.forEach((link) => {
              link.classList.remove("active-link");
              if (link.dataset.section === current) {
                link.classList.add("active-link");
                moveMarker(link);
              }
            });

            if (currentScroll < 100 && homeLink) moveMarker(homeLink);
          }
          isTicking = false;
        });
        isTicking = true;
      },
      { passive: true },
    );
  }

  // --- Scroll Reveal Animation ---
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));
  }

  // --- Stats Counter ---
  function initStatsCounter() {
    const statsSection = document.querySelector("#stats");
    const counters = document.querySelectorAll(".counter");
    let hasCounted = false;

    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
          hasCounted = true;
          counters.forEach((counter) => {
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
      },
      { threshold: 0.25 },
    );

    if (statsSection) statsObserver.observe(statsSection);
  }

  // --- Timeline Progress Bar ---
  function initTimelineProgress() {
    const section = document.querySelector("#timeline");
    const fill = document.querySelector(".timeline-line-fill");

    if (!section || !fill) return;

    let isTicking = false;

    function updateProgress() {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const startOffset = windowHeight / 2;
      const totalDist = section.offsetHeight;
      const scrolledDist = windowHeight / 2 - rect.top;
      let percentage = (scrolledDist / totalDist) * 100;

      percentage = Math.max(0, Math.min(100, percentage));

      fill.style.height = `${percentage}%`;
      isTicking = false;
    }

    document.body.addEventListener(
      "scroll",
      () => {
        if (!isTicking) {
          window.requestAnimationFrame(updateProgress);
          isTicking = true;
        }
      },
      { passive: true },
    );

    updateProgress();
  }

  // --- Back To Top Button ---
  function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    document.body.addEventListener(
      "scroll",
      () => {
        if (document.body.scrollTop > 500) {
          btn.classList.add("visible");
        } else {
          btn.classList.remove("visible");
        }
      },
      { passive: true },
    );

    btn.addEventListener("click", () => {
      this.blur();
      document.body.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- Copy Email Feature ---
  function initCopyEmail() {
    const emailLinks = document.querySelectorAll(".copy-email");

    let isToastActive = false;

    function showToast(message) {
      const toast = document.createElement("div");
      toast.className = "toast-notification";
      toast.innerHTML = `<i class="fa fa-check-circle"></i> <span>${message}</span>`;
      document.body.appendChild(toast);

      toast.offsetHeight;
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
          isToastActive = false;
        }, 400);
      }, 3000);
    }

    emailLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        e.currentTarget.blur();

        if (isToastActive) return;

        isToastActive = true;
        const email = link.getAttribute("data-email");

        navigator.clipboard
          .writeText(email)
          .then(() => {
            const icon = link.querySelector("i");
            const originalClass = icon.className;

            icon.className = "fa fa-check";
            link.style.color = "var(--accent)";

            setTimeout(() => {
              icon.className = originalClass;
              link.style.color = "";
            }, 2000);

            showToast("Email copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy:", err);
            showToast("Failed to copy email.");
          });
      });
    });
  }
});
