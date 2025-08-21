const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const table = document.getElementById("content");
const editorEl = document.getElementById("editor");

// Archivo de trabajo (usa carpeta temporal del SO)
const ROUTE = path.join(os.tmpdir(), "hola.py");

// Configuraciones
const RUN_DEBOUNCE_MS = 300;     // evita ejecutar en cada tecla
const MAX_EXEC_MS = 5000;        // corta bucles infinitos (5s)
const MAX_OUTPUT_LEN = 200_000;  // evita reventar la UI
let currentChild = null;
let runTimer = null;
let debounceTimer = null;

window.onload = () => {
  editor.setValue("", 0);
  editor.focus();
  ensureFile(ROUTE);
};

// --- Utilidades ---
function ensureFile(file) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "");
}

function saveEditorToFile() {
  const code = editor.getValue();
  fs.writeFileSync(ROUTE, code, "utf8");
}

function setOutput(text) {
  // Para salida larga, usar <pre> o <textarea>. Aquí plaintext:
  table.innerText = text.slice(0, MAX_OUTPUT_LEN);
}

function appendOutput(chunk) {
  const curr = table.innerText || "";
  const next = (curr + chunk).slice(0, MAX_OUTPUT_LEN);
  table.innerText = next;
}

function killCurrent() {
  if (currentChild) {
    try { currentChild.kill("SIGKILL"); } catch { }
    currentChild = null;
  }
  if (runTimer) {
    clearTimeout(runTimer);
    runTimer = null;
  }
}

// --- Ejecución controlada ---
function runPython() {
  // 1) Guardamos el archivo
  saveEditorToFile();

  table.textContent = "";

  // 2) Cancelamos ejecución previa (si existiera)
  killCurrent();

  // 3) Limpiamos la salida
  // setOutput("▶ Ejecutando…");

  // 4) Lanzamos Python con aislamiento básico y salida sin buffer
  //    -I: modo aislado (ignora PYTHONPATH, site, etc.)
  //    -u: unbuffered (streaming inmediato)
  //    Activa faulthandler via env para mejores tracebacks.
  const pyArgs = ["-I", "-u", ROUTE];
  const env = { ...process.env, PYTHONFAULTHANDLER: "1" };

  // En Linux/macOS puedes añadir límites de CPU/memoria:
  // const shellCmd = `ulimit -t 3 -v 524288; exec python3 ${pyArgs.map(a => JSON.stringify(a)).join(" ")}`;
  // const child = spawn("bash", ["-lc", shellCmd], { env });

  // Portable (Windows/Linux/macOS) sin ulimit:
  const child = spawn("python3", pyArgs, { env });

  currentChild = child;

  // 5) Timeout anti-bucle infinito
  runTimer = setTimeout(() => {
    appendOutput("\n⏱️ Tiempo de ejecución excedido. Proceso cancelado.");
    killCurrent();
  }, MAX_EXEC_MS);

  // 6) Streaming de salida
  child.stdout.on("data", (data) => appendOutput(data.toString()));
  child.stderr.on("data", (data) => appendOutput(data.toString()));

  child.on("error", (err) => {
    appendOutput(`\n❌ Error al iniciar Python: ${err.message}`);
  });

  child.on("close", (code, signal) => {
    if (runTimer) { clearTimeout(runTimer); runTimer = null; }
    currentChild = null;

    if (signal === "SIGKILL") return; // ya mostramos mensaje de timeout
    if (code === 0) {
      // appendOutput("\n✅ Finalizado.");
    } else {
      appendOutput(`\n⚠️ Salió con código ${code}.`);
    }
  });
}

// --- Debounce de ejecuciones en tipeo ---
function debouncedRun() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    runPython();
  }, RUN_DEBOUNCE_MS);
}

// --- Eventos ---
editorEl.addEventListener("keyup", debouncedRun);

document.addEventListener("keydown", (event) => {
  // Limpiar editor
  if (event.ctrlKey && event.key.toLowerCase() === "q") {
    editor.selectAll();
    editor.removeLines();
    setOutput("");
  }

  // Ejecutar manualmente con Ctrl+B (sin esperar debounce)
  if (event.ctrlKey && event.key.toLowerCase() === "b") {
    event.preventDefault();
    debouncedRun(); // reusa la misma ruta (guarda + run)
  }

  // Cancelar ejecución con Ctrl+.
  if (event.ctrlKey && event.key === ".") {
    event.preventDefault();
    appendOutput("\n🛑 Cancelado por el usuario.");
    killCurrent();
  }
});
