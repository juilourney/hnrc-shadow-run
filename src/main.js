import { goToScreen, syncTabbar } from './utils/nav.js';
import { loadState, state } from './state.js';
import { applyTeamTheme } from './utils/theme.js';
import { render as renderName, init as initName }               from './screens/name.js';
import { render as renderCard, init as initCard, prepareCard }  from './screens/card.js';
import { render as renderRole, init as initRole, prepareRoleScreen } from './screens/role.js';
import { render as renderDash, init as initDash }               from './screens/dash.js';
import { render as renderBolt, init as initBolt }               from './screens/bolt.js';
import { render as renderBoltJoin, init as initBoltJoin }       from './screens/bolt-join.js';
import { render as renderBoltDetail, init as initBoltDetail }   from './screens/bolt-detail.js';
import { render as renderBoltBuff, init as initBoltBuff }       from './screens/bolt-buff.js';
import { render as renderBoltResult, init as initBoltResult }   from './screens/bolt-result.js';
import { render as renderVote, init as initVote }               from './screens/vote.js';
import { render as renderMembers, init as initMembers }         from './screens/members.js';
import { render as renderGuide, init as initGuide }             from './screens/guide.js';
import { render as renderSettings, init as initSettings }       from './screens/settings.js';
import { render as renderWaiting, init as initWaiting, prepareWaiting } from './screens/waiting.js';

document.getElementById('app').innerHTML =
  renderName() +
  renderCard() +
  renderRole() +
  renderDash() +
  renderBolt() +
  renderBoltJoin() +
  renderBoltDetail() +
  renderBoltBuff() +
  renderBoltResult() +
  renderVote() +
  renderMembers() +
  renderGuide() +
  renderSettings() +
  renderWaiting();

initName();
initCard();
initRole();
initDash();
initBolt();
initBoltJoin();
initBoltDetail();
initBoltBuff();
initBoltResult();
initVote();
initMembers();
initGuide();
initSettings();
initWaiting();

// 전역 탭바 — 단일 요소, 화면 전환 시 고정
const tabbarEl = document.createElement('div');
tabbarEl.id = 'global-tabbar';
tabbarEl.className = 'tabbar';
tabbarEl.style.cssText = 'display:none;';
tabbarEl.innerHTML = `
  <div class="tab" data-tab="home"><div class="tab-icon"><span class="ti-home-dot"></span></div><span>홈</span></div>
  <div class="tab" data-tab="bolt"><div class="tab-icon"><span class="ti-bolt"></span></div><span>번개</span></div>
  <div class="tab" data-tab="vote"><div class="tab-icon"><span class="ti-vote"></span></div><span>투표</span></div>
  <div class="tab" data-tab="members"><div class="tab-icon"><span class="ti-users"></span></div><span>참가자</span></div>
  <div class="tab" data-tab="guide"><div class="tab-icon"><span class="ti-book"></span></div><span>가이드</span></div>
`;
const TAB_SCREEN_MAP = { home: 's-dash', bolt: 's-bolt', vote: 's-vote', members: 's-members', guide: 's-guide' };
tabbarEl.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => goToScreen(TAB_SCREEN_MAP[tab.dataset.tab]));
});
document.getElementById('app').appendChild(tabbarEl);

// 저장된 상태 복원 — 새로고침 시 이미 배정된 팀·역할 유지
if (loadState()) {
  applyTeamTheme(state.team);
  if (state.roleConfirmed) {
    // 역할까지 확인 완료 → 대기 화면
    prepareWaiting();
    goToScreen('s-waiting');
  } else if (state.roleFlipped) {
    // 역할 공개됐지만 시작하기 미클릭 → 역할 화면 (이미 뒤집힌 상태)
    prepareRoleScreen();
    goToScreen('s-role');
  } else if (state.cardFlipped) {
    // 팀만 공개 → 역할 배정 화면으로
    prepareRoleScreen();
    goToScreen('s-role');
  } else {
    // 이름·팀·역할 배정됐지만 카드 미공개 → 카드 화면
    prepareCard();
    goToScreen('s-card');
  }
}
