# Shadow Run — 디자인 스킬 정리

---

## 1. 폰트

| 용도 | 패밀리 | 비고 |
|------|--------|------|
| 디스플레이 / 숫자 | Space Grotesk | 대형 타이틀, 팀명, 게이지 수치 |
| 본문 / UI | Pretendard | 모든 설명 텍스트, 버튼, 인풋 |

```css
font-family: 'Pretendard', system-ui, sans-serif;
font-family: 'Space Grotesk', sans-serif;
```

**타입 유틸**
- `.eyebrow` — `font-size: 11px; letter-spacing: .18em; text-transform: uppercase; font-weight: 600`
- `.num` — `font-family: 'Space Grotesk'; font-feature-settings: 'tnum'` (고정폭 숫자)

---

## 2. 컬러 토큰

```css
/* tokens.css */
--ink: #050505;           /* 앱 배경 */
--spring: cubic-bezier(0.16, 1, 0.3, 1);  /* 공용 이징 */

/* 팀 어센트 (data-team 속성으로 자동 전환) */
--accent:        팀 메인 색
--accent-deep:   팀 딥 색 (그라디언트 끝)
--accent-glow:   rgba glow용 (그림자, 버튼 후광)
--accent-tint:   rgba 배경용 (활성 탭, 포커스 링)
--accent-border: rgba 테두리용

--danger: #fb7185;
--safe-top:    env(safe-area-inset-top, 0px);
--safe-bottom: env(safe-area-inset-bottom, 0px);
```

**팀 테마 — `data-team` 속성 하나로 전체 어센트 교체**
```js
document.body.dataset.team = 'pacer'; // or 'ghost'
```
```css
[data-team="pacer"] { --accent: #38bdf8; --accent-deep: #0ea5e9; ... }
[data-team="ghost"] { --accent: #c084fc; --accent-deep: #a855f7; ... }
```

---

## 3. iOS PWA 풀스크린 세팅

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0,
  maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="theme-color" content="#050505">
```

```css
html { overflow: hidden; height: 100%; }
body { overflow: hidden; height: 100%; }

/* 화면 시스템 — 각 .screen이 직접 fixed */
.screen {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  max-width: 430px; margin: 0 auto;
}

/* 상단 safe area 패딩 */
.pt-safe { padding-top: calc(var(--safe-top) + 54px); }

/* 하단 — 0으로 두면 콘텐츠가 인디케이터 뒤로 자연스럽게 흘러감 */
.pb-tab { padding-bottom: 0; }
```

> **핵심**: 홈 인디케이터 영역(~34px)은 CSS로 제거 불가. `padding-bottom: 0`으로 콘텐츠가 그 영역을 통과하게 하는 게 최선.

---

## 4. 레이아웃 시스템

```css
/* 스크롤 컨테이너 */
.scroll-body {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
.scroll-body::-webkit-scrollbar { display: none; }
```

**화면 전환 (nav.js 패턴)**
```css
.screen          { opacity: 0; transform: translateX(32px); }
.screen.active   { opacity: 1; transform: none; }
.screen.exit-left{ opacity: 0; transform: translateX(-24px); }
transition: opacity .35s var(--spring), transform .45s var(--spring);
```

---

## 5. 배경 — 오브 + 노이즈

**앰비언트 오브 (CSS mesh)**
```css
.mesh-pacer {
  background:
    radial-gradient(60% 45% at 15% 5%, rgba(56,189,248,.14), transparent 55%),
    radial-gradient(50% 50% at 90% -5%, rgba(125,211,252,.07), transparent 50%),
    radial-gradient(70% 60% at 50% 100%, rgba(14,165,233,.06), transparent 60%);
}
.mesh-ghost { /* 보라 계열 동일 구조 */ }
.mesh-neutral { /* 회색 단일 오브 */ }
```

**움직이는 오브 (JS 인라인 스타일 + keyframe)**
```css
@keyframes orb-drift-a {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(12%, 14%) scale(1.12); }
}
/* filter: blur(42~52px) + animation: 13~15s ease-in-out infinite alternate */
```

**노이즈 그레인 레이어**
```css
body::after {
  content: '';
  position: fixed; inset: 0; z-index: 999;
  pointer-events: none; opacity: .028;
  background-image: url("data:image/svg+xml, ... feTurbulence fractalNoise ...");
}
```

---

## 6. 카드 & 서피스

```css
/* 유리 느낌 카드 */
.bezel {
  background: rgba(255,255,255,.045);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 20px;
}

/* 어센트 강조 카드 */
.bezel-accent {
  background: var(--accent-tint);
  border: 1px solid var(--accent-border);
  box-shadow: 0 0 40px -15px var(--accent-glow);
}

