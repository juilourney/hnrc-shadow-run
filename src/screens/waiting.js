import { state, ROLES } from '../state.js';
import { goToScreen } from '../utils/nav.js';

// 관리자가 설정할 게임 시작 일시 — 추후 Firebase 연동
// 현재는 하드코딩된 목표 시각 사용
let GAME_START_TIME = new Date();
GAME_START_TIME.setHours(GAME_START_TIME.getHours() + 1, 0, 0, 0); // 기본: 1시간 후

export function setGameStartTime(date) {
  GAME_START_TIME = date;
}

function section(emoji, title, content) {
  return `
  <div class="bezel" style="padding:18px; border-radius:20px; margin-bottom:10px;">
    <div style="display:flex; align-items:center; gap:9px; margin-bottom:12px;">
      <span style="font-size:16px; line-height:1;">${emoji}</span>
      <h3 style="font-size:14px; font-weight:700; letter-spacing:-.01em;">${title}</h3>
    </div>
    ${content}
  </div>`;
}

function row(label, value, color = '#a1a1aa') {
  return `
  <div style="display:flex; gap:12px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,.05);">
    <p style="font-size:12px; font-weight:600; color:#e4e4e7; width:80px; flex-shrink:0; line-height:1.5;">${label}</p>
    <p style="font-size:12px; color:${color}; line-height:1.6; flex:1;">${value}</p>
  </div>`;
}

function roleRow(role, ability, desc) {
  return `
  <div style="padding:8px 0; border-bottom:1px solid rgba(255,255,255,.05);">
    <p style="font-size:13px; font-weight:700; color:#e4e4e7; margin-bottom:3px;">${role}</p>
    <p style="font-size:12px; color:#60a5fa; margin-bottom:2px;">${ability}</p>
    <p style="font-size:12px; color:#71717a; line-height:1.5;">${desc}</p>
  </div>`;
}

