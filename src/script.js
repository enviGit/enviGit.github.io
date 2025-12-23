document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SYSTEM INITIALIZATION ---
  safeInit(initThemeToggle);
  safeInit(initScrambleEffect);
  safeInit(initDynamicYear);
  safeInit(initMobileMenu);
  safeInit(initNavigationMarker);
  safeInit(initCursorSystem);
  safeInit(initButtonHoverEffect);
  safeInit(initScrollReveal);
  safeInit(initStatsCounter);
  safeInit(initTimelineProgress);
  safeInit(initBackToTop);
  safeInit(initCopyEmail);
  safeInit(initTerminal);

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

    document.addEventListener("mousemove", (e) => {
      if (!cursor.classList.contains("visible")) {
        cursor.classList.add("visible");
      }

      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });

    document.addEventListener("mouseleave", () =>
      cursor.classList.remove("visible"),
    );
    document.addEventListener("mouseenter", () =>
      cursor.classList.add("visible"),
    );

    document.addEventListener("mousedown", () =>
      document.body.classList.add("click-active"),
    );
    document.addEventListener("mouseup", () =>
      document.body.classList.remove("click-active"),
    );

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

    window.addEventListener(
      "scroll",
      () => {
        if (isTicking) return;

        window.requestAnimationFrame(() => {
          if (header) {
            header.style.backgroundColor =
              window.scrollY > 50 ? "var(--header-bg)" : "var(--header-bg)";
          }

          if (!isManualScrolling) {
            let current = "";
            sections.forEach((section) => {
              if (window.pageYOffset >= section.offsetTop - 200) {
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

            if (window.scrollY < 100 && homeLink) moveMarker(homeLink);
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
    let isTicking = false;

    if (section && fill) {
      window.addEventListener(
        "scroll",
        () => {
          if (!isTicking) {
            window.requestAnimationFrame(() => {
              const rect = section.getBoundingClientRect();
              const startOffset = window.innerHeight / 2;
              const dist = -rect.top + startOffset;
              let percentage = (dist / section.offsetHeight) * 100;
              percentage = Math.max(0, Math.min(100, percentage));
              fill.style.height = `${percentage}%`;

              isTicking = false;
            });
            isTicking = true;
          }
        },
        { passive: true },
      );
    }
  }

  // --- Back To Top Button ---
  function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 500) {
          btn.classList.add("visible");
        } else {
          btn.classList.remove("visible");
        }
      },
      { passive: true },
    );

    btn.addEventListener("click", () => {
      this.blur();
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  // --- TERMINAL ---
  function initTerminal() {
    const openBtn = document.getElementById("terminal-toggle");
    const closeBtn = document.getElementById("close-terminal");
    const overlay = document.getElementById("terminal-overlay");
    const header = document.getElementById("terminal-header");
    const input = document.getElementById("terminal-input");
    const body = document.getElementById("terminal-body");

    if (!openBtn || !overlay || !input) return;

    let isFirstOpen = true;

    const commandHistory = [];
    let historyIndex = -1;

    const fileSystem = {
      "about.txt":
        "Junior Technical Implementation Specialist & Cybersecurity student. Passionate about C#, .NET, and breaking things to fix them.",
      "skills.md":
        "C# | .NET | Unity | Python | SQL | Frontend | Git | Cybersecurity",
      "contact.info":
        "Email: paweltrojanski@gmail.com | LinkedIn: /in/ptrojanski",
      "projects/":
        "Dir: [NetSentry, App Store Reviews Extractor, Vibrant Icons, Operation Deratization, Pomodoro Timer, WeatherProphet]",
      "cv.pdf": "Binary file. Use command 'open cv.pdf' to view.",
    };

    // --- TOGGLE LOGIC ---
    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (overlay.classList.contains("hidden-terminal")) {
        overlay.classList.remove("hidden-terminal");
        if (isFirstOpen) {
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const terminalWidth = overlay.offsetWidth;
          const terminalHeight = overlay.offsetHeight;
          overlay.style.transform = "none";
          overlay.style.left = `${(viewportWidth - terminalWidth) / 2}px`;
          overlay.style.top = `${(viewportHeight - terminalHeight) / 2}px`;
          isFirstOpen = false;
        }
        input.focus();
      } else {
        overlay.classList.add("hidden-terminal");
      }
    });

    closeBtn.addEventListener("click", () => {
      overlay.classList.add("hidden-terminal");
    });

    body.addEventListener("click", () => {
      if (window.getSelection().toString().length === 0) {
        input.focus();
      }
    });

    // --- DRAG LOGIC ---
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = overlay.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
      overlay.style.transform = "none";
      overlay.style.left = initialLeft + "px";
      overlay.style.top = initialTop + "px";
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      let newLeft = initialLeft + deltaX;
      let newTop = initialTop + deltaY;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const elWidth = overlay.offsetWidth;
      const elHeight = overlay.offsetHeight;
      if (newLeft < 0) newLeft = 0;
      if (newLeft + elWidth > windowWidth) newLeft = windowWidth - elWidth;
      if (newTop < 0) newTop = 0;
      if (newTop + elHeight > windowHeight) newTop = windowHeight - elHeight;

      overlay.style.left = `${newLeft}px`;
      overlay.style.top = `${newTop}px`;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      document.body.style.userSelect = "";
    });

    // --- INPUT HANDLING ---
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const rawValue = this.value.trim();
        if (rawValue !== "") {
          commandHistory.push(rawValue);
          historyIndex = commandHistory.length;
        }
        const args = rawValue.split(/\s+/);
        const cmd = args[0].toLowerCase();
        processCommand(cmd, args.slice(1), rawValue);
        this.value = "";
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          this.value = commandHistory[historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          this.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          this.value = "";
        }
      }
    });

    function processCommand(cmd, args, rawValue) {
      const line = document.createElement("div");
      line.innerHTML = `<span class="prompt-text" style="color:#aaa;">[guest@ptrojanski ~]$</span> ${escapeHtml(rawValue)}`;
      body.insertBefore(line, body.lastElementChild);

      let response = "";
      let isHtml = false;

      switch (cmd) {
        case "help":
          response = `Available commands:
            <br>&nbsp;&nbsp;<span style="color:#fff">ls</span>       - List directory contents
            <br>&nbsp;&nbsp;<span style="color:#fff">cat [file]</span> - Display file content
            <br>&nbsp;&nbsp;<span style="color:#fff">cd [dir]</span>  - Change directory
            <br>&nbsp;&nbsp;<span style="color:#fff">whoami</span>    - Display current user
            <br>&nbsp;&nbsp;<span style="color:#fff">matrix</span>    - Enter the Matrix
            <br>&nbsp;&nbsp;<span style="color:#fff">reboot</span>    - Restart system
            <br>&nbsp;&nbsp;<span style="color:#fff">theme</span>     - Switch theme [light/dark]
            <br>&nbsp;&nbsp;<span style="color:#fff">clear</span>     - Clear terminal
            <br>&nbsp;&nbsp;<span style="color:#fff">exit</span>      - Close terminal`;
          isHtml = true;
          break;

        case "ls":
        case "ll":
          const files = Object.keys(fileSystem)
            .map((f) => {
              if (f.endsWith("/"))
                return `<span style="color:#4d4dff; font-weight:bold;">${f}</span>`;
              if (f.endsWith(".pdf") || f.endsWith(".zip"))
                return `<span style="color:#ff5f56;">${f}</span>`;
              return `<span style="color:#ccc;">${f}</span>`;
            })
            .join("&nbsp;&nbsp;&nbsp;");
          response = files;
          isHtml = true;
          break;

        case "cat":
          if (args.length === 0) response = "usage: cat [file]";
          else
            response = fileSystem[args[0]]
              ? fileSystem[args[0]]
              : `cat: ${escapeHtml(args[0])}: No such file or directory`;
          break;

        case "whoami":
          response = `<pre style="font-size: 0.5rem; line-height: 1; color: var(--accent); margin-bottom: 10px; margin-top: 5px;">
          ██████╗  █████╗ ██╗    ██╗███████╗██╗
          ██╔══██╗██╔══██╗██║    ██║██╔════╝██║
          ██████╔╝███████║██║ █╗ ██║█████╗  ██║
          ██╔═══╝ ██╔══██║██║███╗██║██╔══╝  ██║
          ██║     ██║  ██║╚███╔███╔╝███████╗███████╗
          ╚═╝     ╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚══════╝

          ████████╗██████╗  ██████╗      ██╗ █████╗ ███╗   ██╗███████╗██╗  ██╗██╗
          ╚══██╔══╝██╔══██╗██╔═══██╗     ██║██╔══██╗████╗  ██║██╔════╝██║ ██╔╝██║
             ██║   ██████╔╝██║   ██║     ██║███████║██╔██╗ ██║███████╗█████╔╝ ██║
             ██║   ██╔══██╗██║   ██║██   ██║██╔══██║██║╚██╗██║╚════██║██╔═██╗ ██║
             ██║   ██║  ██║╚██████╔╝╚█████╔╝██║  ██║██║ ╚████║███████║██║  ██╗██║
             ╚═╝   ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝
                      </pre>
                      <div style="margin-top: -5px;">
                          User: <strong>Paweł Trojański</strong> (root)<br>
                          Role: Implementation Spec & .NET Dev
                      </div>`;
          isHtml = true;
          break;

        case "matrix":
          response = "Wake up, Neo...";
          startMatrixEffect();
          overlay.classList.add("hidden-terminal");
          break;

        case "reboot":
          response = "Rebooting system...";
          setTimeout(() => {
            document.body.style.transition = "opacity 1s";
            document.body.style.opacity = "0";
            setTimeout(() => location.reload(), 1000);
          }, 1000);
          break;

        case "date":
          response = new Date().toString();
          break;

        case "cd":
        case "open":
          if (args.length === 0) {
            response = "usage: cd [directory] or open [file]";
          } else {
            const target = args[0].toLowerCase();
            if (target.includes("project")) {
              response = "Navigating to Projects...";
              document
                .querySelector("#projects")
                .scrollIntoView({ behavior: "smooth" });
              if (window.innerWidth < 768)
                overlay.classList.add("hidden-terminal");
            } else if (target === "cv.pdf") {
              response = "Opening CV...";
              window.open("./assets/files/cv.pdf", "_blank");
            } else {
              response = `cd: ${escapeHtml(target)}: No such directory`;
            }
          }
          break;

        case "theme":
          if (args.length === 0) {
            response = "usage: theme [light|dark]";
          } else {
            const mode = args[0].toLowerCase();
            const themeBtn = document.getElementById("theme-toggle");
            if (mode === "light") {
              if (!document.body.classList.contains("light-mode"))
                themeBtn.click();
              response = "Theme set to LIGHT.";
            } else if (mode === "dark") {
              if (document.body.classList.contains("light-mode"))
                themeBtn.click();
              response = "Theme set to DARK.";
            } else {
              response = `theme: unknown argument '${escapeHtml(mode)}'`;
            }
          }
          break;

        case "sudo":
          response = `<span style="color:red">guest is not in the sudoers file. This incident will be reported.</span>`;
          isHtml = true;
          break;

        case "exit":
          overlay.classList.add("hidden-terminal");
          return;

        case "clear":
          while (body.children.length > 1) {
            body.removeChild(body.firstChild);
          }
          return;

        case "":
          return;

        default:
          response = `Command not found: ${escapeHtml(cmd)}. Type 'help' for options.`;
      }

      const respLine = document.createElement("div");
      respLine.style.marginBottom = "10px";
      respLine.style.color = "#ccc";

      if (isHtml) respLine.innerHTML = response;
      else respLine.textContent = response;

      body.insertBefore(respLine, body.lastElementChild);
      body.scrollTop = body.scrollHeight;
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    // --- MATRIX EFFECT ---
    function startMatrixEffect() {
      const canvas = document.getElementById("matrix-canvas");
      if (!canvas) {
        console.error("Matrix canvas not found in HTML!");
        alert("Error: <canvas id='matrix-canvas'> missing in HTML.");
        return;
      }

      const ctx = canvas.getContext("2d");

      canvas.style.display = "block";
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const chars = "01";
      const fontSize = 16;
      const columns = canvas.width / fontSize;
      const drops = [];

      for (let x = 0; x < columns; x++) {
        drops[x] = 1;
      }

      const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0F0";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };

      const matrixInterval = setInterval(draw, 33);

      const exitMatrix = () => {
        clearInterval(matrixInterval);
        canvas.style.display = "none";
        document
          .getElementById("terminal-overlay")
          .classList.remove("hidden-terminal");
        canvas.removeEventListener("click", exitMatrix);
      };

      canvas.addEventListener("click", exitMatrix);

      window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    }
  }
});
