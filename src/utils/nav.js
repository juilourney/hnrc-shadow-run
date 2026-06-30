let currentScreen = 's-name';

const SECTION_TAB = {
  'gs-dash': 'home', 'gs-bolt': 'bolt', 'gs-vote': 'vote',
  'gs-members': 'members', 'gs-guide': 'guide', 'gs-settings': 'guide',
};

export function goToScreen(id) {
  // 게임 섹션(gs-*)은 스크롤 네비게이션으로 위임
  if (id.startsWith('gs-')) { scrollToSection(id); return; }

  const prev = document.getElementById(currentScreen);
  const next = document.getElementById(id);
  if (!next || id === currentScreen) return;

  prev.classList.remove('active');
  prev.classList.add('exit-left');
  setTimeout(() => prev.classList.remove('exit-left'), 500);

  next.classList.add('active');
  currentScreen = id;

  const tb     = document.getElementById('global-tabbar');
  const handle = document.getElementById('tabbar-handle');
  if (!tb) return;
  tb.classList.remove('open');
  if (handle) handle.classList.remove('hidden');

  if (id === 's-game') {
    tb.style.display = 'flex';
    if (handle) handle.style.display = 'flex';
    setActiveTab('home');
  } else {
    tb.style.display = 'none';
    if (handle) handle.style.display = 'none';
  }
}

export function scrollToSection(gsId) {
  const gameWrap = document.getElementById('s-game');
  const enter = !gameWrap.classList.contains('active');

  if (enter) {
    goToScreen('s-game');
    // 트랜지션 뒤 즉시 해당 섹션으로 점프
    setTimeout(() => {
      document.getElementById(gsId)?.scrollIntoView({ behavior: 'instant' });
      setActiveTab(SECTION_TAB[gsId] || 'home');
    }, 60);
  } else {
    document.getElementById(gsId)?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab(SECTION_TAB[gsId] || 'home');
  }
}

export function setActiveTab(tabName) {
  const tb = document.getElementById('global-tabbar');
  if (!tb) return;
  tb.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  tb.querySelector(`[data-tab="${tabName}"]`)?.classList.add('on');
}

// IntersectionObserver 콜백용 — main.js에서 연결
export function syncTabbarOnScroll(gsId) {
  setActiveTab(SECTION_TAB[gsId] || 'home');
}
