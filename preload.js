// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const vm = require('vm');

// ===== Runner Python/JS =====
let currentPyChild = null;

function pickPythonCmd() {
  if (process.platform === 'win32') return 'python';
  return 'python3';
}

contextBridge.exposeInMainWorld('runner', {
  tmpPath: (name) => path.join(os.tmpdir(), name),

  ensureFile: (p) => { if (!fs.existsSync(p)) fs.writeFileSync(p, ''); },
  saveFile: (p, content) => fs.writeFileSync(p, content, 'utf8'),

  runPython: (route, onData, onEnd, timeoutMs = 5000) => {
    try {
      if (currentPyChild) { try { currentPyChild.kill('SIGKILL'); } catch { } currentPyChild = null; }
      const cmd = pickPythonCmd();
      const args = ['-I', '-u', route];
      const env = { ...process.env, PYTHONFAULTHANDLER: '1' };

      const child = spawn(cmd, args, { env });
      currentPyChild = child;

      const timer = setTimeout(() => {
        try { child.kill('SIGKILL'); } catch { }
        onData?.('\n⏱️ Tiempo de ejecución excedido. Proceso cancelado.');
      }, timeoutMs);

      child.stdout.on('data', d => onData?.(d.toString()));
      child.stderr.on('data', d => onData?.(d.toString()));
      child.on('error', err => onData?.(`\n❌ Error al iniciar Python: ${err.message}`));
      child.on('close', code => {
        clearTimeout(timer);
        currentPyChild = null;
        onEnd?.(code);
      });
    } catch (e) {
      onData?.(`\n❌ Error: ${e.message || e}`);
      onEnd?.(1);
    }
  },

  cancelPython: () => {
    if (currentPyChild) {
      try { currentPyChild.kill('SIGKILL'); } catch { }
      currentPyChild = null;
    }
  },

  runJS: (code, timeoutMs = 5000) => {
    try {
      let out = '';
      const sandbox = {
        console: {
          log: (...a) => out += a.join(' ') + '\n',
          error: (...a) => out += a.join(' ') + '\n',
          warn: (...a) => out += a.join(' ') + '\n',
        },
        print: (...a) => out += a.join(' ') + '\n',
      };
      const ctx = vm.createContext(sandbox);
      const script = new vm.Script(code, { displayErrors: true });
      script.runInContext(ctx, { timeout: timeoutMs });
      return { ok: true, out };
    } catch (e) {
      return { ok: false, out: (e && e.stack) ? e.stack : String(e) };
    }
  }
});

// ===== DevTools =====
contextBridge.exposeInMainWorld('devtools', {
  toggle: (mode = 'detach') => ipcRenderer.send('devtools:toggle', mode),
});
