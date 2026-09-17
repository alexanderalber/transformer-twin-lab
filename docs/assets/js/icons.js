/* icons.js -- the icon set for the transformer-twin-lab action buttons.
 *
 * ToolIcons.el(name, props)  -> a React element (needs React on the page)
 * ToolIcons.html(name, size) -> the same icon as an HTML string
 * ToolIcons.names()          -> the available names
 *
 * Ported from alber.me/assets/js/icons.js, path data verbatim. Only the glyphs
 * this project actually uses are carried over: the full set there is seventeen,
 * and an unused icon is a thing that can drift from its source without anyone
 * noticing. Adding one means copying its path data from there, not drawing it.
 *
 * WHY INLINE SVG AND NOT EMOJI
 * An emoji is a bitmap the operating system supplies: a different picture on
 * Windows, macOS, Android and Linux, in a fixed colour, at a fixed weight. It
 * ignores hover, it ignores the disabled state, and in the grey skin, which is
 * deliberately colourless with the outline carrying the whole hierarchy, it is
 * the only saturated object on the screen. These icons are stroked in
 * `currentColor`, so they simply are whatever colour the button's text is, in
 * every skin and every state, without one extra CSS rule.
 *
 * WHY A SHARED FILE
 * The alternative is the same path data pasted into each demo page, which is
 * how this repo ended up with three byte-identical copies of the tab strip.
 * The file is hosted here, so a page load still makes no external request and
 * the demos keep working from file:// on a conference laptop.
 *
 * THE CONVENTION
 * An icon goes on a button that performs an ACTION on something: run, export,
 * reset. Choices, filters, tabs and the segmented settings controls stay bare.
 * A row where every button has a picture is a wall of pictograms and the icon
 * stops carrying any signal at all.
 *
 * Geometry: a 24x24 viewBox, no fill, stroke-width 2, round caps and joins, so
 * the set reads as one family and matches the stroke weight of the demo UI.
 * Rendered at 14px inside .tool-btn, which supplies the gap.
 *
 * Plain script, no imports, nothing touched at module scope: it must run in the
 * page and under Node, where the self-tests can read the path data.
 */
(function (root) {
  'use strict';

  /* Each entry is the inner markup of the <svg>, nothing else. Keeping the
     wrapper out of the table is what lets el() and html() share one source. */
  var PATHS = {
    /* arrow into a tray: the near-universal download glyph */
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    /* a circular arrow, open at the top left where the arrowhead sits. Also
       the glyph for running a process over something that already exists, as
       on the moisture page's oil treatment: not a droplet, because the icon
       marks the ACTION and that page is already full of water. */
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
    play: '<path d="M6 4l13 8-13 8z"/>',
    pause: '<path d="M8 4v16"/><path d="M16 4v16"/>'
  };

  /* The attributes every icon shares. Spelled once, in both output forms. */
  var BASE = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  function names() { return Object.keys(PATHS); }

  function has(name) { return Object.prototype.hasOwnProperty.call(PATHS, name); }

  /* React element. dangerouslySetInnerHTML is the honest choice here: the path
     data is a literal in this file, never anything a user typed, and writing
     each <path> as createElement would triple the size of the table for no
     gain. props are merged last so a caller can override the size or add a
     className. */
  function el(name, props) {
    if (!has(name)) throw new Error('ToolIcons: unknown icon "' + name + '"');
    var R = root.React;
    if (!R) throw new Error('ToolIcons.el needs React on the page');
    var p = {
      width: 14,
      height: 14,
      viewBox: BASE.viewBox,
      fill: BASE.fill,
      stroke: BASE.stroke,
      strokeWidth: BASE.strokeWidth,
      strokeLinecap: BASE.strokeLinecap,
      strokeLinejoin: BASE.strokeLinejoin,
      'aria-hidden': 'true',
      focusable: 'false'
    };
    if (props) { for (var k in props) if (Object.prototype.hasOwnProperty.call(props, k)) p[k] = props[k]; }
    p.dangerouslySetInnerHTML = { __html: PATHS[name] };
    return R.createElement('svg', p);
  }

  /* HTML string, for the few places that build markup without React. */
  function htmlOf(name, size) {
    if (!has(name)) throw new Error('ToolIcons: unknown icon "' + name + '"');
    var s = size || 14;
    return '<svg width="' + s + '" height="' + s + '" viewBox="' + BASE.viewBox +
      '" fill="' + BASE.fill + '" stroke="' + BASE.stroke +
      '" stroke-width="' + BASE.strokeWidth +
      '" stroke-linecap="' + BASE.strokeLinecap +
      '" stroke-linejoin="' + BASE.strokeLinejoin +
      '" aria-hidden="true" focusable="false">' + PATHS[name] + '</svg>';
  }

  root.ToolIcons = { el: el, html: htmlOf, names: names, has: has, PATHS: PATHS, BASE: BASE };
})(typeof globalThis !== 'undefined' ? globalThis : this);
