document.querySelectorAll('.dropdown .dropbtn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const dd = btn.closest('.dropdown');
    const expanded = dd.classList.toggle('open');
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });
});

// Cerrar si haces clic fuera
document.addEventListener('click', (e) => {
  document.querySelectorAll('.dropdown.open').forEach(dd => {
    if (!dd.contains(e.target)) {
      dd.classList.remove('open');
      const btn = dd.querySelector('.dropbtn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });
});

// (Opcional) cerrar con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.dropdown.open').forEach(dd => {
      dd.classList.remove('open');
      const btn = dd.querySelector('.dropbtn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }
});
