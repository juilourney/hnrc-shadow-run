// 스마트 스냅 — 1화면 섹션은 제목에 딱 붙고(firm), 뷰포트보다 긴 섹션은
// 중간은 자유 스크롤·위아래 경계 근처에서만 스냅. 문서(body) 자연 스크롤 기반.
const IDS = ['gs-dash', 'gs-bolt', 'gs-vote', 'gs-members', 'gs-guide'];

export function initSmartSnap() {
  let settleTimer = null;
  let programmatic = false;

  function snap() {
    if (programmatic) return;
    const vh   = window.innerHeight;
    const y    = window.scrollY;
    const secs = IDS.map(id => document.getElementById(id)).filter(Boolean);
    if (!secs.length) return;

    // 뷰포트 상단을 차지한 섹션 (중점 기준 반올림)
    let cur = secs[0], idx = 0;
    secs.forEach((s, i) => { if (y >= s.offsetTop - vh * 0.5) { cur = s; idx = i; } });

    const top  = cur.offsetTop;
    const h    = cur.offsetHeight;
    const next = secs[idx + 1];
    let target;

    if (h <= vh * 1.2) {
      target = top;                       // 1화면 섹션 → 항상 제목에 스냅
    } else {
      const into = y - top;               // 긴 섹션
      if (into < vh * 0.4)                         target = top;            // 위 경계 근처
      else if (next && next.offsetTop - (y + vh) < vh * 0.4) target = next.offsetTop; // 아래 경계 근처
      else                                          target = null;          // 중간 → 자유
    }

    if (target != null && Math.abs(target - y) > 2) {
      programmatic = true;
      window.scrollTo({ top: target, behavior: 'smooth' });
      setTimeout(() => { programmatic = false; }, 500);
    }
  }

  window.addEventListener('scroll', () => {
    if (programmatic) return;
    clearTimeout(settleTimer);
    settleTimer = setTimeout(snap, 130);  // 스크롤이 멈춘 뒤 안착
  }, { passive: true });
}
