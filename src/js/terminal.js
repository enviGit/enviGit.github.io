// Interactive terminal overlay (desktop only): virtual file system, commands,
// typewriter output, accent/theme/motion controls and a draggable window.
function initTerminalSystem() {
    if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768) return;

    const el = {
        overlay: document.getElementById("terminal-overlay"),
        body: document.getElementById("terminal-body"),
        input: document.getElementById("terminal-input"),
        header: document.getElementById("terminal-header"),
        closeBtn: document.getElementById("close-terminal"),
        minBtn: document.getElementById("minimize-terminal"),
        maxBtn: document.getElementById("maximize-terminal"),
        toggleBtn: document.getElementById("terminal-toggle"),
    };
    if (!el.input || !el.body || document.getElementById("terminal-active-line")) return;

    // The static markup is only a no-JS fallback; the live terminal is built below.
    el.input.parentElement?.removeChild(el.input);
    el.body.innerHTML = "";

    // ---------- Accent colour ----------

    const ACCENT_PRESETS = {
        default: { dark: "#4ade80", light: "#047857" },
        green: { dark: "#4ade80", light: "#047857" },
        blue: { dark: "#3b82f6", light: "#1d4ed8" },
        red: { dark: "#ef4444", light: "#b91c1c" },
        purple: { dark: "#a855f7", light: "#7e22ce" },
        yellow: { dark: "#eab308", light: "#a16207" },
        cyan: { dark: "#22d3ee", light: "#0e7490" },
        pink: { dark: "#f472b6", light: "#be185d" },
        white: { dark: "#ffffff", light: "#111111" },
        orange: { dark: "#f97316", light: "#c2410c" },
    };

    function applyAccent(color) {
        let style = document.getElementById("terminal-accent-override");
        if (!style) {
            style = document.createElement("style");
            style.id = "terminal-accent-override";
            document.head.appendChild(style);
        }
        style.textContent = `body { --accent: ${color} !important; }`;
    }

    function presetColor(name) {
        const preset = ACCENT_PRESETS[name];
        if (!preset) return null;
        return document.body.classList.contains("light-mode") ? preset.light : preset.dark;
    }

    queueMicrotask(function () {
        const preset = localStorage.getItem("terminal-accent-preset");
        if (preset) {
            applyAccent(presetColor(preset));
        } else {
            const hex = localStorage.getItem("terminal-accent-hex");
            if (hex) applyAccent(hex);
        }
    });

    // Presets have separate light/dark values, so re-apply when the theme flips.
    new MutationObserver(() => {
        const preset = localStorage.getItem("terminal-accent-preset");
        if (preset) applyAccent(presetColor(preset));
    }).observe(document.body, { attributeFilter: ["class"] });

    // ---------- Output ----------

    const historyEl = document.createElement("div");
    historyEl.id = "terminal-history";
    historyEl.style.marginBottom = "5px";
    historyEl.style.width = "100%";
    el.body.appendChild(historyEl);

    // Types HTML into `target` a few visible characters at a time.
    // Tags are copied whole so the markup is never broken mid-way.
    const typeOut = (target, html, delay, focusAfter) => {
        el.input.disabled = true;
        let index = 0;
        let insideTag = false;
        let rendered = "";
        const charsPerTick = Math.max(1, Math.ceil(html.replace(/<[^>]*>/g, "").length / 90));

        (function tick() {
            let chunk = "";
            let visible = 0;
            while (index < html.length) {
                const ch = html[index++];
                chunk += ch;
                if (ch === "<") insideTag = true;
                if (ch === ">") insideTag = false;
                if (!insideTag && ++visible >= charsPerTick) break;
            }
            rendered += chunk;
            target.innerHTML = rendered;
            el.body.scrollTop = el.body.scrollHeight;

            if (index < html.length) {
                setTimeout(tick, delay);
            } else {
                el.input.disabled = false;
                if (focusAfter && !el.overlay.classList.contains("hidden-terminal")) el.input.focus();
            }
        })();
    };

    const bootLine = document.createElement("div");
    historyEl.appendChild(bootLine);
    typeOut(
        bootLine,
        '<span style="color:var(--term-gray);">System initialized. Type </span><span style="color:var(--term-text); font-weight:bold;">help</span><span style="color:var(--term-gray);"> to view available commands.</span><br><br>',
        3,
        false
    );

    // ---------- Prompt + input line ----------

    const activeLine = document.createElement("div");
    activeLine.id = "terminal-active-line";
    activeLine.style.display = "flex";
    activeLine.style.alignItems = "center";

    const promptLabel = document.createElement("span");
    promptLabel.id = "terminal-prompt-label";
    promptLabel.style.marginRight = "8px";
    promptLabel.style.whiteSpace = "nowrap";

    activeLine.appendChild(promptLabel);
    activeLine.appendChild(el.input);
    el.body.appendChild(activeLine);

    Object.assign(el.input.style, {
        flexGrow: "1",
        border: "none",
        background: "transparent",
        color: "var(--term-text)",
        outline: "none",
        fontFamily: "inherit",
        fontSize: "inherit",
        padding: "0",
        margin: "0",
    });
    el.input.setAttribute("autocomplete", "off");
    el.input.setAttribute("spellcheck", "false");

    // ---------- Virtual file system ----------

    const fileSystem = {
        name: "/",
        type: "dir",
        children: {
            home: {
                type: "dir",
                children: {
                    guest: {
                        type: "dir",
                        children: {
                            "about.txt": { type: "file", content: "Implementation Specialist @ Printbox. Client problem solver: instance configs, Shopware, PrestaShop and Shopify integrations." },
                            "skills.md": {
                                type: "file",
                                content: "Languages: C# / .NET | Rust | C++ | Python | SQL<br>Platforms &amp; Tools: Unity3D | React | Git | Linux Administration | XML / JSON<br>E-commerce: Shopware | PrestaShop | Shopify<br>Domain: Cybersecurity | Technical Integration | Network Automation | Technical Support",
                            },
                            projects: {
                                type: "dir",
                                children: {
                                    "winget-portable.txt": {
                                        type: "file",
                                        content: "Rust, Tauri. A single-exe tool that scans and batch-updates Windows apps via Winget.<br>https://github.com/enviGit/winget-portable",
                                    },
                                    "ps-catch.txt": {
                                        type: "file",
                                        content: "React, Supabase. Tracks PlayStation prices across US, UK, EU and PL stores in one grid.<br>https://envigit.github.io/ps-catch/",
                                    },
                                    "vibrant-icons.txt": {
                                        type: "file",
                                        content: "Unity, C#. Asset Store Editor tool that gives scripts custom icons.<br>https://assetstore.unity.com/packages/tools/gui/vibrant-icons-276821",
                                    },
                                    "operation-deratization.txt": {
                                        type: "file",
                                        content: "Unity, C#. Low-poly battle royale FPS made by a 4-person team.<br>https://github.com/enviGit/OperationDeratization",
                                    },
                                    "pomodoro-timer.txt": {
                                        type: "file",
                                        content: "C#, WPF. Distraction-free .NET 10 timer with taskbar progress.<br>https://github.com/enviGit/PomodoroTimer",
                                    },
                                    "weather-prophet.txt": {
                                        type: "file",
                                        content: "C#, WPF. MVVM rewrite of a legacy weather app with live localization.<br>https://github.com/enviGit/WeatherProphet",
                                    },
                                    "readme.txt": { type: "file", content: "Each project file ends with a link. Open it with <b>open [url]</b>." },
                                },
                            },
                            "role.txt": { type: "file", content: "Implementation Specialist @ Printbox" },
                            "education.txt": { type: "file", content: "MSc Cybersecurity @ WSEI Kraków" },
                            interests: {
                                type: "dir",
                                children: {
                                    unity: { type: "dir", children: {} },
                                    cybersecurity: { type: "dir", children: {} },
                                    dotnet: { type: "dir", children: {} },
                                    hardware: { type: "dir", children: {} },
                                },
                            },
                            "contact.info": { type: "file", content: "Email: paweltrojanski@gmail.com | LinkedIn: /in/ptrojanski" },
                            "cv.pdf": { type: "binary", content: "Binary file." },
                        },
                    },
                },
            },
            bin: { type: "dir", children: {} },
            etc: { type: "dir", children: {} },
        },
    };

    const HOME = ["home", "guest"];
    const state = {
        currentPath: [...HOME],
        history: [],
        historyIndex: -1,
        currentUser: "guest",
    };

    const getNode = (path) => {
        let node = fileSystem;
        for (const part of path) {
            if (!node.children || !node.children[part]) return null;
            node = node.children[part];
        }
        return node;
    };

    // Resolves an absolute, relative or ~ path to a directory path array (null if missing).
    const resolvePath = (input) => {
        if (!input) return [...state.currentPath];
        const parts = input.split("/");
        const path = input.startsWith("/") ? [] : parts[0] === "~" ? [...HOME] : [...state.currentPath];
        for (const part of parts) {
            if (!part || part === "." || part === "~") continue;
            if (part === "..") {
                if (path.length > 0) path.pop();
                continue;
            }
            const dir = getNode(path);
            if (!dir?.children?.[part] || dir.children[part].type !== "dir") return null;
            path.push(part);
        }
        return path;
    };

    const displayPath = () =>
        "~" + (state.currentPath.length > 2 ? "/" + state.currentPath.slice(2).join("/") : "");

    const renderPrompt = () => {
        promptLabel.innerHTML = `<span style="color:var(--term-prompt-brackets);">[</span><span style="color:var(--accent);">${state.currentUser}@ptrojanski</span> <span style="color:var(--term-path);">${displayPath()}</span><span style="color:var(--term-prompt-brackets);">]$</span>`;
    };
    renderPrompt();

    // ---------- Window state ----------

    function motionEnabled() {
        return !document.body.classList.contains("motion-reduced");
    }

    function closeTerminal() {
        el.overlay.classList.add("term-closing");
        const closeAnimationMs = motionEnabled() ? 310 : 0;
        setTimeout(() => {
            el.overlay.classList.add("hidden-terminal");
        }, closeAnimationMs);
        el.toggleBtn.setAttribute("aria-expanded", "false");
        el.toggleBtn.focus();
    }

    function openTerminal() {
        el.overlay.classList.remove("hidden-terminal");
        el.overlay.offsetWidth; // force reflow so the opening transition runs
        el.overlay.classList.remove("term-closing");
        el.toggleBtn.setAttribute("aria-expanded", "true");
        setTimeout(() => el.input.focus(), motionEnabled() ? 60 : 20);
    }

    function resetPosition() {
        el.overlay.style.left = "";
        el.overlay.style.top = "";
        el.overlay.style.transform = "";
        el.overlay.style.margin = "";
    }

    function toggleMinimize() {
        if (el.overlay.classList.contains("term-minimized")) {
            el.overlay.classList.remove("term-minimized");
            el.overlay.style.height = "";
            el.overlay.style.width = "";
            return;
        }
        el.overlay.classList.remove("term-maximized");
        resetPosition();
        el.overlay.classList.add("term-minimized");
        el.overlay.style.height = el.header.offsetHeight + "px";

        // Shrink to exactly fit the traffic lights + title.
        const lights = el.header.querySelector(".term-traffic-lights");
        const title = el.header.querySelector(".terminal-title");
        const headerStyle = getComputedStyle(el.header);
        const chrome =
            (parseFloat(headerStyle.gap) || 10) +
            (parseFloat(headerStyle.paddingLeft) || 0) +
            (parseFloat(headerStyle.paddingRight) || 0);
        el.overlay.style.width = Math.ceil(lights.getBoundingClientRect().width + title.scrollWidth + chrome + 14) + "px";
    }

    function toggleMaximize() {
        if (el.overlay.classList.contains("term-maximized")) {
            el.overlay.classList.remove("term-maximized");
            return;
        }
        el.overlay.classList.remove("term-minimized");
        el.overlay.classList.add("term-maximized");
        resetPosition();
    }

    // ---------- Commands ----------
    // Each command gets (args, rawInput) and returns HTML to print,
    // "" for no output, or null when it handled the output itself.

    const MANUAL = {
        ls: "Usage: ls [-l] [-a] [dir]<br>List information about the FILEs.",
        cd: "Usage: cd [dir]<br>Change the shell working directory. Supports relative paths.",
        cat: "Usage: cat [file]<br>Concatenate FILE(s) to standard output.",
        open: "Usage: open [file]<br>Open a file in the default application.",
        mkdir: "Usage: mkdir [name]<br>Create the DIRECTORY(ies).",
        touch: "Usage: touch [name]<br>Create empty file.",
        rm: "Usage: rm [name]<br>Remove the FILE(s).",
        reboot: "Usage: reboot<br>Restart the system.",
        whoami: "Usage: whoami<br>Print current user.",
        color: "Usage: color [name|hex]<br>Change system accent color.",
        theme: "Usage: theme [light|dark]<br>Switch system visual theme.",
        motion: "Usage: motion [auto|on|off]<br>Override reduced-motion site-wide (not just the terminal). 'auto' respects your system setting, 'on' forces animations, 'off' forces them paused.",
        minimize: "Usage: minimize<br>Minimize the terminal window to a small bar.",
        maximize: "Usage: maximize<br>Maximize the terminal window.",
        clear: "Usage: clear<br>Clear screen.",
    };

    const HELP_HTML = `
        <div style="margin-bottom:5px;color:var(--term-text);">Available commands:</div>
        <div style="display:grid;grid-template-columns:80px auto;gap:5px;color:var(--term-text-dim);">
          <div><span style="color:var(--term-text)">ls</span></div>      <div>List directory contents</div>
          <div><span style="color:var(--term-text)">cd</span></div>      <div>Change directory</div>
          <div><span style="color:var(--term-text)">cat</span></div>     <div>Read text file</div>
          <div><span style="color:var(--term-text)">open</span></div>    <div>Open file (PDF, links)</div>
          <div><span style="color:var(--term-text)">mkdir</span></div>   <div>Create directory</div>
          <div><span style="color:var(--term-text)">touch</span></div>   <div>Create file</div>
          <div><span style="color:var(--term-text)">rm</span></div>      <div>Remove file</div>
          <div><span style="color:var(--term-text)">echo</span></div>    <div>Print text / write to file</div>
          <div><span style="color:var(--term-text)">whoami</span></div>  <div>Display current user</div>
          <div><span style="color:var(--term-text)">color</span></div>   <div>Change system accent</div>
          <div><span style="color:var(--term-text)">theme</span></div>   <div>Switch light/dark mode</div>
          <div><span style="color:var(--term-text)">motion</span></div>  <div>Override reduced-motion site-wide</div>
          <div><span style="color:var(--term-text)">minimize</span></div><div>Minimize the terminal window</div>
          <div><span style="color:var(--term-text)">maximize</span></div><div>Maximize the terminal window</div>
          <div><span style="color:var(--term-text)">reboot</span></div>  <div>Restart system</div>
          <div><span style="color:var(--term-text)">clear</span></div>   <div>Clear terminal</div>
          <div><span style="color:var(--term-text)">exit</span></div>    <div>Close terminal</div>
        </div>
        <div style="margin-top:10px;color:var(--term-gray);">Type <span style="color:var(--term-text)">help [command]</span> for details.</div>
      `;

    const WHOAMI_HTML = `
        <pre style="font-size:0.5rem;line-height:1;color:var(--accent);margin-bottom:10px;margin-top:5px;">
     \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557    \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557
     \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551    \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2551
     \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551 \u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551
     \u2588\u2588\u2554\u2550\u2550\u2550\u255D \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2551
     \u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2554\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
     \u255A\u2550\u255D     \u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u2550\u255D\u255A\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D

     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557       \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2557   \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557  \u2588\u2588\u2557\u2588\u2588\u2557
     \u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557     \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2551 \u2588\u2588\u2554\u255D\u2588\u2588\u2551
        \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551   \u2588\u2588\u2551     \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2554\u2588\u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2551
        \u2588\u2588\u2551   \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588   \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\u255A\u2588\u2588\u2557\u2588\u2588\u2551\u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2588\u2588\u2557 \u2588\u2588\u2551
        \u2588\u2588\u2551   \u2588\u2588\u2551  \u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u255A\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551 \u255A\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2557\u2588\u2588\u2551
        \u255A\u2550\u255D   \u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D  \u255A\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D
        </pre>
        <div style="color:var(--term-text-dim);">
          User: <strong style="color:var(--term-text);">Pawe\u0142 Troja\u0144ski</strong> (root)<br>
          Role: Implementation Specialist @ Printbox
        </div>`;

    const commands = {
        help: (args) => {
            if (args.length > 1) return "usage: help [command]";
            if (args.length === 1) return MANUAL[args[0].toLowerCase()] ?? `No manual entry for ${args[0]}`;
            return HELP_HTML;
        },

        ls(args) {
            const flags = args.filter((a) => a.startsWith("-"));
            const targets = args.filter((a) => !a.startsWith("-"));
            if (targets.length > 1) return "ls: too many arguments";

            let path = state.currentPath;
            if (targets.length === 1) {
                const resolved = resolvePath(targets[0]);
                if (!resolved) return `ls: cannot access '${targets[0]}': No such file or directory`;
                path = resolved;
            }
            const dir = getNode(path);
            if (!dir?.children) return "";

            const showHidden = flags.includes("-a") || flags.includes("-la");
            const longFormat = flags.includes("-l") || flags.includes("-la");

            const entries = Object.entries(dir.children)
                .map(([name, node]) => {
                    if (name.startsWith(".") && !showHidden) return null;
                    let color = "var(--term-text-dim)";
                    if (node.type === "dir") color = "var(--term-dir)";
                    if (name.endsWith(".pdf") || name.endsWith(".zip")) color = "var(--term-error)";
                    const suffix = node.type === "dir" ? "/" : "";
                    const nameStyle = `color:${color};font-weight:${node.type === "dir" ? "bold" : "normal"};`;

                    if (longFormat) {
                        const perms = node.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--";
                        const size = Math.floor(4096 * Math.random());
                        return `<div class="ls-row" style="color:var(--term-text-dim);"><span style="margin-right:10px">${perms}</span> <span style="margin-right:10px">guest</span> <span style="margin-right:10px">${size}</span> <span style="${nameStyle}">${name}${suffix}</span></div>`;
                    }
                    return `<span style="${nameStyle}margin-right:15px;">${name}${suffix}</span>`;
                })
                .filter(Boolean);

            return longFormat ? entries.join("") : `<div style="display:flex;flex-wrap:wrap;">${entries.join("")}</div>`;
        },

        cd(args) {
            if (args.length > 1) return "cd: too many arguments";
            const target = args[0];
            if (!target || target === "~") {
                state.currentPath = [...HOME];
                renderPrompt();
                return "";
            }
            const path = resolvePath(target);
            if (!path) return `cd: ${target}: No such directory`;
            state.currentPath = path;
            renderPrompt();
            return "";
        },

        cat(args) {
            if (args.length !== 1) return "usage: cat [file]";
            const target = args[0];
            const slash = target.lastIndexOf("/");
            const dirPath = slash < 0 ? state.currentPath : resolvePath(target.slice(0, slash) || "/");
            const node = dirPath && getNode(dirPath)?.children?.[target.slice(slash + 1)];

            if (!node) return `cat: ${target}: No such file`;
            if (node.type === "dir") return `cat: ${target}: Is a directory`;
            if (node.type === "binary") {
                return `cat: ${target}: Cannot read binary file. Use <span style="color:var(--term-text);font-weight:bold;">open ${target}</span> to view it.`;
            }
            return `<span style="color:var(--term-text);">${node.content}</span>`;
        },

        open(args) {
            if (args.length !== 1) return "usage: open [file | url]";
            const target = args[0];

            if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("www.")) {
                const url = target.startsWith("www.") ? "https://" + target : target;
                window.open(url, "_blank", "noopener,noreferrer");
                return `Opening external link: ${url}...`;
            }

            const node = getNode(state.currentPath)?.children?.[target];
            if (!node) return `open: ${target}: No such file or directory`;
            if (node.type === "dir") return `open: ${target}: Is a directory`;
            if (target === "cv.pdf") {
                window.open("./assets/files/cv.pdf", "_blank", "noopener,noreferrer");
                return "Opening CV...";
            }
            return `open: ${target}: This is a text file. Use <span style="color:var(--term-text);font-weight:bold;">cat ${target}</span> to read it.`;
        },

        mkdir(args) {
            if (args.length !== 1) return "usage: mkdir [name]";
            const dir = getNode(state.currentPath);
            if (dir.children[args[0]]) return `mkdir: cannot create directory '${args[0]}': File exists`;
            dir.children[args[0]] = { type: "dir", children: {} };
            return "";
        },

        touch(args) {
            if (args.length !== 1) return "usage: touch [name]";
            getNode(state.currentPath).children[args[0]] ??= { type: "file", content: "" };
            return "";
        },

        rm(args) {
            if (args.length === 0) return "usage: rm [name]";
            const target = args.filter((a) => !a.startsWith("-"))[0];
            if (!target) return "usage: rm [name]";
            if (target === "/" && args.includes("-rf")) {
                commands.reboot([]);
                return "";
            }
            const dir = getNode(state.currentPath);
            if (!dir.children[target]) return `rm: cannot remove '${target}': No such file`;
            delete dir.children[target];
            return "";
        },

        echo(args, raw) {
            // `echo text > file` writes into the current directory.
            if (raw.includes(">")) {
                const [left, right] = raw.split(">");
                const text = left.replace("echo", "").trim().replace(/^['"]|['"]$/g, "");
                const fileName = right.trim();
                getNode(state.currentPath).children[fileName] = { type: "file", content: text };
                return "";
            }
            return `<span style="color:var(--term-text);">${args.join(" ").replace(/^['"]|['"]$/g, "")}</span>`;
        },

        color(args) {
            if (args.length === 0) {
                const swatches = Object.entries(ACCENT_PRESETS)
                    .map(([name, preset]) => `<span style="color:${preset.dark};margin-right:10px;">■ ${name}</span>`)
                    .join("");
                return `Usage: color [name | hex]<br>Available presets:<br><div style="display:flex;flex-wrap:wrap;margin-top:5px;">${swatches}</div><br>Or use hex: <span style="color:var(--term-text)">color #ff00ff</span>`;
            }

            const value = args[0].toLowerCase();
            if (ACCENT_PRESETS[value]) {
                const color = presetColor(value);
                applyAccent(color);
                localStorage.setItem("terminal-accent-preset", value);
                localStorage.removeItem("terminal-accent-hex");
                return `Color changed to <span style="color:${color}">${value}</span>.`;
            }
            if (/^#?([0-9A-F]{3}){1,2}$/i.test(value)) {
                const hex = value.startsWith("#") ? value : "#" + value;
                applyAccent(hex);
                localStorage.setItem("terminal-accent-hex", hex);
                localStorage.removeItem("terminal-accent-preset");
                return `Color changed to <span style="color:${hex}">custom hex</span>.`;
            }
            return `color: invalid color or hex '${value}'`;
        },

        theme(args) {
            const mode = args.length > 0 ? args[0].toLowerCase() : "toggle";
            if (!["light", "dark", "toggle"].includes(mode)) return `theme: invalid argument '${mode}'. Use [light|dark]`;

            const body = document.body;
            const isLight = body.classList.contains("light-mode");
            const toLight = mode === "toggle" ? !isLight : mode === "light";
            if (toLight) body.classList.add("light-mode");
            else body.classList.remove("light-mode");
            localStorage.setItem("theme", toLight ? "light" : "dark");

            const preset = localStorage.getItem("terminal-accent-preset");
            if (preset) applyAccent(presetColor(preset));
            return `System theme set to <span style="color:var(--term-text);font-weight:bold;">${toLight ? "LIGHT" : "DARK"}</span>.`;
        },

        whoami: (args) => (args.length > 0 ? `whoami: extra operand '${args[0]}'` : WHOAMI_HTML),

        exit: (args) => {
            if (args.length > 0) return "exit: too many arguments";
            closeTerminal();
            return "";
        },

        motion(args) {
            if (args.length === 0) {
                const setting = localStorage.getItem("terminal-motion") || "auto";
                const systemReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                return `Motion: <span style="color:var(--term-text);font-weight:bold;">${setting}</span> (system prefers-reduced-motion: ${systemReduce ? "reduce" : "no-preference"})<br>Overrides reduced-motion site-wide, not just for the terminal.<br>Usage: motion [auto|on|off]`;
            }
            const value = args[0].toLowerCase();
            if (!["auto", "on", "off"].includes(value)) return `motion: invalid argument '${value}'. Use [auto|on|off]`;
            localStorage.setItem("terminal-motion", value);
            applyMotionPreference();
            return `Site-wide motion set to <span style="color:var(--term-text);font-weight:bold;">${value}</span>.`;
        },

        minimize: (args) => {
            if (args.length > 0) return "minimize: too many arguments";
            toggleMinimize();
            return "";
        },

        maximize: (args) => {
            if (args.length > 0) return "maximize: too many arguments";
            toggleMaximize();
            return "";
        },

        reboot: (args) => {
            if (args.length > 0) return `reboot: extra operand '${args[0]}'`;
            location.reload();
            return "";
        },

        clear: (args) => {
            if (args.length > 0) return "clear: too many arguments";
            historyEl.innerHTML = "";
            return null;
        },
    };

    // ---------- Keyboard ----------

    const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    el.input.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") event.preventDefault();

        if (event.key === "Enter") {
            event.preventDefault();
            const raw = el.input.value;
            const args = raw.trim().split(/\s+/);
            const name = args.shift().toLowerCase();

            if (raw.trim()) {
                state.history.push(raw);
                state.historyIndex = state.history.length;
            }

            // Echo the submitted line in the dimmed history style.
            const echoedPrompt = `<span style="color:var(--term-history);">[</span><span style="color:var(--term-history);">${state.currentUser}@ptrojanski</span> <span style="color:var(--term-history);">${displayPath()}</span><span style="color:var(--term-history);">]$</span>`;
            const line = document.createElement("div");
            line.innerHTML = `${echoedPrompt} <span style="color:var(--term-history);">${escapeHtml(raw)}</span>`;
            historyEl.appendChild(line);

            if (commands[name]) {
                const output = commands[name](args, raw);
                if (output !== null && output !== "") {
                    const response = document.createElement("div");
                    response.className = "term-response";
                    response.style.color = "var(--term-text-dim)";
                    response.style.marginBottom = "5px";
                    historyEl.appendChild(response);
                    typeOut(response, output, 1, true);
                }
            } else if (name !== "") {
                const error = document.createElement("div");
                error.style.color = "var(--term-error)";
                error.style.marginBottom = "5px";
                historyEl.appendChild(error);
                typeOut(error, `bash: ${name}: command not found`, 2, true);
            }

            el.input.value = "";
            el.body.scrollTop = el.body.scrollHeight;
            return;
        }

        if (event.key === "ArrowUp") {
            if (state.historyIndex > 0) {
                state.historyIndex--;
                el.input.value = state.history[state.historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++;
                el.input.value = state.history[state.historyIndex];
            } else {
                state.historyIndex = state.history.length;
                el.input.value = "";
            }
        }
    });

    el.toggleBtn.addEventListener("click", (event) => {
        event.preventDefault();
        if (el.overlay.classList.contains("hidden-terminal")) openTerminal();
        else closeTerminal();
    });
    el.closeBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        closeTerminal();
    });
    if (el.minBtn) {
        el.minBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleMinimize();
        });
    }
    if (el.maxBtn) {
        el.maxBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleMaximize();
        });
    }
    el.body.addEventListener("click", () => el.input.focus());

    // Escape closes; Tab is trapped inside the dialog.
    el.overlay.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeTerminal();
            return;
        }
        if (event.key === "Tab") {
            const focusable = Array.from(el.overlay.querySelectorAll("button, input")).filter(
                (node) => !node.disabled && node.offsetParent !== null
            );
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey) {
                if (document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }
            } else if (document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    // ---------- Dragging by the header ----------
    // While dragging only `transform` changes; left/top are committed on mouseup.

    let isDragging = false;
    let startX;
    let startY;
    let originLeft = 0;
    let originTop = 0;

    el.header.addEventListener("mousedown", (event) => {
        if (
            event.target === el.closeBtn ||
            el.closeBtn.contains(event.target) ||
            event.target === el.minBtn ||
            event.target === el.maxBtn
        ) {
            return;
        }
        isDragging = true;
        el.overlay.classList.add("dragging");
        el.header.classList.add("dragging");
        document.body.style.userSelect = "none";
        document.body.style.webkitUserSelect = "none";
        startX = event.clientX;
        startY = event.clientY;

        const rect = el.overlay.getBoundingClientRect();
        originLeft = rect.left;
        originTop = rect.top;
        el.overlay.style.transform = "none";
        el.overlay.style.left = `${originLeft}px`;
        el.overlay.style.top = `${originTop}px`;
        el.overlay.style.margin = "0";
    });

    window.addEventListener(
        "mousemove",
        (event) => {
            if (!isDragging) return;
            event.preventDefault();
            const maxLeft = window.innerWidth - el.overlay.offsetWidth;
            const maxTop = window.innerHeight - el.overlay.offsetHeight;
            const dx = Math.max(0, Math.min(originLeft + (event.clientX - startX), maxLeft)) - originLeft;
            const dy = Math.max(0, Math.min(originTop + (event.clientY - startY), maxTop)) - originTop;
            el.overlay.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        },
        { passive: false }
    );

    window.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        const rect = el.overlay.getBoundingClientRect();
        el.overlay.style.transform = "none";
        el.overlay.style.left = `${rect.left}px`;
        el.overlay.style.top = `${rect.top}px`;
        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";
        requestAnimationFrame(() => {
            el.overlay.classList.remove("dragging");
            el.header.classList.remove("dragging");
        });
    });
}
