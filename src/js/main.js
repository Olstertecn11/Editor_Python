// src/js/main.js
(() => {
  'use strict';

  // ====== Config ======
  const RUN_DEBOUNCE_MS = 300;
  const MAX_OUTPUT_LEN = 200000;
  const DEFAULT_LANG = localStorage.getItem('editor.lang') || 'python';

  // ====== Estado ======
  let editor;                // instancia de Ace
  let CURRENT_LANG = DEFAULT_LANG;     // 'python' | 'javascript'
  let debounceTimer = null;

  // ====== UI ======
  const outEl = document.getElementById('content');

  function setOutput(txt) { outEl.innerText = (txt || '').slice(0, MAX_OUTPUT_LEN); }
  function appendOutput(chunk) {
    outEl.innerText = (outEl.innerText + (chunk || '')).slice(0, MAX_OUTPUT_LEN);
  }

  // ====== Rutas temp (desde preload) ======
  const ROUTES = {
    python: window.runner.tmpPath('editor_python.py'),
    javascript: window.runner.tmpPath('editor_js.js'),
  };

  // ====== Lenguaje ======
  function setLanguage(event, lang = 'python') {
    if (event.classList && !event.classList.contains('active')) {
      const buttons = document.querySelectorAll('.lang-button');
      buttons.forEach(btn => btn.classList.remove('active'));
      event.classList.add('active');
    };

    document.getElementById('lang-notifier').innerText = lang;


    CURRENT_LANG = (lang === 'javascript') ? 'javascript' : 'python';
    localStorage.setItem('editor.lang', CURRENT_LANG);
    editor.session.setMode(
      CURRENT_LANG === 'javascript' ? 'ace/mode/javascript' : 'ace/mode/python'
    );
    runCurrent();
  }
  window.setLanguage = setLanguage;

  // ====== Runners ======
  function runPython() {
    window.runner.saveFile(ROUTES.python, editor.getValue());
    setOutput('');
    window.runner.runPython(
      ROUTES.python,
      (chunk) => appendOutput(chunk),
      (code) => { if (code !== 0) appendOutput(`\n⚠️Código ${code}`); },
      5000
    );
  }

  function runJS() {
    setOutput('');
    const res = window.runner.runJS(editor.getValue(), 5000);
    appendOutput(res.out);
  }

  function runCurrent() {
    if (CURRENT_LANG === 'javascript') runJS();
    else runPython();
  }
  window.runCurrent = runCurrent;

  // ====== Debounce ======
  function onEditorChange() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runCurrent, RUN_DEBOUNCE_MS);
  }

  // ====== Init ======
  window.addEventListener('DOMContentLoaded', () => {
    ace.config.set('basePath', 'assets/');
    ace.config.setModuleUrl('ace/mode/python', 'assets/mode-python.js');
    ace.config.setModuleUrl('ace/snippets/python', 'assets/snippets/python.js');
    ace.config.setModuleUrl('ace/mode/javascript', 'assets/mode-javascript.js');
    ace.config.setModuleUrl('ace/mode/javascript_worker', 'assets/worker-javascript.js');
    ace.config.setModuleUrl('ace/snippets/javascript', 'assets/snippets/javascript.js');
    ace.config.setModuleUrl('ace/keyboard/vim', 'assets/ext-vim.js');

    editor = ace.edit('editor');
    window.editor = editor;

    editor.setTheme('ace/theme/tokyo-night');
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true
    });

    editor.setKeyboardHandler("ace/keyboard/vim");

    const vimModule = ace.require("ace/keyboard/vim");
    const Vim = vimModule.Vim || (vimModule.CodeMirror && vimModule.CodeMirror.Vim);
    if (Vim) {
      Vim.map('kk', '<Esc>', 'insert');
    }

    setLanguage(CURRENT_LANG);

    editor.session.on('change', onEditorChange);

    window.runner.ensureFile(ROUTES.python);
    window.runner.ensureFile(ROUTES.javascript);
  });

})();
