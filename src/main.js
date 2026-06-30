import { createTabbar } from './components/tabbar.js';
import { createEdgeBlur } from './components/edge-blur.js';
import { syncTabbarOnScroll } from './utils/nav.js';

import * as name       from './screens/name.js';
import * as card       from './screens/card.js';
import * as role       from './screens/role.js';
import * as dash       from './screens/dash.js';
import * as bolt       from './screens/bolt.js';
import * as boltJoin   from './screens/bolt-join.js';
import * as boltDetail from './screens/bolt-detail.js';
import * as boltBuff   from './screens/bolt-buff.js';
import * as boltResult from './screens/bolt-result.js';
import * as vote       from './screens/vote.js';
import * as members    from './screens/members.js';
import * as guide      from './screens/guide.js';
import * as settings   from './screens/settings.js';
import * as waiting    from './screens/waiting.js';

// 인트로 화면 (fixed 슬라이드 전환)
const INTRO = [name, card, role, waiting];

// 게임 섹션 (세로 scroll-snap 풀스크린)
const GAME = [dash, bolt, vote, members, guide, settings];

// 볼트 오버레이 화면 (고정 레이어)
const OVERLAYS = [boltJoin, boltDetail, boltBuff, boltResult];

const app = document.getElementById('app');

// 인트로 화면 마운트
app.innerHTML = INTRO.map(s => s.render()).join('');

// 게임 컨테이너 (s-game) — GAME 섹션들을 하나의 scroll-snap 래퍼로 묶음
const gameWrap = document.createElement('div');
gameWrap.id = 's-game';
gameWrap.className = 'screen game-wrap';
gameWrap.innerHTML = GAME.map(s => s.render()).join('');
app.appendChild(gameWrap);

// 오버레이 화면 마운트 (게임 컨테이너 위에 쌓임)
OVERLAYS.forEach(s => {
  const tmp = document.createElement('div');
  tmp.innerHTML = s.render();
  app.appendChild(tmp.firstElementChild);
});

// 전체 초기화
[...INTRO, ...GAME, ...OVERLAYS].forEach(s => s.init());

createTabbar(app);
createEdgeBlur(app);

// 수동 스크롤 시 탭바 활성 탭 동기화
const SECTION_IDS = ['gs-dash', 'gs-bolt', 'gs-vote', 'gs-members', 'gs-guide', 'gs-settings'];
const gameObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
      syncTabbarOnScroll(entry.target.id);
    }
  });
}, { root: gameWrap, threshold: 0.5 });

SECTION_IDS.forEach(id => {
  const el = document.getElementById(id);
  if (el) gameObserver.observe(el);
});