/* 구분선 */
.div-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.09), transparent);
}
```

---

## 7. 게이지 바

```css
.gauge-wrap {
  position: relative; height: 14px; border-radius: 99px;
  background: rgba(255,255,255,.06);
  box-shadow: inset 0 1px 2px rgba(0,0,0,.6);
  overflow: hidden;
}
.gauge-bar {
  position: absolute; left: 50%; top: 0; bottom: 0;
  background: linear-gradient(90deg, var(--accent-deep), var(--accent));
  box-shadow: 0 0 16px var(--accent-glow);
  transition: width .8s var(--spring);
}
.gauge-center { /* 중앙 흰 세로선 */ }
```

---

## 8. 카드 플립 애니메이션

**특징**: 단순 180° 뒤집기 대신 7.5회전 + 가속/감속 + 살짝 역방향 당김(스프링감)

```css
@keyframes card-spin-reveal {
  0%   { transform: rotateY(0deg); }
  42%  { transform: rotateY(1980deg); }  /* 최고속 */
  84%  { transform: rotateY(2640deg); }  /* 거의 멈춤 — 긴장 */
  91%  { transform: rotateY(2638deg); }  /* 역방향 당김 */
  100% { transform: rotateY(2700deg); }  /* 7.5회전 = 뒷면 정면 */
}
.flip-inner.spinning { animation: card-spin-reveal 3.5s linear forwards; }
.flip-inner.flipped  { transform: rotateY(1260deg); } /* 3.5회전 = 뒷면 */
```

```js
// 핵심 패턴: 애니메이션 끝난 뒤에 뒷면 콘텐츠 채우기
inner.addEventListener('animationend', () => {
  inner.classList.add('flipped');
  // 여기서 카드 색상/텍스트 주입
}, { once: true });
```

---

## 9. 버튼

```css
.btn { border-radius: 16px; transition: transform .4s var(--spring); }
.btn:active { transform: scale(.96); }
.btn-primary {
  background: linear-gradient(180deg, var(--accent), var(--accent-deep));
  box-shadow: 0 10px 30px -8px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,.35);
}
.btn-secondary {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.09);
}
```

---

## 10. 인풋

```css
.input {
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 16px;
  transition: border-color .3s, box-shadow .3s;
}
.input:focus {
  border-color: var(--accent-border);
  box-shadow: 0 0 0 3px var(--accent-tint);
}
```

---

## 11. 바텀 시트

```css
.overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(5,5,5,.7); backdrop-filter: blur(12px);
  display: flex; align-items: flex-end;
  opacity: 0; transition: opacity .35s;
}
.sheet {
  background: #0f0f10; border-radius: 28px 28px 0 0;
  transform: translateY(100%); transition: transform .5s var(--spring);
}
.overlay.show .sheet { transform: translateY(0); }
```

---

## 12. 사이드 탭바 (글라스)

오른쪽 화면 바깥에 숨어 있고, 손잡이를 누르면 스프링으로 등장.

```css
.tabbar {
  position: fixed; right: var(--app-right); top: 50%;
  width: 52px; height: 228px; border-radius: 26px;
  backdrop-filter: blur(32px) saturate(200%) brightness(1.08);
  transform: translateY(-50%) translateX(110%); /* 기본: 숨김 */
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tabbar.open { transform: translateY(-50%) translateX(-8px); }

/* 데스크톱/모바일 모두 정확히 정렬 */
--app-right: max(0px, calc((100vw - 430px) / 2));
```

**손잡이** — 반-캡슐 모양 (`border-radius: 40px 0 0 40px`), 꺾쇠`‹` 힌트 아이콘 포함

**탭 아이콘** — SVG 없이 CSS만으로 구현 (`.ti-bolt`, `.ti-vote`, `.ti-users` 등)

---

## 13. 애니메이션 유틸 클래스

```css
.anim-up   { animation: fadeUp .6s var(--spring) both; }
.anim-up-1 { animation: fadeUp .6s .08s var(--spring) both; }
/* ... .anim-up-4 까지 */

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); filter: blur(4px); }
  to   { opacity: 1; transform: none; filter: none; }
}
.float { animation: float 6s ease-in-out infinite; }
```

---

## 14. 하단 엣지 블러

스크롤 콘텐츠 하단을 자연스럽게 페이드 아웃.

```css
.bottom-fade-blur {
  position: fixed; bottom: calc(-1 * env(safe-area-inset-bottom, 0px));
  height: calc(24px + env(safe-area-inset-bottom, 0px));
  backdrop-filter: blur(16px);
  -webkit-mask-image: linear-gradient(to top, black 0%, black var(--safe-bottom), transparent 100%);
}
```
