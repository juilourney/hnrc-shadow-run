// 상·하단 엣지 블러 (콘텐츠가 시스템 바 밑으로 연장되는 느낌)
export function createEdgeBlur(mount) {
  const top = document.createElement('div');
  top.className = 'edge-blur edge-blur-top';
  const bottom = document.createElement('div');
  bottom.className = 'edge-blur edge-blur-bottom';
  mount.appendChild(top);
  mount.appendChild(bottom);
}
