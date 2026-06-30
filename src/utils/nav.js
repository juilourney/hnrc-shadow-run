let currentScreen = 's-name';

const SECTION_TAB = {
  'gs-dash': 'home', 'gs-bolt': 'bolt', 'gs-vote': 'vote',
  'gs-members': 'members', 'gs-guide': 'guide',
};

export function goToScreen(id) {
  if (id.startsWith('gs-')) { scrollToSection(id); return; }

  const prev = document.getElementById(currentScreen);
  const next = document.getElementById(id);
  if (!next || id === currentScreen) return;

  if (prev) {
    prev.classList.remove('active');
    prev.classList.add('exit-left');
    setTimeout(() => prev.classList.remove('exit-left'), 500);
  }
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
  const enter    = !gameWrap.classList.contains('active');

  if (enter) {
    goToScreen('s-game');
    setTimeout(() => {
      document.getElementById(gsId)?.scrollIntoView({ block: 'start' });
      setActiveTab(SECTION_TAB[gsId] || 'home');
    }, 60);
  } else {
    document.getElementById(gsId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab(SECTION_TAB[gsId] || 'home');
  }
}

export function setActiveTab(tabName) {
  const tb = document.getElementById('global-tabbar');
  if (!tb) return;
  tb.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  tb.querySelector(`[data-tab="${tabName}"]`)?.classList.add('on');
}

export function syncTabbarOnScroll(gsId) {
  setActiveTab(SECTION_TAB[gsId] || 'home');
}
