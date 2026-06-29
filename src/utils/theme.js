export function applyTeamTheme(team) {
  const app = document.getElementById('app');
  app.setAttribute('data-team', team);
  const meta = document.getElementById('theme-color-meta');
  let bg;
  if (team === 'pacer') {
    bg = '#030c14';
    meta.content = bg;
    app.classList.remove('mesh-ghost');
    app.classList.add('mesh-pacer');
  } else {
    bg = '#0a0310';
    meta.content = bg;
    app.classList.remove('mesh-pacer');
    app.classList.add('mesh-ghost');
  }
  // body·html 배경도 동기화 → Home Indicator 영역까지 팀 컬러로 채움
  document.documentElement.style.background = bg;
  document.body.style.background = bg;
}
