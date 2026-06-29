import { createTabbar } from './components/tabbar.js';
import { createEdgeBlur } from './components/edge-blur.js';

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

// 화면 등록 (Screen Registry) — render/init 호출 순서를 그대로 결정한다.
const SCREENS = [
  name, card, role, dash, bolt, boltJoin, boltDetail, boltBuff, boltResult,
  vote, members, guide, settings, waiting,
];

// 앱 초기화
const app = document.getElementById('app');
app.innerHTML = SCREENS.map(screen => screen.render()).join('');
SCREENS.forEach(screen => screen.init());

// 전역 컴포넌트 등록 (상단 엣지 블러 포함)
createTabbar(app);
createEdgeBlur(app);

