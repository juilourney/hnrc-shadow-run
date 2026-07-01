import { scrollToSection } from '../utils/nav.js';

const TAB_SECTION_MAP = { home: 'gs-dash', bolt: 'gs-bolt', vote: 'gs-vote', members: 'gs-members', guide: 'gs-guide' };

const TAB_MARKUP = `
  <div class="tab" data-tab="home"><div class="tab-icon"><span class="ti-home-dot"></span></div></div>
  <div class="tab" data-tab="bolt"><div class="tab-icon"><span class="ti-bolt"></span></div></div>
  <div class="tab" data-tab="vote"><div class="tab-icon"><span class="ti-vote"></span></div></div>
  <div class="tab" data-tab="members"><div class="tab-icon"><span class="ti-users"></span></div></div>
  <div class="tab" data-tab="guide"><div class="tab-icon"><span class="ti-book"></span></div></div>
`;

export function createTabbar(mount) {
  const tabbar = document.createElement('div');
  tabbar.id = 'global-tabbar';
  tabbar.className = 'tabbar';
  tabbar.style.display = 'none';
  tabbar.innerHTML = TAB_MARKUP;
  mount.appendChild(tabbar);

  // 볼록한 손잡이 — 평소엔 이것만 보이고, 누르면 탭바가 나옴
  const handle = document.createElement('div');
  handle.id = 'tabbar-handle';
  handle.style.display = 'none';
  handle.innerHTML = '<span class="handle-grip"></span>';
  mount.appendChild(handle);

  // 아무 입력 없으면 자동으로 닫힘
  const IDLE_MS = 3200;
  let idleTimer = null;
  const armIdle = () => {
    clearTimeout(idleTimer);
    if (tabbar.classList.contains('open')) idleTimer = setTimeout(close, IDLE_MS);
  };

  const open  = () => { tabbar.classList.add('open');    handle.classList.add('hidden'); armIdle(); };
  const close = () => { tabbar.classList.remove('open'); handle.classList.remove('hidden'); clearTimeout(idleTimer); };

  // 손잡이 터치 → 탭바 펼침
  handle.addEventListener('click', e => { e.stopPropagation(); open(); });

  // 열린 상태에서 탭바를 만지면 idle 타이머 리셋 (조작 중엔 안 닫힘)
  tabbar.addEventListener('pointerdown', armIdle);

  // 탭 선택 → 화면 이동 즉시, 사이드바는 850ms 후 닫힘
  tabbar.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', e => {
      e.stopPropagation();
      scrollToSection(TAB_SECTION_MAP[tab.dataset.tab]);
      setTimeout(close, 1800);
    });
  });

  // 바깥 터치 → 닫힘
  document.addEventListener('click', e => {
    if (tabbar.classList.contains('open') && !tabbar.contains(e.target) && e.target !== handle) {
      close();
    }
  });

  // 손가락으로 위아래 스크롤하는 순간 닫힘 (탭 이동의 자동 스크롤은 touchmove/wheel을 안 일으켜 제외됨)
  const closeOnUserScroll = () => { if (tabbar.classList.contains('open')) close(); };
  window.addEventListener('touchmove', closeOnUserScroll, { passive: true });
  window.addEventListener('wheel',     closeOnUserScroll, { passive: true });

  return tabbar;
}