export function render() {
  return `
<div class="screen" id="s-waiting" style="background:#050505; overflow:hidden;">

  <div style="position:absolute; inset:0; pointer-events:none; overflow:hidden;">
    <div style="position:absolute; top:-10%; right:-20%; width:60%; aspect-ratio:1;
      border-radius:50%; background:radial-gradient(circle,var(--accent-glow) 0%,transparent 70%);
      filter:blur(50px); opacity:.35;"></div>
  </div>

  <div class="scroll-body" style="position:relative; z-index:2;
    padding:calc(var(--safe-top) + 16px) 18px calc(var(--safe-bottom) + 28px);">

    <!-- 헤더 -->
    <div class="anim-up" style="margin-bottom:20px;">
      <p style="font-size:11px; letter-spacing:.18em; text-transform:uppercase; font-weight:700;
        color:#3f3f46; margin-bottom:6px;">GAME READY</p>
      <h2 style="font-size:24px; font-weight:800; letter-spacing:-.02em; line-height:1.2;">
        게임 시작까지<br/>가이드를 읽어보세요
      </h2>
    </div>

    <!-- 카운트다운 + 내 정보 -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
      <div class="bezel" style="padding:16px; border-radius:20px; text-align:center;">
        <p style="font-size:10px; color:#52525b; font-weight:600; letter-spacing:.06em; margin-bottom:8px;">시작까지</p>
        <p class="num" id="waiting-timer"
          style="font-size:28px; font-weight:800; color:var(--accent); line-height:1; letter-spacing:-.02em;">00:00</p>
        <p style="font-size:10px; color:#52525b; margin-top:6px;">남음</p>
      </div>
      <div class="bezel-accent" style="padding:16px; border-radius:20px; display:flex; flex-direction:column; justify-content:center; gap:6px;">
        <span id="waiting-team-badge" class="chip"
          style="background:var(--accent-tint); color:var(--accent); font-size:10px; align-self:flex-start;"></span>
        <p id="waiting-role-name"
          style="font-size:18px; font-weight:800; letter-spacing:-.02em; color:var(--accent); line-height:1;"></p>
        <p id="waiting-role-short"
          style="font-size:11px; color:#71717a; line-height:1.4;"></p>
      </div>
    </div>

    <!-- 가이드 내용 -->
    ${section('🎯', '게임 개요 및 승리 조건', `
      <p style="font-size:12px; color:#a1a1aa; line-height:1.75; margin-bottom:8px;">페이서팀과 고스트팀이 3주 동안 번개(달리기)를 통해 마일리지를 쌓으며 중앙의 게이지를 자기 쪽으로 당기는 줄다리기 게임입니다.</p>
      ${row('페이서', '게이지를 오른쪽(+)으로 당깁니다', '#38bdf8')}
      ${row('고스트', '게이지를 왼쪽(-)으로 당깁니다', '#a78bfa')}
      ${row('승리', '3주 후 게이지가 더 기운 팀이 우승하며, 최고 기여자 표창이 수여됩니다', '#34d399')}
    `)}

    ${section('🎭', '팀 및 특수 역할', `
      <p style="font-size:12px; color:#a1a1aa; line-height:1.75; margin-bottom:8px;">각 팀에는 엘리트, 앵커, 더블, 탐정, 밀정이 하나씩 존재하며 정체는 팀원에게도 비공개입니다.</p>
      ${roleRow('👑 엘리트', '번개 마일리지 2배 적립', '팀의 핵심 마일리지 기여자. 투표로 적발되면 마일리지가 0.5배로 급감합니다.')}
      ${roleRow('⚓ 앵커', '달린 만큼 상대팀 마일리지 즉시 삭감', '줄다리기 기간(목~토)에 능력이 2배로 중첩됩니다.')}
      ${roleRow('×2 더블', '투표 시 2표 행사', '같은 사람에게 2표 모두 사용할 수 있습니다.')}
      ${roleRow('🔍 탐정', '누군가의 팀 확인 (3회)', '[참가자 탭]에서 아군인지 적군인지 은밀히 판별합니다.')}
      ${roleRow('🕵️ 밀정', '누군가의 역할 확인 (3회)', '[참가자 탭]에서 상대의 구체적인 역할을 파악합니다.')}
    `)}

    ${section('📅', '주간 운영 체계', `
      <div style="display:flex; flex-direction:column; gap:8px;">
        <div style="background:rgba(255,255,255,.04); border-radius:12px; padding:12px 14px;">
          <p style="font-size:11px; font-weight:700; color:#a1a1aa; letter-spacing:.04em; margin-bottom:4px;">탐색 기간 · 일 ~ 수</p>
          <p style="font-size:12px; color:#e4e4e7; line-height:1.6;">달린 마일리지가 1:1로 게이지에 반영됩니다. 아군을 탐색하고 정보를 수집하세요.</p>
        </div>
        <div style="background:rgba(255,255,255,.04); border-radius:12px; padding:12px 14px;">
          <p style="font-size:11px; font-weight:700; color:#a1a1aa; letter-spacing:.04em; margin-bottom:4px;">줄다리기 기간 · 목 ~ 토</p>
          <p style="font-size:12px; color:#e4e4e7; line-height:1.6;">달린 만큼 상대팀 게이지에서 직접 삭감합니다. 본격적인 승부를 벌이는 시기입니다.</p>
        </div>
      </div>
    `)}

    ${section('⚡', '번개와 팀 고유 스킬', `
      ${row('단일팀 번개', '3~4명이 같은 팀일 때 팀 고유 스킬이 자동 발동됩니다.')}
      ${row("'페이서 시너지'", '참여 인원 × 50km의 마일리지를 추가 적립합니다.', '#38bdf8')}
      ${row("'고스트 게이지'", '상대팀 마일리지 삭감에 더해 게이지 바를 100km 즉시 이동시킵니다.', '#a78bfa')}
      ${row('일반 번개', '팀 혼합 시 스킬 없음. 랜덤 특수 버프 카드(최대 3배)가 발동할 수 있습니다.')}
    `)}

    ${section('🗳️', '투표 및 정체 공개', `
      ${row('일시', '주 2회 — 월요일, 목요일 18:00 ~ 22:00')}
      ${row('진행', '상대 팀으로 의심되는 플레이어 1명을 지목합니다.')}
      ${row('결과', '최다 득표자는 팀 소속이 공개되며, 마일리지가 영구적으로 50% 감소합니다.')}
    `)}

    <!-- 전략 팁 -->
    <div style="background:rgba(56,189,248,.06); border:1px solid rgba(56,189,248,.15);
      border-radius:18px; padding:16px 18px; margin-bottom:20px;">
      <p style="font-size:11px; font-weight:700; color:var(--accent); margin-bottom:6px;
        letter-spacing:.06em; text-transform:uppercase;">전략 팁</p>
      <p style="font-size:12px; color:#a1a1aa; line-height:1.75;">탐색 기간에는 아군을 찾아 세력을 확보하고, 줄다리기 기간에는 고유 스킬과 앵커의 능력을 총동원해 게이지를 뺏어오세요. 투표를 통해 상대팀의 엘리트를 찾아내는 것이 역전의 발판입니다.</p>
    </div>

    <!-- 관리자가 게임 시작하면 이 버튼이 활성화됨 (현재는 시뮬레이션) -->
    <button id="waiting-start-sim" class="btn btn-secondary"
      style="width:100%; height:48px; font-size:13px; color:#52525b; margin-bottom:8px;">
      게임 시작 (시뮬레이션)
    </button>

  </div>
</div>`;
}

export function init() {
  document.getElementById('waiting-start-sim').addEventListener('click', () => {
    goToScreen('s-dash');
  });
}

export function prepareWaiting() {
  const r = ROLES[state.role];
  const teamName = state.team === 'pacer' ? '페이서팀' : '고스트팀';
  document.getElementById('waiting-team-badge').textContent = teamName;
  document.getElementById('waiting-role-name').textContent = r.name;
  document.getElementById('waiting-role-short').textContent = r.short;
  startCountdown();
}

let countdownInterval = null;

function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  const el = document.getElementById('waiting-timer');

  function tick() {
    const diff = GAME_START_TIME - new Date();
    if (diff <= 0) {
      el.textContent = '00:00';
      clearInterval(countdownInterval);
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (h > 0) {
      el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    } else {
      el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
  }
  tick();
  countdownInterval = setInterval(tick, 1000);
}
