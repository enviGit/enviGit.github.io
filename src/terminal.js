document.addEventListener("DOMContentLoaded", () => {
  initTerminalSystem();
});

function initTerminalSystem() {
  const refs = {
    overlay: document.getElementById("terminal-overlay"),
    body: document.getElementById("terminal-body"),
    input: document.getElementById("terminal-input"),
    header: document.getElementById("terminal-header"),
    closeBtn: document.getElementById("close-terminal"),
    toggleBtn: document.getElementById("terminal-toggle"),
    canvas: document.getElementById("matrix-canvas"),
  };

  if (!refs.input || !refs.body) return;
  if (document.getElementById("terminal-active-line")) return;

  refs.input.parentElement?.removeChild(refs.input);
  refs.body.innerHTML = "";

  const historyLog = document.createElement("div");
  historyLog.id = "terminal-history";
  historyLog.style.marginBottom = "5px";
  historyLog.style.width = "100%";
  refs.body.appendChild(historyLog);

  const welcomeMsg = document.createElement("div");
  welcomeMsg.innerHTML = `<span style="color:var(--term-gray);">System initialized. Type </span><span style="color:var(--term-text); font-weight:bold;">help</span><span style="color:var(--term-gray);"> to view available commands.</span><br><br>`;
  historyLog.appendChild(welcomeMsg);

  const activeLine = document.createElement("div");
  activeLine.id = "terminal-active-line";
  activeLine.style.display = "flex";
  activeLine.style.alignItems = "center";

  const promptLabel = document.createElement("span");
  promptLabel.id = "terminal-prompt-label";
  promptLabel.style.marginRight = "8px";
  promptLabel.style.whiteSpace = "nowrap";

  activeLine.appendChild(promptLabel);
  activeLine.appendChild(refs.input);
  refs.body.appendChild(activeLine);

  refs.input.style.flexGrow = "1";
  refs.input.style.border = "none";
  refs.input.style.background = "transparent";
  refs.input.style.color = "var(--term-text)";
  refs.input.style.outline = "none";
  refs.input.style.fontFamily = "inherit";
  refs.input.style.fontSize = "inherit";
  refs.input.style.padding = "0";
  refs.input.style.margin = "0";
  refs.input.setAttribute("autocomplete", "off");
  refs.input.setAttribute("spellcheck", "false");

  const root = {
    name: "/",
    type: "dir",
    children: {
      home: {
        type: "dir",
        children: {
          guest: {
            type: "dir",
            children: {
              "about.txt": {
                type: "file",
                content: "Junior Implementation Specialist. .NET Enthusiast.",
              },
              "skills.md": {
                type: "file",
                content: "C# | Unity | SQL | Git | Linux | Cybersecurity",
              },
              projects: {
                type: "dir",
                children: {
                  "NetSentry.log": {
                    type: "file",
                    content: "System monitoring... [OK]",
                  },
                  "readme.txt": {
                    type: "file",
                    content: "Check the visual section for more info.",
                  },
                },
              },
              "contact.info": {
                type: "file",
                content:
                  "Email: paweltrojanski@gmail.com | LinkedIn: /in/ptrojanski",
              },
              "cv.pdf": { type: "binary", content: "Binary file." },
            },
          },
        },
      },
      bin: { type: "dir", children: {} },
      etc: { type: "dir", children: {} },
    },
  };

  let state = {
    currentPath: ["home", "guest"],
    history: [],
    historyIndex: -1,
    currentUser: "guest",
  };

  const getDirFromPathArray = (pathArr) => {
    let current = root;
    for (const dirName of pathArr) {
      if (current.children && current.children[dirName]) {
        current = current.children[dirName];
      } else {
        return null;
      }
    }
    return current;
  };

  const resolvePath = (pathStr) => {
    if (!pathStr) return [...state.currentPath];

    let tempPath = pathStr.startsWith("/") ? [] : [...state.currentPath];
    const parts = pathStr.split("/");

    for (const part of parts) {
      if (part === "" || part === ".") continue;
      if (part === "..") {
        if (tempPath.length > 0) tempPath.pop();
      } else {
        const currentObj = getDirFromPathArray(tempPath);
        if (
          currentObj &&
          currentObj.children &&
          currentObj.children[part] &&
          currentObj.children[part].type === "dir"
        ) {
          tempPath.push(part);
        } else {
          return null;
        }
      }
    }
    return tempPath;
  };

  const renderPrompt = () => {
    const pathStr =
      "~" +
      (state.currentPath.length > 2
        ? "/" + state.currentPath.slice(2).join("/")
        : "");
    promptLabel.innerHTML = `<span style="color:var(--term-prompt-brackets);">[</span><span style="color:var(--accent);">${state.currentUser}@ptrojanski</span> <span style="color:var(--term-path);">${pathStr}</span><span style="color:var(--term-prompt-brackets);">]$</span>`;
  };

  renderPrompt();

  const commands = {
    help: (args) => {
      if (args.length > 1) return "usage: help [command]";
      if (args.length === 1) {
        const cmd = args[0].toLowerCase();
        const manuals = {
          ls: "Usage: ls [-l] [-a] [dir]<br>List information about the FILEs.",
          cd: "Usage: cd [dir]<br>Change the shell working directory. Supports relative paths.",
          cat: "Usage: cat [file]<br>Concatenate FILE(s) to standard output.",
          open: "Usage: open [file]<br>Open a file in the default application.",
          mkdir: "Usage: mkdir [name]<br>Create the DIRECTORY(ies).",
          touch: "Usage: touch [name]<br>Create empty file.",
          rm: "Usage: rm [name]<br>Remove the FILE(s).",
          reboot: "Usage: reboot<br>Restart the system.",
          whoami: "Usage: whoami<br>Print current user.",
          matrix: "Usage: matrix<br>Enter the Matrix.",
          clear: "Usage: clear<br>Clear screen.",
        };
        return manuals[cmd] || `No manual entry for ${cmd}`;
      }
      return `
                  <div style="margin-bottom: 5px; color:var(--term-text);">Available commands:</div>
                  <div style="display: grid; grid-template-columns: 80px auto; gap: 5px; color: var(--term-text-dim);">
                      <div><span style="color:var(--term-text)">ls</span></div>     <div>List directory contents</div>
                      <div><span style="color:var(--term-text)">cd</span></div>     <div>Change directory</div>
                      <div><span style="color:var(--term-text)">cat</span></div>    <div>Read text file</div>
                      <div><span style="color:var(--term-text)">open</span></div>   <div>Open file (PDF, links)</div>
                      <div><span style="color:var(--term-text)">mkdir</span></div>  <div>Create directory</div>
                      <div><span style="color:var(--term-text)">touch</span></div>  <div>Create file</div>
                      <div><span style="color:var(--term-text)">rm</span></div>     <div>Remove file</div>
                      <div><span style="color:var(--term-text)">echo</span></div>   <div>Print text / write to file</div>
                      <div><span style="color:var(--term-text)">whoami</span></div> <div>Display current user</div>
                      <div><span style="color:var(--term-text)">matrix</span></div> <div>Enter the Matrix</div>
                      <div><span style="color:var(--term-text)">reboot</span></div> <div>Restart system</div>
                      <div><span style="color:var(--term-text)">clear</span></div>  <div>Clear terminal</div>
                      <div><span style="color:var(--term-text)">exit</span></div>   <div>Close terminal</div>
                  </div>
                  <div style="margin-top: 10px; color: var(--term-gray);">Type <span style="color:var(--term-text)">help [command]</span> for details.</div>
                  `;
    },

    ls: (args) => {
      const flags = args.filter((a) => a.startsWith("-"));
      const paths = args.filter((a) => !a.startsWith("-"));

      if (paths.length > 1) return "ls: too many arguments";

      let targetPathArr = state.currentPath;
      let dirNameForDisplay = "";

      if (paths.length === 1) {
        const resolved = resolvePath(paths[0]);
        if (!resolved)
          return `ls: cannot access '${paths[0]}': No such file or directory`;
        targetPathArr = resolved;
        dirNameForDisplay = paths[0];
      }

      const dirObj = getDirFromPathArray(targetPathArr);
      if (!dirObj || !dirObj.children) return "";

      const showHidden = flags.includes("-a") || flags.includes("-la");
      const listFormat = flags.includes("-l") || flags.includes("-la");

      let output = Object.entries(dirObj.children)
        .map(([name, data]) => {
          if (name.startsWith(".") && !showHidden) return null;

          let color = "var(--term-text-dim)";
          if (data.type === "dir") color = "var(--term-dir)";
          if (name.endsWith(".pdf") || name.endsWith(".zip"))
            color = "var(--term-error)";

          let suffix = data.type === "dir" ? "/" : "";
          let style = `color:${color}; font-weight:${data.type === "dir" ? "bold" : "normal"};`;

          if (listFormat) {
            let perms = data.type === "dir" ? "drwxr-xr-x" : "-rw-r--r--";
            let size = Math.floor(Math.random() * 4096);
            return `<div class="ls-row" style="color:var(--term-text-dim);"><span style="margin-right:10px">${perms}</span> <span style="margin-right:10px">guest</span> <span style="margin-right:10px">${size}</span> <span style="${style}">${name}${suffix}</span></div>`;
          }
          return `<span style="${style} margin-right:15px;">${name}${suffix}</span>`;
        })
        .filter(Boolean);

      return listFormat
        ? output.join("")
        : `<div style="display:flex; flex-wrap:wrap;">${output.join("")}</div>`;
    },

    cd: (args) => {
      if (args.length > 1) return "cd: too many arguments";
      const target = args[0];

      if (!target || target === "~") {
        state.currentPath = ["home", "guest"];
        renderPrompt();
        return "";
      }

      const resolvedPath = resolvePath(target);
      if (resolvedPath) {
        state.currentPath = resolvedPath;
        renderPrompt();
        return "";
      } else {
        return `cd: ${target}: No such directory`;
      }
    },

    cat: (args) => {
      if (args.length !== 1) return "usage: cat [file]";
      const fileName = args[0];
      const dir = getDirFromPathArray(state.currentPath);

      if (dir.children && dir.children[fileName]) {
        if (dir.children[fileName].type === "dir")
          return `cat: ${fileName}: Is a directory`;

        if (dir.children[fileName].type === "binary")
          return `cat: ${fileName}: Cannot read binary file. Use <span style="color:var(--term-text); font-weight:bold;">open ${fileName}</span> to view it.`;

        return `<span style="color:var(--term-text);">${dir.children[fileName].content}</span>`;
      }
      return `cat: ${fileName}: No such file`;
    },

    open: (args) => {
      if (args.length !== 1) return "usage: open [file | url]";

      let target = args[0];

      if (
        target.startsWith("http://") ||
        target.startsWith("https://") ||
        target.startsWith("www.")
      ) {
        let urlToOpen = target;

        if (target.startsWith("www.")) {
          urlToOpen = "https://" + target;
        }

        window.open(urlToOpen, "_blank");
        return `Opening external link: ${urlToOpen}...`;
      }

      const dir = getDirFromPathArray(state.currentPath);

      if (!dir.children[target]) {
        return `open: ${target}: No such file or directory`;
      }

      const file = dir.children[target];

      if (file.type === "dir") {
        return `open: ${target}: Is a directory`;
      }

      if (target === "cv.pdf") {
        window.open("./assets/files/cv.pdf", "_blank");
        return "Opening CV...";
      }

      return `open: ${target}: This is a text file. Use <span style="color:var(--term-text); font-weight:bold;">cat ${target}</span> to read it.`;
    },

    mkdir: (args) => {
      if (args.length !== 1) return "usage: mkdir [name]";
      const dir = getDirFromPathArray(state.currentPath);
      if (dir.children[args[0]])
        return `mkdir: cannot create directory '${args[0]}': File exists`;
      dir.children[args[0]] = { type: "dir", children: {} };
      return "";
    },

    touch: (args) => {
      if (args.length !== 1) return "usage: touch [name]";
      const dir = getDirFromPathArray(state.currentPath);
      if (!dir.children[args[0]])
        dir.children[args[0]] = { type: "file", content: "" };
      return "";
    },

    rm: (args) => {
      if (args.length === 0) return "usage: rm [name]";
      const name = args.filter((a) => !a.startsWith("-"))[0];
      if (!name) return "usage: rm [name]";

      if (name === "/" && args.includes("-rf")) {
        startRebootAnimation("KERNEL PANIC");
        return "";
      }

      const dir = getDirFromPathArray(state.currentPath);
      if (!dir.children[name])
        return `rm: cannot remove '${name}': No such file`;
      delete dir.children[name];
      return "";
    },

    echo: (args, raw) => {
      if (raw.includes(">")) {
        const parts = raw.split(">");
        const content = parts[0]
          .replace("echo", "")
          .trim()
          .replace(/^['"]|['"]$/g, "");
        const fileName = parts[1].trim();
        const dir = getDirFromPathArray(state.currentPath);
        dir.children[fileName] = { type: "file", content: content };
        return "";
      }
      return `<span style="color:var(--term-text);">${args.join(" ").replace(/^['"]|['"]$/g, "")}</span>`;
    },

    whoami: (args) => {
      if (args.length > 0) return `whoami: extra operand '${args[0]}'`;
      return `
                <pre style="font-size: 0.5rem; line-height: 1; color: var(--accent); margin-bottom: 10px; margin-top: 5px;">
     ██████╗  █████╗ ██╗    ██╗███████╗██╗
     ██╔══██╗██╔══██╗██║    ██║██╔════╝██║
     ██████╔╝███████║██║ █╗ ██║█████╗  ██║
     ██╔═══╝ ██╔══██║██║███╗██║██╔══╝  ██║
     ██║     ██║  ██║╚███╔███╔╝███████╗███████╗
     ╚═╝     ╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚══════╝

     ████████╗██████╗  ██████╗       ██╗ █████╗ ███╗   ██╗███████╗██╗  ██╗██╗
     ╚══██╔══╝██╔══██╗██╔═══██╗     ██║██╔══██╗████╗  ██║██╔════╝██║ ██╔╝██║
        ██║   ██████╔╝██║   ██║     ██║███████║██╔██╗ ██║███████╗█████╔╝ ██║
        ██║   ██╔══██╗██║   ██║██   ██║██╔══██╗██║╚██╗██║╚════██║██╔═██╗ ██║
        ██║   ██║  ██║╚██████╔╝╚█████╔╝██║  ██║██║ ╚████║███████║██║  ██╗██║
        ╚═╝   ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝
                </pre>
                <div style="color:var(--term-text-dim);">
                  User: <strong style="color:var(--term-text);">Paweł Trojański</strong> (root)<br>
                  Role: Implementation Spec & .NET Dev
                </div>`;
    },

    matrix: (args) => {
      if (args.length > 0) return `matrix: extra operand '${args[0]}'`;
      startMatrix(refs.overlay);
      return "Wake up...";
    },

    exit: (args) => {
      if (args.length > 0) return "exit: too many arguments";
      refs.overlay.classList.add("hidden-terminal");
      return "";
    },

    reboot: (args) => {
      if (args.length > 0) return `reboot: extra operand '${args[0]}'`;
      startRebootAnimation("System Rebooting");
      return "";
    },

    clear: (args) => {
      if (args.length > 0) return "clear: too many arguments";
      historyLog.innerHTML = "";
      return null;
    },
  };

  // --- Input & Logic ---
  refs.input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const raw = refs.input.value;
      const args = raw.trim().split(/\s+/);
      const cmd = args.shift().toLowerCase();

      if (raw.trim() !== "") {
        state.history.push(raw);
        state.historyIndex = state.history.length;
      }

      const pathStr =
        "~" +
        (state.currentPath.length > 2
          ? "/" + state.currentPath.slice(2).join("/")
          : "");

      const historyPrompt = `<span style="color:var(--term-history);">[</span><span style="color:var(--term-history);">${state.currentUser}@ptrojanski</span> <span style="color:var(--term-history);">${pathStr}</span><span style="color:var(--term-history);">]$</span>`;

      const frozenLine = document.createElement("div");
      frozenLine.innerHTML = `${historyPrompt} <span style="color:var(--term-history);">${escapeHtml(raw)}</span>`;
      historyLog.appendChild(frozenLine);

      if (commands[cmd]) {
        const output = commands[cmd](args, raw);
        if (output !== null && output !== "") {
          const respDiv = document.createElement("div");
          respDiv.className = "term-response";
          respDiv.style.color = "var(--term-text-dim)";
          respDiv.style.marginBottom = "5px";
          respDiv.innerHTML = output;
          historyLog.appendChild(respDiv);
        }
      } else if (cmd !== "") {
        const errDiv = document.createElement("div");
        errDiv.style.color = "var(--term-error)";
        errDiv.textContent = `bash: ${cmd}: command not found`;
        historyLog.appendChild(errDiv);
      }

      refs.input.value = "";
      refs.body.scrollTop = refs.body.scrollHeight;
    } else if (e.key === "ArrowUp") {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        refs.input.value = state.history[state.historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        refs.input.value = state.history[state.historyIndex];
      } else {
        state.historyIndex = state.history.length;
        refs.input.value = "";
      }
    }
  });

  refs.toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    refs.overlay.classList.toggle("hidden-terminal");
    if (!refs.overlay.classList.contains("hidden-terminal")) {
      setTimeout(() => refs.input.focus(), 100);
    }
  });

  refs.closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    refs.overlay.classList.add("hidden-terminal");
  });

  refs.body.addEventListener("click", () => refs.input.focus());

  // Drag Logic
  let isDragging = false,
    startX,
    startY,
    initLeft,
    initTop;
  refs.header.addEventListener("mousedown", (e) => {
    if (e.target === refs.closeBtn || refs.closeBtn.contains(e.target)) return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = refs.overlay.getBoundingClientRect();
    initLeft = rect.left;
    initTop = rect.top;
    refs.overlay.style.transform = "none";
    refs.overlay.style.left = `${initLeft}px`;
    refs.overlay.style.top = `${initTop}px`;
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    refs.overlay.style.left = `${initLeft + (e.clientX - startX)}px`;
    refs.overlay.style.top = `${initTop + (e.clientY - startY)}px`;
  });
  document.addEventListener("mouseup", () => (isDragging = false));

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // --- REBOOT EFFECT ---
  function startRebootAnimation(msg) {
    const canvas = refs.canvas;
    if (!canvas) {
      location.reload();
      return;
    }

    refs.overlay.classList.add("hidden-terminal");
    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    let dots = 0;

    const interval = setInterval(() => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0F0";
      ctx.font = "30px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let text = msg + ".".repeat(dots);
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      dots = (dots + 1) % 4;
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      location.reload();
    }, 2400);
  }

  // --- MATRIX EFFECT ---
  function startMatrix(overlay) {
    const canvas = refs.canvas;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    overlay.classList.add("hidden-terminal");
    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0F0";
      ctx.font = fontSize + "px monospace";
      ctx.textAlign = "start";
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    const stopMatrix = () => {
      clearInterval(interval);
      canvas.style.display = "none";
      overlay.classList.remove("hidden-terminal");
      refs.input.focus();
      canvas.removeEventListener("click", stopMatrix);
    };
    canvas.addEventListener("click", stopMatrix);
  }
}
