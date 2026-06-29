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
    const cs = getComputedStyle(document.documentElement);
    const safeB = cs.getPropertyValue('--safe-bottom').trim();
    const app = document.getElementById('app');
    const appRect = app ? app.getBoundingClientRect() : {};
    const htmlH = document.documentElement.clientHeight;
    const bodyH = document.body.clientHeight;
    const vvH = window.visualViewport ? Math.round(window.visualViewport.height) : 'N/A';

    el.textContent = [
      `safe-bottom: ${safeB}`,
      `innerH:      ${window.innerHeight}px`,
      `screen.h:    ${window.screen.height}px`,
      `vv.height:   ${vvH}px`,
      `html.cliH:   ${htmlH}px`,
      `body.cliH:   ${bodyH}px`,
      `#app.top:    ${Math.round(appRect.top)}px`,
      `#app.bottom: ${Math.round(appRect.bottom)}px`,
      `#app.height: ${Math.round(appRect.height)}px`,
      `gap:         ${window.innerHeight - Math.round(appRect.bottom)}px`,
    ].join('\n');
  }

  update();
  setInterval(update, 800);
  window.visualViewport?.addEventListener('resize', update);
}
