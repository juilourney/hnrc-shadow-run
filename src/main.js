import { createTabbar }   from './components/tabbar.js';
import { createEdgeBlur } from './components/edge-blur.js';
import { goToScreen, syncTabbarOnScroll, isProgrammaticScroll } from './utils/nav.js';

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
import * as waiting    from './screens/waiting.js';

const INTRO    = [name, card, role, waiting];
const GAME     = [dash, bolt, vote, members, guide];
const OVERLAYS = [boltJoin, boltDetail, boltBuff, boltResult];

const app = document.getElementById('app');

// 인트로 화면 (innerHTML으로 한번에)
app.innerHTML = INTRO.map(s => s.render()).join('');

// 고정 배경 orb
const gameBg = document.createElement('div');
gameBg.id = 'game-bg';
gameBg.innerHTML = '<div class="game-orb-a"></div><div class="game-orb-b"></div>';
app.appendChild(gameBg);

// 게임 컨테이너
const gameWrap = document.createElement('div');
gameWrap.id = 's-game';
gameWrap.className = 'game-wrap';
gameWrap.innerHTML = GAME.map(s => s.render()).join('');
app.appendChild(gameWrap);

// 오버레이 화면
OVERLAYS.forEach(s => {
  const tmp = document.createElement('div');
  tmp.innerHTML = s.render();
  app.appendChild(tmp.firstElementChild);
});

[...INTRO, ...GAME, ...OVERLAYS].forEach(s => s.init());

createTabbar(app);
createEdgeBlur(app);

// 수동 스크롤 시 탭 동기화
const SECTION_IDS = ['gs-dash', 'gs-bolt', 'gs-vote', 'gs-members', 'gs-guide'];
const gameObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !isProgrammaticScroll()) {
      syncTabbarOnScroll(entry.target.id);
    }
  });
}, { root: null, threshold: 0.5 });

SECTION_IDS.forEach(id => {
  const el = document.getElementById(id);
  if (el) gameObserver.observe(el);
});

// 개발: 인트로 스킵 — 게임 화면 바로 진입
goToScreen('s-game');
