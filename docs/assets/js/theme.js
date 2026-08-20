/* Theme switcher for the demo pages. A click flips the skin right away; with
   the View Transitions API the change sweeps in from the switcher's corner
   (CSS in app.css), otherwise .theme-morph transitions the colours for half a
   second. Pages stay put and get a `themechange` event on window, which the
   canvas code uses to re-read the palette.

   Two attributes, not one: data-skin carries what the user picked (light, dark,
   grey), data-theme only its polarity (light or dark). Grey is a dark skin, so
   it inherits Pico's dark block and the dark ladder and overrides from there. */
(function () {
  'use strict';
  var el = document.documentElement;
  var POLARITY = { light: 'light', dark: 'dark', grey: 'dark' };
  var cur = el.dataset.skin || el.dataset.theme, def = el.dataset.themeDefault || 'grey';
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var segs = document.querySelectorAll('.theme-seg');
  var mark = function (v) {
    segs.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-theme-set') === v); });
  };
  mark(cur);
  segs.forEach(function (btn) {
    btn.onclick = function () {
      var v = btn.getAttribute('data-theme-set');
      if (v === cur) return;
      try { localStorage.setItem('theme', v); } catch (e) {}
      var url = new URL(location.href);
      if (v === def) url.searchParams.delete('theme'); else url.searchParams.set('theme', v);
      history.replaceState(null, '', url.href);
      var apply = function () {
        el.dataset.skin = v;
        el.dataset.theme = POLARITY[v] || 'dark';
        el.style.colorScheme = el.dataset.theme;
        cur = v;
        mark(v);
      };
      if (!still && document.startViewTransition) {
        document.startViewTransition(function () {
          apply();
          window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: v } }));
        });
      } else {
        if (!still) el.classList.add('theme-morph');
        apply();
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: v } }));
        setTimeout(function () { el.classList.remove('theme-morph'); }, 600);
      }
    };
  });
})();
