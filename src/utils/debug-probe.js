// DEBUG PROBE — safe area diagnosis. Remove this file and its import in main.js after diagnosis.
export function mountDebugProbe() {
  const el = document.createElement('div');
  el.style.cssText = [
    'position:fixed', 'top:90px', 'left:8px', 'z-index:9999',
    'background:rgba(255,220,0,0.92)', 'color:#000',
    'font:10px/1.5 monospace', 'padding:5px 7px', 'border-radius:6px',
    'pointer-events:none', 'white-space:pre', 'max-width:calc(100% - 16px)',
    'word-break:break-all',
  ].join(';');
  document.body.appendChild(el);

  function update() {
    const safeB = getComputedStyle(document.documentElement)
      .getPropertyValue('--safe-bottom').trim();
    const tb   = document.getElementById('global-tabbar');
    const fill = document.getElementById('tabbar-safe-fill');
    const tbRect = tb ? Math.round(tb.getBoundingClientRect().bottom) : '?';
    const fillH  = fill ? (fill.style.height || getComputedStyle(fill).height) : '?';
    const vvH    = window.visualViewport ? Math.round(window.visualViewport.height) : 'N/A';

    el.textContent = [
      `env(safe-b): ${safeB}`,
      `innerH:      ${window.innerHeight}px`,
      `vv.height:   ${vvH}px`,
      `tb.bottom:   ${tbRect}px`,
      `fill.height: ${fillH}`,
      `screen.h:    ${window.screen.height}px`,
    ].join('\n');
  }

  update();
  setInterval(update, 800);
  window.visualViewport?.addEventListener('resize', update);
}
