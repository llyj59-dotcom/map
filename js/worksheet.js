/* M.A.P. to Tomorrow — 학습지
   · 3·4학년용 / 5·6학년용 학습지를 인쇄(PDF 저장)할 수 있어요.
   · 게임을 한 학생은 '내 학습지'로 자기 퀴즈 기록·예상 답이 자동으로 들어간 학습지를 만들 수 있어요.
   · 서버로 보내는 것은 없어요. 모든 내용은 이 기기의 브라우저에서만 만들어져요. */
(function () {
  'use strict';

  const STORE_KEY = 'mapTomorrow.v2';
  const BANDS = { '34': '3·4학년', '56': '5·6학년' };
  const PDF_FILES = {
    '34': 'worksheets/MAP_학습지_3-4학년.pdf',
    '56': 'worksheets/MAP_학습지_5-6학년.pdf',
    key: 'worksheets/MAP_학습지_교사용_해설.pdf'
  };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ko = (o) => (o == null ? '' : typeof o === 'string' ? o : (o.ko || ''));
  const $ = (sel, root) => (root || document).querySelector(sel);
  const stations = () => window.STATIONS || [];
  const questions = () => window.QUESTIONS || {};

  /* ---------------- 내 기록 읽기 ---------------- */
  function currentPlayer() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (!s || !s.games) return null;
      if (s.last && s.games[s.last]) return s.games[s.last];
      const all = Object.values(s.games).sort((a, b) => (b.updated || 0) - (a.updated || 0));
      return all[0] || null;
    } catch (e) { return null; }
  }

  function quizRows(p) {
    return stations().filter((s) => s.quiz).map((s) => {
      const q = s.quiz;
      const fmt = (v) => (v == null ? '' : q.options ? ko(q.options[v]) : (String(v) === 'true' ? '○' : '×'));
      const mine = p && p.quiz ? p.quiz[s.id] : undefined;
      return {
        n: stations().indexOf(s) + 1,
        name: ko(s.short) || ko(s.name),
        mine: fmt(mine),
        right: fmt(q.answer),
        tried: mine !== undefined,
        ok: mine !== undefined && String(mine) === String(q.answer)
      };
    });
  }

  function heroNames(p) {
    const got = (p && p.cards) || {};
    return (window.HERO_CARDS || []).filter((c) => got[c.id]).map((c) => ko(c.name));
  }

  /* ---------------- 작은 조각들 ---------------- */
  const blank = (ans, w, key) => `<span class="bl" style="min-width:${w || 4}em"><i>${key ? esc(ans) : ''}</i></span>`;
  const lines = (mm) => `<div class="wl" style="height:${mm}mm"></div>`;
  const sec = (n, title, hint) => `<h2 class="sec"><b>${n}</b><span>${title}</span>${hint ? `<small>${hint}</small>` : ''}</h2>`;

  function head(band, p, opt) {
    const personal = !!p;
    const f = (label, v, cls) => `<span class="${cls || ''}">${label} <u>${esc(v || '')}</u></span>`;
    const filled = personal && (opt.name || opt.school || opt.cls || opt.num);
    const nameLine = filled
      ? `<div class="who filled">${f('이름', opt.name, 'w2')}${f('학교', opt.school, 'w3')}${f('반', opt.cls, 'w1')}${f('번호', opt.num, 'w1')}</div>`
      : `<div class="who">${f('이름', '', 'w2')}${f('학교', '', 'w3')}${f('반', '', 'w1')}${f('번호', '', 'w1')}${f('날짜', '', 'w2')}</div>`;
    return `<header class="phead">
      <div class="flagbar"><i></i><i></i><i></i></div>
      <div class="ptitle">
        <small>M.A.P. to Tomorrow · Memory · Across · Peace · ${BANDS[band]}</small>
        <h1>${band === '34' ? '평화의 지도 탐험 노트' : '평화의 지도 기록 노트'}${opt.key ? ' <em>교사용 해설</em>' : ''}</h1>
      </div>
      ${nameLine}
    </header>`;
  }
  const foot = (n, total) => `<footer class="pfoot"><span>M.A.P. to Tomorrow · 6·25 전쟁과 콜롬비아 · 평화의 지도 학습지</span><span>${n} / ${total}</span></footer>`;

  /* ---------------- 질문 카드 (참전용사 할아버지께 한 질문) ---------------- */
  function qCards(band, p, key) {
    const Q = questions();
    return Object.keys(Q).map((qid, i) => {
      const q = Q[qid];
      const mine = p && p.answers && p.answers[qid] && p.answers[qid].text ? p.answers[qid].text : '';
      const sums = (q.answers || []).filter((a) => a.summary && !a.note).map((a) => {
        const v = (window.VETERANS || {})[a.veteran];
        return `<p><b>${esc(v ? ko(v.name) : a.veteran)}</b> ${esc(ko(a.summary))}</p>`;
      }).join('');
      const askerName = q.asker ? esc(q.asker) : '';
      if (band === '34') {
        return `<div class="qcard">
          <div class="qh"><b>질문 ${i + 1}</b> <span>“${esc(ko(q.text))}”</span>${askerName ? `<small>— ${askerName}</small>` : ''}</div>
          ${mine ? `<div class="qrow"><label>내가 생각한 대답</label><div class="qline">${esc(mine)}</div></div>` : ''}
          <div class="qrow"><label>할아버지 답을 듣고 알게 된 것</label><div class="qline"></div></div>
          <div class="qfeel">느낌 ( ) 고마워요 😊 &nbsp;( ) 마음이 아파요 😢 &nbsp;( ) 놀라워요 😮</div>
        </div>`;
      }
      return `<div class="qcard q56${key || p ? ' filled' : ''}">
        <div class="qh"><b>질문 ${i + 1}</b> <span>“${esc(ko(q.text))}”</span>${askerName ? `<small>— ${askerName}</small>` : ''}</div>
        <div class="qgrid${p ? '' : ' two'}">
          ${p ? `<div><label>① 내 예상 (웹앱에 쓴 것)</label><div class="qbox">${esc(mine)}</div></div>` : ''}
          <div><label>${p ? '②' : '①'} 참전용사의 진짜 답 (영상을 보며 핵심만)</label><div class="qbox">${key || p ? sums : ''}</div></div>
          <div><label>${p ? '③' : '②'} 비교: 내 예상과 같은 점 · 다른 점</label><div class="qbox"></div></div>
        </div>
      </div>`;
    }).join('');
  }

  /* ---------------- 3·4학년 ---------------- */
  const FILL34 = [
    ['6·25 전쟁은 1950년 ', ['6', 2], '월에 시작되었어요.'],
    ['인천상륙작전에서 가장 먼저 상륙한 곳은 ', ['월미도', 4], '예요.'],
    ['콜롬비아는 ', ['라틴아메리카', 6], '에서 유일하게 싸우는 군대를 보낸 나라예요.'],
    ['콜롬비아대대는 약 ', ['25', 2], '일 동안 태평양을 건너 ', ['부산', 3], '항에 도착했어요.'],
    ['정전협정은 ', ['판문점', 4], '에서 맺었어요. 정전은 전쟁이 완전히 끝난 것이 아니라 ', ['잠시 멈춘', 5], ' 것이에요.'],
    ['인천 ', ['경명공원', 5], '에 콜롬비아군 참전기념비가 있어요.']
  ];
  const BANK34 = ['6', '월미도', '라틴아메리카', '25', '부산', '판문점', '잠시 멈춘', '경명공원'];
  const MATCH34 = {
    left: [['월미도', '㉲'], ['팔미도', '㉰'], ['부산항', '㉯'], ['판문점', '㉮'], ['경명공원', '㉱']],
    right: [['㉮', '정전협정을 맺은 곳'], ['㉯', '콜롬비아대대가 배에서 내린 곳'], ['㉰', '등대에 불을 밝힌 섬'], ['㉱', '콜롬비아군 참전기념비가 있는 공원'], ['㉲', '인천상륙작전에서 가장 먼저 상륙한 곳']]
  };

  function pages34(p, opt) {
    const key = !!opt.key;
    const fill = FILL34.map((parts, i) => `<li>${parts.map((x) => (Array.isArray(x) ? blank(x[0], x[1], key) : esc(x))).join('')}</li>`).join('');
    const page1 = `<section class="page fx">
      ${head('34', p, opt)}
      ${sec('①', '낱말 상자에서 알맞은 말을 골라 빈칸을 채워요', '게임의 이야기 카드를 떠올려 보세요')}
      <div class="bank">${BANK34.map((w) => `<span>${esc(w)}</span>`).join('')}</div>
      <ol class="fill">${fill}</ol>
      ${sec('②', '장소와 일어난 일을 짝지어요', '알맞은 기호를 ( ) 안에 써요')}
      <div class="match">
        <ul>${MATCH34.left.map(([a, k]) => `<li><b>${a}</b> ( <i>${key ? k : ''}</i> )</li>`).join('')}</ul>
        <ul class="r">${MATCH34.right.map(([k, t]) => `<li><b>${k}</b> ${t}</li>`).join('')}</ul>
      </div>
      ${sec('③', '게임에서 가장 기억에 남는 장면을 그려요', '그림 아래에 한 문장으로 설명도 써 보세요')}
      <div class="drawbox grow"></div>
      <div class="qline cap"></div>
      ${sec('④', '나의 평화 다짐 & 콜롬비아 친구에게 한마디')}
      <div class="pledge">
        <div class="pl"><label>나의 평화 다짐</label><div class="qline">${p && p.pledge ? esc(p.pledge) : ''}</div></div>
        <div class="es">
          <label>스페인어 따라 쓰기</label>
          <div class="trace"><span>Gracias, veteranos.</span><small>그라시아스 베테라노스 · 고맙습니다, 참전용사 여러분</small></div>
          <div class="trace"><span>Paz</span><small>파스 · 평화</small></div>
          <div class="trace"><span>Hola, amigos de Colombia.</span><small>올라 아미고스 데 콜롬비아 · 안녕, 콜롬비아 친구들</small></div>
        </div>
      </div>
      ${foot(1, '$TOTAL')}
    </section>`;
    const page2 = `<section class="page fx">
      ${head('34', p, opt)}
      ${sec('⑤', '참전용사 할아버지께 우리 친구들이 한 질문', '영상을 보고 알게 된 것을 써요 (내 생각은 웹앱에 썼어요)')}
      <div class="qwrap">${qCards('34', p, key)}</div>
      ${sec('⑥', '오늘의 나 돌아보기', '알맞은 얼굴에 ○표 해요')}
      <table class="self face"><tr><td>이야기 카드를 끝까지 꼼꼼히 읽었어요</td><td>😊 &nbsp;😐 &nbsp;😟</td></tr><tr><td>참전용사 할아버지의 이야기를 존중하며 들었어요</td><td>😊 &nbsp;😐 &nbsp;😟</td></tr><tr><td>평화를 위해 내가 할 일을 정했어요</td><td>😊 &nbsp;😐 &nbsp;😟</td></tr></table>
      ${foot(2, '$TOTAL')}
    </section>`;
    return [page1, page2];
  }

  /* ---------------- 5·6학년 ---------------- */
  const TIMELINE = [
    ['㉠', '400고지 전투', '1952. 6. 21.', 5],
    ['㉡', '인천상륙작전', '1950. 9. 15.', 2],
    ['㉢', '판문점 정전협정', '1953. 7. 27.', 8],
    ['㉣', '흑운토령 전투 (콜롬비아대대 첫 전투)', '1951. 8. 6.', 4],
    ['㉤', '6·25 전쟁이 시작됨', '1950. 6. 25.', 1],
    ['㉥', '불모고지 전투', '1953. 3. 23.~24.', 7],
    ['㉦', '콜롬비아대대가 부산항에 도착함', '1951. 6. 15.', 3],
    ['㉧', '180고지 전투 (바르불라 작전)', '1953. 3. 10.', 6]
  ];
  const OX56 = [
    ['6·25 전쟁 때 대한민국을 도우러 온 나라는 미국 한 나라뿐이었다.', '×', '유엔의 이름으로 여러 나라가 대한민국을 도우러 왔어요. 콜롬비아도 그중 하나예요.'],
    ['흑운토령 전투는 콜롬비아대대가 한국에서 치른 첫 전투였다.', '○', '1951년 8월 6일, 콜롬비아대대의 첫 전투였어요.'],
    ['“400고지”의 400은 그 산의 높이(약 400m)를 뜻한다.', '○', '높이를 뜻하는 이름이에요.'],
    ['정전협정은 전쟁을 완전히 끝낸 약속이다.', '×', '정전은 싸움을 잠시 멈춘 것이에요. 종전(전쟁이 완전히 끝남)이 아니라서 지금도 휴전선이 있어요.']
  ];

  function pages56(p, opt) {
    const key = !!opt.key;
    const tl = TIMELINE.map(([k, t, d, n]) => `<tr><td class="c">${k}</td><td>${t}</td><td class="c"><span class="box">${key ? n : ''}</span></td><td class="c">${key ? esc(d) : ''}</td></tr>`).join('');
    const ox = OX56.map(([s, a, why], i) => `<li><div><b>${i + 1}.</b> ${s} <span class="oxb">( ${key ? a : ''} )</span></div>${key ? `<div class="why">→ ${why}</div>` : `<div class="fix">틀렸다면 바르게 고쳐 써요: <u></u></div>`}</li>`).join('');
    const page1 = `<section class="page">
      ${head('56', p, opt)}
      ${sec('①', '일어난 순서대로 번호를 쓰고, 날짜도 적어요', '이야기 카드와 지도의 날짜를 확인해요')}
      <table class="tl"><thead><tr><th>기호</th><th>사건</th><th>순서</th><th>날짜</th></tr></thead><tbody>${tl}</tbody></table>
      ${sec('②', '맞으면 ○, 틀리면 ×를 쓰고, 틀린 문장은 바르게 고쳐요')}
      <ul class="ox">${ox}</ul>
      ${sec('③', '내 생각 쓰기', '근거가 되는 낱말·날짜를 넣어서 써요')}
      <p class="q">콜롬비아대대가 한국에서 치른 전투 가운데 가장 힘들었다고 생각하는 전투를 하나 골라, 그렇게 생각한 까닭을 써 보세요.</p>
      ${lines(26)}
      ${foot(1, '$TOTAL')}
    </section>`;
    const page2 = `<section class="page fx">
      ${head('56', p, opt)}
      ${sec('④', '내 예상 vs 참전용사의 진짜 답', p ? '내 예상은 웹앱에 쓴 내용이에요. 보면서 ②, 다 보고 ③을 써요' : '내 예상은 웹앱에 썼어요. 영상을 보며 ①, 다 보고 ②를 써요')}
      <div class="qwrap">${qCards('56', p, key)}</div>
      ${foot(2, '$TOTAL')}
    </section>`;
    const page3 = `<section class="page">
      ${head('56', p, opt)}
      ${sec('⑤', '생각 넓히기')}
      <p class="q">70여 년 전 콜롬비아 군인이 한국에 온 것과, 지금 우리가 콜롬비아 친구와 교류하는 것은 어떻게 연결될까요?</p>
      ${lines(30)}
      ${sec('⑥', '성찰: 내 생각은 어떻게 달라졌나?')}
      <p class="q">영상을 보기 전에 내가 예상한 것과 참전용사의 진짜 답을 비교했을 때, 가장 놀랍거나 생각이 달라진 점은 무엇인가요? 왜 그렇게 느꼈는지도 써 보세요.</p>
      ${lines(22)}
      <p class="q jour">한 사람의 ${blank('', 5, false)}은/는 국경을 넘어 ${blank('', 5, false)}을/를 바꿀 수 있다. 나는 ${blank('', 6, false)}(으)로 시작하겠다.</p>
      ${sec('⑦', '콜롬비아 친구·참전용사께 짧은 글', '한국어·스페인어·영어 중 하나로 써도 좋아요')}
      <div class="frames">
        <div><b>한국어</b> 고맙습니다. ___ 을(를) 배웠어요. 평화를 위해 ___ 하고 싶어요.</div>
        <div><b>Español</b> Gracias por ___. Aprendí que ___. Para la paz, quiero ___.</div>
        <div><b>English</b> Thank you for ___. I learned that ___. For peace, I want to ___.</div>
      </div>
      ${lines(20)}
      ${sec('⑧', '오늘의 나 돌아보기', '☆ 1~3개로 색칠해요')}
      <table class="self"><tr><td>사실(날짜·장소)을 근거로 정확히 이해했어요</td><td>☆ ☆ ☆</td></tr><tr><td>예상과 진짜 답을 비교하며 내 생각의 변화를 찾았어요</td><td>☆ ☆ ☆</td></tr><tr><td>참전용사의 이야기를 존중하며, 상대의 입장에서 생각했어요</td><td>☆ ☆ ☆</td></tr><tr><td>평화를 위한 나의 실천을 구체적으로 정했어요</td><td>☆ ☆ ☆</td></tr></table>
      <div class="qrow"><label style="width:46mm">더 알아보고 싶은 점</label><div class="qline"></div></div>
      ${foot(3, '$TOTAL')}
    </section>`;
    return [page1, page2, page3];
  }

  /* ---------------- 내 여정 기록 (개인 학습지에만 붙는 쪽) ---------------- */
  function recordPage(band, p, opt) {
    const rows = quizRows(p);
    const right = rows.filter((r) => r.ok).length;
    const cards = heroNames(p);
    const done = (p.done || []).length;
    const N = stations().length;
    const tbl = rows.map((r) => `<tr><td class="c">${r.n}</td><td>${esc(r.name)}</td>${band === '56' ? `<td>${esc(r.mine)}</td><td>${esc(r.right)}</td>` : `<td>${esc(r.right)}</td>`}<td class="c ${r.ok ? 'okc' : 'ngc'}">${r.tried ? (r.ok ? '⭕' : '△') : '·'}</td></tr>`).join('');
    return `<section class="page">
      ${head(band, p, opt)}
      ${sec('✔', '나의 여정 기록', '게임에서 자동으로 정리됐어요')}
      <div class="stats"><div><b>${done}</b> / ${N}<small>모은 지도 조각</small></div><div><b>${right}</b> / ${rows.length}<small>맞힌 퀴즈</small></div><div><b>${cards.length}</b> / ${(window.HERO_CARDS || []).length}<small>만난 영웅 카드</small></div></div>
      <table class="qt"><thead><tr><th>#</th><th>작전 지점</th>${band === '56' ? '<th>내 답</th>' : ''}<th>정답</th><th>결과</th></tr></thead><tbody>${tbl}</tbody></table>
      <p class="small">⭕ 맞혔어요 · △ 다시 확인해 봐요 · · 아직 안 풀었어요</p>
      ${cards.length ? `<p class="heroes"><b>내가 만난 영웅 카드</b> ${cards.map(esc).join(' · ')}</p>` : ''}
      ${p.pledge ? `<p class="heroes"><b>나의 평화 다짐</b> “${esc(p.pledge)}”</p>` : ''}
      ${foot('$N', '$TOTAL')}
    </section>`;
  }

  /* ---------------- 교사용 해설 쪽 ---------------- */
  function teacherPage() {
    return `<section class="page">
      <header class="phead"><div class="flagbar"><i></i><i></i><i></i></div>
        <div class="ptitle"><small>M.A.P. to Tomorrow · 학습지 활용 안내</small><h1>교사용 안내 <em>해설</em></h1></div></header>
      ${sec('1', '어떻게 쓰나요?')}
      <ul class="tips">
        <li><b>웹앱을 하는 동안</b>: 이야기 카드와 지도를 보며 ①②번(낱말·순서·퀴즈)을 채워요. 게임 중에 막히면 지도의 이야기 카드를 다시 열어 확인해요.</li>
        <li><b>참전용사 영상(엔딩)</b>: 영상을 보기 <u>전에</u> “내 예상”을 먼저 쓰고, 보면서 핵심을, 보고 나서 비교를 써요. (내 예상은 웹앱에 이미 썼으니 학습지에서는 진짜 답과 비교만 써요. 5·6학년 ④, 3·4학년 ④)</li>
        <li><b>웹앱을 마친 뒤</b>: 생각 넓히기·성찰·콜롬비아 친구에게 쓰는 글로 마무리해요. 패들렛 방명록에 올릴 한마디로 이어 갈 수 있어요.</li>
        <li><b>자동 학습지</b>: 학생이 게임을 마치면 엔딩 화면(또는 위쪽 “내 학습지”)에서 퀴즈 기록·예상 답이 들어간 학습지를 만들 수 있어요. 인쇄 창에서 “PDF로 저장”을 고르면 파일로 제출할 수 있어요.</li>
        <li><b>3·4학년</b>은 빈칸·짝짓기·그림 중심, <b>5·6학년</b>은 순서 정리·바르게 고치기·비교·성찰 글쓰기 중심이에요.</li>
      </ul>
      ${sec('2', '채점·지도 유의점')}
      <ul class="tips">
        <li>3·4학년 ①: 낱말 상자의 낱말을 한 번씩만 써요. ②: 월미도㉲ · 팔미도㉰ · 부산항㉯ · 판문점㉮ · 경명공원㉱.</li>
        <li>5·6학년 ①: 순서는 ㉤1 ㉡2 ㉦3 ㉣4 ㉠5 ㉧6 ㉥7 ㉢8. ②: ×–○–○–× (1번은 “여러 나라가 유엔의 이름으로 도왔다”, 4번은 “정전은 잠시 멈춘 것”으로 고쳐 써요).</li>
        <li>질문 카드의 “진짜 답”은 참전용사가 보내 준 영상 내용을 앱에서 요약한 거예요. 학생이 영상에서 직접 들은 말과 비교하게 해 주세요.</li>
        <li>전쟁 이야기라서 고통과 희생을 다루는 질문(질문 2 등)이 있어요. 아이들의 감정 반응(😢 등)을 존중하고, 서로 놀리지 않도록 안내해 주세요.</li>
        <li>실명·학교·반·번호는 학습지 위쪽 칸에만 써요. 앱 안에서는 닉네임만 써요.</li>
      </ul>
      ${sec('3', '정답·해설은 학생용 학습지(해설 포함)를 함께 보세요')}
      <p class="small">교사용 해설 모드의 학습지에는 빈칸 정답과 틀린 문장의 해설, 참전용사의 답 요약이 들어 있어요.</p>
      ${foot(1, 1)}
    </section>`;
  }

  /* ---------------- 조립 ---------------- */
  function build(band, mode, p, opt) {
    opt = Object.assign({ key: mode === 'key' }, opt || {});
    const bandKey = band === '56' ? '56' : '34';
    let pages = bandKey === '34' ? pages34(p, opt) : pages56(p, opt);
    if (p) pages.push(recordPage(bandKey, p, opt));
    const total = pages.length;
    pages = pages.map((h, i) => h.replace(/\$TOTAL/g, total).replace('$N', i + 1));
    return pages.join('\n');
  }

  const CSS = `
.ws-root{ --ink:#14224b; --soft:#4b5878; --line:#b9c4dc; --blue:#003893; --yel:#fcd116; --red:#ce1126; font-family:'Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',sans-serif; color:var(--ink); word-break:keep-all; }
.ws-root *{ box-sizing:border-box; }
.ws-root .page.fx{ display:flex; flex-direction:column; } .ws-root .page.fx>.grow{ flex:1; min-height:30mm; } .ws-root .qwrap{ flex:1 1 auto; display:flex; flex-direction:column; }
.ws-root .qwrap .qcard{ flex:1 1 auto; display:flex; flex-direction:column; justify-content:space-around; } .ws-root .qwrap .qcard .qgrid{ flex:1; } .ws-root .qwrap .qcard .qgrid>div{ display:flex; flex-direction:column; } .ws-root .qwrap .qcard .qbox{ flex:1; }
.ws-root .page{ width:210mm; height:297mm; padding:11mm 13mm 14mm; background:#fff; position:relative; overflow:hidden; font-size:10.4pt; line-height:1.5; page-break-after:always; break-after:page; }
.ws-root .page:last-child{ page-break-after:auto; break-after:auto; }
.ws-root .phead{ margin-bottom:3.5mm; }
.ws-root .flagbar{ display:flex; height:2.2mm; margin:-2mm 0 2.5mm; }
.ws-root .flagbar i{ flex:1; } .ws-root .flagbar i:nth-child(1){ background:var(--yel); flex:2; } .ws-root .flagbar i:nth-child(2){ background:var(--blue); } .ws-root .flagbar i:nth-child(3){ background:var(--red); }
.ws-root .ptitle small{ display:block; font-size:8.6pt; color:var(--soft); letter-spacing:.02em; }
.ws-root .ptitle h1{ margin:0; font-size:19pt; line-height:1.25; color:var(--blue); }
.ws-root .ptitle h1 em{ font-style:normal; font-size:11pt; background:var(--red); color:#fff; border-radius:4px; padding:1px 7px 0; vertical-align:middle; margin-left:6px; }
.ws-root .who{ display:flex; gap:7mm; margin-top:2.5mm; font-size:10pt; }
.ws-root .who span{ flex:1 1 0; white-space:nowrap; display:flex; gap:2mm; align-items:flex-end; }
.ws-root .who u{ flex:1; border-bottom:1px solid var(--ink); text-decoration:none; min-width:20mm; height:6mm; padding:0 1mm; }
.ws-modal .ws-two{ display:flex; gap:10px; } .ws-modal .ws-two>div{ flex:1; }
.ws-root .who{ gap:4mm; } .ws-root .who .w1{ flex:.6 1 0; } .ws-root .who .w2{ flex:1.2 1 0; } .ws-root .who .w3{ flex:1.5 1 0; } .ws-root .who u{ min-width:8mm; }
.ws-root .who.filled u{ border-bottom-style:dotted; font-weight:700; }
.ws-root .sec{ display:flex; align-items:baseline; gap:2.5mm; margin:4.2mm 0 2mm; font-size:11.4pt; line-height:1.3; }
.ws-root .sec b{ flex:none; background:var(--blue); color:#fff; border-radius:50%; min-width:6.4mm; height:6.4mm; display:inline-flex; align-items:center; justify-content:center; font-size:9.4pt; align-self:center; }
.ws-root .sec span{ font-weight:700; } .ws-root .sec small{ font-weight:400; color:var(--soft); font-size:8.8pt; }
.ws-root .bank{ display:flex; flex-wrap:wrap; gap:2mm; padding:2.4mm 3mm; background:#fff8d6; border:1.5px dashed #e3b93a; border-radius:8px; margin-bottom:2.4mm; }
.ws-root .bank span{ background:#fff; border:1px solid #e3b93a; border-radius:20px; padding:0 3mm; font-weight:700; }
.ws-root .fill{ margin:0; padding-left:6mm; display:grid; gap:1.6mm; }
.ws-root .fill li{ line-height:1.95; }
.ws-root .bl{ display:inline-block; border-bottom:1.3px solid var(--ink); text-align:center; margin:0 .6mm; line-height:1.15; }
.ws-root .bl i{ font-style:normal; color:var(--red); font-weight:700; }
.ws-root .match{ display:grid; grid-template-columns:1fr 1.5fr; gap:6mm; }
.ws-root .match ul{ list-style:none; margin:0; padding:0; display:grid; gap:1.4mm; }
.ws-root .match li{ padding:1.2mm 3mm; border:1px solid var(--line); border-radius:8px; }
.ws-root .match li i{ font-style:normal; color:var(--red); font-weight:700; display:inline-block; min-width:5mm; text-align:center; }
.ws-root .match .r li{ background:#f2f7ff; }
.ws-root .qline.cap{ flex:none; margin-top:2mm; min-height:8mm; } .ws-root .drawbox{ min-height:30mm; border:1.5px solid var(--ink); border-radius:10px; }
.ws-root .wl{ margin-top:1.5mm; background-image:repeating-linear-gradient(to bottom, transparent 0, transparent 7.2mm, var(--line) 7.2mm, var(--line) 7.5mm); background-size:100% 7.5mm; }
.ws-root .qcard{ border:1.5px solid var(--line); border-radius:10px; padding:1.8mm 3mm; margin-bottom:2mm; }
.ws-root .qh{ font-size:9.8pt; line-height:1.45; margin-bottom:1.2mm; }
.ws-root .qh b{ color:#fff; background:var(--blue); border-radius:10px; padding:0 2.4mm; margin-right:1.5mm; font-size:9pt; }
.ws-root .qh small{ color:var(--soft); margin-left:1mm; }
.ws-root .qrow{ display:flex; align-items:flex-end; gap:2mm; margin-top:.8mm; }
.ws-root .qrow label{ flex:none; width:42mm; font-size:8.8pt; color:var(--soft); }
.ws-root .qline{ flex:1; min-height:6.4mm; border-bottom:1px solid var(--ink); padding:0 1mm; font-weight:700; color:#1b3a8a; }
.ws-root .qfeel{ font-size:9pt; color:var(--soft); margin-top:1.2mm; }
.ws-root .pledge .pl{ display:flex; gap:2mm; align-items:flex-end; margin-bottom:3mm; }
.ws-root .pledge label, .ws-root .es label{ flex:none; font-size:9pt; color:var(--soft); }
.ws-root .es{ display:grid; grid-template-columns:repeat(3,1fr); gap:2mm; } .ws-root .es label{ grid-column:1/-1; } .ws-root .trace{ border:1px dashed var(--line); border-radius:8px; padding:1mm 2.4mm; margin:0; }
.ws-root .trace span{ display:block; font-size:12.5pt; color:#c7cfe0; letter-spacing:.04em; font-weight:700; }
.ws-root .trace small{ color:var(--soft); font-size:8.6pt; }
.ws-root table{ width:100%; border-collapse:collapse; }
.ws-root th, .ws-root td{ border:1px solid var(--line); padding:1.3mm 2.2mm; vertical-align:middle; }
.ws-root th{ background:#eaf2ff; font-size:9.2pt; }
.ws-root td.c{ text-align:center; }
.ws-root .box{ display:inline-block; width:7mm; height:6mm; border:1.3px solid var(--ink); border-radius:4px; line-height:5mm; color:var(--red); font-weight:700; }
.ws-root .tl td{ height:8.2mm; }
.ws-root .ox{ list-style:none; margin:0; padding:0; display:grid; gap:1.6mm; }
.ws-root .ox li{ border:1px solid var(--line); border-radius:8px; padding:1.4mm 3mm; }
.ws-root .oxb{ color:var(--red); font-weight:700; white-space:nowrap; }
.ws-root .fix{ color:var(--soft); font-size:9pt; display:flex; gap:2mm; align-items:flex-end; } .ws-root .fix u{ flex:1; border-bottom:1px solid var(--ink); text-decoration:none; height:5mm; }
.ws-root .why{ color:var(--red); font-size:9pt; }
.ws-root .q{ margin:1mm 0 .5mm; font-weight:500; }
.ws-root .jour{ line-height:2.1; font-size:11pt; }
.ws-root .frames{ background:#f2f7ff; border-radius:8px; padding:2mm 3mm; margin-bottom:1mm; font-size:9.2pt; }
.ws-root .frames div{ margin:.6mm 0; } .ws-root .frames b{ display:inline-block; min-width:16mm; color:var(--blue); }
.ws-root .self.face td:last-child{ font-size:13pt; letter-spacing:0; color:inherit; } .ws-root .self td:last-child{ width:34mm; text-align:center; letter-spacing:.2em; color:#e3a400; font-size:12pt; }
.ws-root .q56{ padding:2mm 2.6mm; margin-bottom:2.2mm; }
.ws-root .filled .qgrid{ grid-template-columns:.8fr 2.6fr .9fr; } .ws-root .filled .qbox{ font-size:7.6pt; line-height:1.32; min-height:12mm; } .ws-root .filled .qbox b{ font-size:7.6pt; display:inline; margin-right:1mm; } .ws-root .filled .qbox p{ margin:0 0 .8mm; }
.ws-root .qgrid.two{ grid-template-columns:1fr 1fr; } .ws-root .filled .qgrid.two{ grid-template-columns:2.6fr 1fr; }
.ws-root .qgrid{ display:grid; grid-template-columns:1fr 1.25fr 1fr; gap:2.2mm; }
.ws-root .qgrid label{ display:block; font-size:8.2pt; color:var(--soft); line-height:1.3; margin-bottom:.8mm; }
.ws-root .qbox{ border:1px solid var(--line); border-radius:6px; min-height:21mm; padding:1.2mm 2mm; font-size:8.8pt; line-height:1.4; }
.ws-root .qbox p{ margin:0 0 1.2mm; } .ws-root .qbox b{ color:var(--blue); display:block; font-size:8.4pt; }
.ws-root .tips{ margin:0; padding-left:5mm; display:grid; gap:1.6mm; } .ws-root .tips li{ line-height:1.5; }
.ws-root .small{ font-size:9pt; color:var(--soft); margin:1.2mm 0; }
.ws-root .stats{ display:grid; grid-template-columns:repeat(3,1fr); gap:3mm; margin:1mm 0 3mm; }
.ws-root .stats div{ border:1.5px solid var(--line); border-radius:10px; text-align:center; padding:2mm; font-size:11pt; } .ws-root .stats b{ font-size:19pt; color:var(--blue); } .ws-root .stats small{ display:block; font-size:8.8pt; color:var(--soft); }
.ws-root .qt td{ font-size:9.4pt; padding:1.1mm 2mm; } .ws-root .okc{ font-size:11pt; } .ws-root .ngc{ color:var(--red); font-weight:700; }
.ws-root .heroes{ margin:2mm 0; font-size:9.8pt; } .ws-root .heroes b{ color:var(--blue); margin-right:2mm; }
.ws-root .pfoot{ position:absolute; left:13mm; right:13mm; bottom:6mm; display:flex; justify-content:space-between; font-size:8pt; color:var(--soft); border-top:1px solid var(--line); padding-top:1.4mm; }
/* 화면 속 미리 보기 */
.ws-overlay{ position:fixed; inset:0; z-index:9999; background:#6b7690; overflow:auto; display:flex; flex-direction:column; align-items:center; font-family:'Noto Sans KR',sans-serif; }
.ws-toolbar{ position:sticky; top:0; z-index:2; width:100%; display:flex; flex-wrap:wrap; gap:8px; align-items:center; justify-content:center; padding:10px 12px; background:#fff; border-bottom:3px solid #fcd116; font-size:15px; color:#14224b; }
.ws-toolbar .ws-title{ font-weight:700; margin-right:auto; }
.ws-toolbar button{ border:0; border-radius:14px; min-height:44px; padding:6px 16px; font-weight:700; cursor:pointer; background:#003893; color:#fff; font-size:16px; }
.ws-toolbar button.ghost{ background:#fff; color:#4b5878; border:2px solid #d9e2ef; }
.ws-overlay .ws-root{ padding:14px 0 40px; display:flex; flex-direction:column; gap:14px; align-items:center; max-width:100%; }
.ws-overlay .ws-root .page{ box-shadow:0 4px 18px rgba(0,0,0,.35); flex:none; }
@media (max-width: 860px){ .ws-overlay .ws-root{ zoom:.6; } }
@media (max-width: 520px){ .ws-overlay .ws-root{ zoom:.42; } }
/* 내 학습지 만들기 창 */
.ws-modal{ position:fixed; inset:0; z-index:9998; background:rgba(20,34,75,.55); display:flex; align-items:center; justify-content:center; padding:16px; }
.ws-card{ background:#fff; border-radius:18px; max-width:460px; width:100%; padding:20px 22px; color:#14224b; max-height:92vh; overflow:auto; }
.ws-card h2{ margin:0 0 6px; font-size:20px; } .ws-card p{ margin:4px 0 10px; font-size:15px; color:#4b5878; }
.ws-card label{ display:block; font-weight:700; font-size:15px; margin:10px 0 4px; }
.ws-card input[type=text]{ width:100%; border:2px solid #d9e2ef; border-radius:14px; padding:10px 14px; font-size:17px; min-height:48px; }
.ws-card .ws-radios{ display:flex; gap:10px; flex-wrap:wrap; } .ws-card .ws-radios label{ margin:0; display:flex; align-items:center; gap:6px; border:2px solid #d9e2ef; border-radius:14px; padding:10px 16px; min-height:48px; font-weight:700; cursor:pointer; }
.ws-card .ws-actions{ display:flex; gap:8px; margin-top:16px; flex-wrap:wrap; }
.ws-card .ws-actions button{ border:0; border-radius:14px; min-height:48px; padding:6px 18px; font-weight:700; font-size:17px; cursor:pointer; background:#003893; color:#fff; } .ws-card .ws-actions button.ghost{ background:#fff; color:#4b5878; border:2px solid #d9e2ef; }
/* 시작 화면·선생님 화면 속 학습지 칸 */
.ws-cards{ display:grid; gap:10px; } .ws-cardrow{ border:2px solid #d9e2ef; border-radius:14px; padding:12px 14px; }
.ws-cardrow b{ font-size:17px; } .ws-cardrow p{ margin:2px 0 8px; font-size:14px; color:#4b5878; }
.ws-btns{ display:flex; gap:8px; flex-wrap:wrap; }
.ws-btns button, .ws-btns a{ border:2px solid #d9e2ef; background:#fff; color:#14224b; border-radius:14px; min-height:44px; padding:8px 14px 6px; font-weight:700; font-size:15px; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; }
.ws-btns .go{ background:#fcd116; border-color:#fcd116; }
/* 인쇄: 학습지 쪽만 */
@page{ size:A4; margin:0; }
@media print{
  html, body{ height:auto !important; background:#fff !important; }
  body.ws-printing > *:not(.ws-overlay){ display:none !important; }
  body.ws-printing .ws-overlay{ position:static; background:#fff; overflow:visible; display:block; }
  body.ws-printing .ws-toolbar{ display:none !important; }
  body.ws-printing .ws-overlay .ws-root{ padding:0; display:block; zoom:1 !important; }
  body.ws-printing .ws-overlay .ws-root .page{ box-shadow:none; }
  .ws-root, .ws-root *{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }
}`;

  function ensureStyle() {
    if ($('#wsStyle')) return;
    const st = document.createElement('style');
    st.id = 'wsStyle';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function fileTitle(band, mode, p) {
    const base = mode === 'key' ? `MAP 학습지(${band === '56' ? '5-6' : '3-4'}학년·교사용 해설)` : `MAP 학습지(${band === '56' ? '5-6' : '3-4'}학년)`;
    const who = p && p.nick ? `_${String(p.nick).replace(/[\\/:*?"<>|]/g, '')}` : '';
    return base + who;
  }

  function standalone(band, mode, p, opt) {
    const title = fileTitle(band, mode, p);
    return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<style>${CSS}\nbody{margin:0;background:#6b7690;}.ws-root{display:flex;flex-direction:column;gap:14px;align-items:center;padding:14px 0}.ws-root .page{box-shadow:0 4px 18px rgba(0,0,0,.35)}@media print{body{background:#fff}.ws-root{display:block;padding:0}.ws-root .page{box-shadow:none}}</style></head>
<body><div class="ws-root">${build(band, mode, p, opt)}</div></body></html>`;
  }

  /* ---------------- 열기 / 인쇄 / 저장 ---------------- */
  let overlay = null;
  let savedTitle = '';
  function close() {
    if (overlay) { overlay.remove(); overlay = null; }
    document.body.classList.remove('ws-printing');
    document.removeEventListener('keydown', onKey);
    if (savedTitle) document.title = savedTitle;
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  function open(band, mode, p, opt) {
    ensureStyle();
    close();
    opt = opt || {};
    const title = fileTitle(band, mode, p);
    overlay = document.createElement('div');
    overlay.className = 'ws-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', '학습지 미리 보기');
    overlay.innerHTML = `<div class="ws-toolbar">
        <span class="ws-title">📄 ${esc(title)}</span>
        <button type="button" data-a="print">🖨️ 인쇄 · PDF로 저장</button>
        <button type="button" class="ghost" data-a="html">💾 파일로 저장(.html)</button>
        <button type="button" class="ghost" data-a="close">닫기 ✕</button>
      </div>
      <div class="ws-root">${build(band, mode, p, Object.assign({ key: mode === 'key' }, opt))}</div>`;
    document.body.appendChild(overlay);
    document.addEventListener('keydown', onKey);
    overlay.querySelector('[data-a="close"]').addEventListener('click', close);
    overlay.querySelector('[data-a="print"]').addEventListener('click', () => {
      savedTitle = document.title;
      document.title = title;
      document.body.classList.add('ws-printing');
      const done = () => { document.body.classList.remove('ws-printing'); document.title = savedTitle; window.removeEventListener('afterprint', done); };
      window.addEventListener('afterprint', done);
      window.print();
    });
    overlay.querySelector('[data-a="html"]').addEventListener('click', () => {
      const blob = new Blob([standalone(band, mode, p, opt)], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = title + '.html';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    });
    overlay.querySelector('[data-a="print"]').focus();
  }

  /* ---------------- 내 학습지 만들기 (창) ---------------- */
  function openPersonal() {
    ensureStyle();
    const p = currentPlayer();
    if (!p) { alert('먼저 게임을 시작해 주세요.'); return; }
    const junior = (() => { try { return new URLSearchParams(location.search).get('grade') === '34'; } catch (e) { return false; } })();
    const m = document.createElement('div');
    m.className = 'ws-modal';
    m.innerHTML = `<div class="ws-card" role="dialog" aria-modal="true" aria-label="내 학습지 만들기">
      <h2>📄 내 학습지 만들기</h2>
      <p>지금까지 푼 퀴즈와 내가 쓴 예상 답이 학습지에 자동으로 들어가요. 아직 안 한 칸은 비워 둬요.</p>
      <label>학년</label>
      <div class="ws-radios">
        <label><input type="radio" name="wsBand" value="34" ${junior ? 'checked' : ''}> 3·4학년</label>
        <label><input type="radio" name="wsBand" value="56" ${junior ? '' : 'checked'}> 5·6학년</label>
      </div>
      <label for="wsName">이름 (선택)</label><input id="wsName" type="text" maxlength="20" autocomplete="off" value="${esc(p.realName || '')}">
      <label for="wsSchool">학교 (선택)</label><input id="wsSchool" type="text" maxlength="30" autocomplete="off" placeholder="예: 인천신검단초" value="${esc(p.school || '')}">
      <div class="ws-two"><div><label for="wsCls">반 (선택)</label><input id="wsCls" type="text" maxlength="6" autocomplete="off" placeholder="예: 6-8"></div><div><label for="wsNum">번호 (선택)</label><input id="wsNum" type="text" maxlength="4" autocomplete="off" placeholder="예: 12"></div></div>
      <p style="font-size:13px">이름은 이 학습지에만 쓰여요. 어디로도 보내지 않아요. 비워 두고 인쇄한 뒤 손으로 써도 돼요.</p>
      <div class="ws-actions"><button type="button" data-a="make">학습지 만들기</button><button type="button" class="ghost" data-a="cancel">취소</button></div>
    </div>`;
    document.body.appendChild(m);
    const gone = () => m.remove();
    m.addEventListener('click', (e) => { if (e.target === m) gone(); });
    m.querySelector('[data-a="cancel"]').addEventListener('click', gone);
    m.querySelector('[data-a="make"]').addEventListener('click', () => {
      const band = (m.querySelector('input[name="wsBand"]:checked') || {}).value || '56';
      const opt = { name: $('#wsName', m).value.trim(), school: $('#wsSchool', m).value.trim(), cls: $('#wsCls', m).value.trim(), num: $('#wsNum', m).value.trim() };
      gone();
      open(band, 'personal', currentPlayer(), opt);
    });
    m.querySelector('[data-a="make"]').focus();
  }

  /* ---------------- 화면에 단추 붙이기 ---------------- */
  function pdfLinks(band) {
    return `<a href="${PDF_FILES[band]}" download>⬇️ PDF 내려받기</a>`;
  }
  function wsCards(teacher) {
    const row = (band) => `<div class="ws-cardrow">
        <b>${BANDS[band]} 학습지</b>
        <p>${band === '34' ? '빈칸 채우기 · 짝짓기 · 그림 · 따라 쓰기 (2쪽)' : '순서 정리 · 바르게 고치기 · 예상과 답 비교 · 성찰 글쓰기 (3쪽)'}</p>
        <div class="ws-btns"><button type="button" class="go" data-ws="${band}">🖨️ 인쇄 · PDF 저장</button>${pdfLinks(band)}</div>
      </div>`;
    const keyRow = teacher ? `<div class="ws-cardrow">
        <b>교사용 해설</b>
        <p>활용 안내 + 정답·해설이 채워진 학습지 (3·4학년 / 5·6학년)</p>
        <div class="ws-btns"><button type="button" data-ws="key34">3·4학년 해설</button><button type="button" data-ws="key56">5·6학년 해설</button><button type="button" data-ws="guide">활용 안내</button><a href="${PDF_FILES.key}" download>⬇️ 해설 PDF</a></div>
      </div>` : '';
    return `<div class="ws-cards">${row('34')}${row('56')}${keyRow}</div>
      <p class="fold-help" style="margin-top:8px">${teacher ? '' : '게임을 한 학생은 위쪽 “📄 내 학습지” 단추로, 내 퀴즈 기록과 예상 답이 들어간 학습지를 만들 수 있어요.'}</p>`;
  }
  function wireCards(root) {
    root.querySelectorAll('[data-ws]').forEach((b) => b.addEventListener('click', () => {
      const v = b.dataset.ws;
      if (v === 'guide') { openGuide(); return; }
      if (v.indexOf('key') === 0) open(v.slice(3), 'key', null, {});
      else open(v, 'blank', null, {});
    }));
  }
  function openGuide() {
    ensureStyle();
    close();
    overlay = document.createElement('div');
    overlay.className = 'ws-overlay';
    overlay.innerHTML = `<div class="ws-toolbar"><span class="ws-title">📄 교사용 안내</span><button type="button" data-a="print">🖨️ 인쇄 · PDF로 저장</button><button type="button" class="ghost" data-a="close">닫기 ✕</button></div><div class="ws-root">${teacherPage()}</div>`;
    document.body.appendChild(overlay);
    document.addEventListener('keydown', onKey);
    overlay.querySelector('[data-a="close"]').addEventListener('click', close);
    overlay.querySelector('[data-a="print"]').addEventListener('click', () => {
      document.body.classList.add('ws-printing');
      const done = () => { document.body.classList.remove('ws-printing'); window.removeEventListener('afterprint', done); };
      window.addEventListener('afterprint', done);
      window.print();
    });
  }

  function mountStart() {
    if ($('#wsFold') || !$('#resumeFold')) return;
    const d = document.createElement('details');
    d.className = 'fold';
    d.id = 'wsFold';
    d.innerHTML = `<summary>📄 학습지 (인쇄 · PDF)</summary><div class="fold-body"><p class="fold-help">웹앱을 하면서, 또는 하고 난 뒤에 쓰는 학습지예요. 학년에 맞는 것을 골라요.</p>${wsCards(false)}</div>`;
    $('#resumeFold').insertAdjacentElement('afterend', d);
    wireCards(d);
  }
  function mountTeacher() {
    const host = $('#teacherScreen .teacher-inner');
    if (!host || $('#wsTeacher')) return;
    const s = document.createElement('section');
    s.className = 't-card';
    s.id = 'wsTeacher';
    s.innerHTML = `<h2>📄 학습지</h2><p class="t-help">3·4학년용, 5·6학년용 학습지와 교사용 해설이에요. PDF를 내려받아 다른 선생님께 나눠 줄 수도 있어요.</p>${wsCards(true)}`;
    const prev = $('#previewList') && $('#previewList').closest('.t-card');
    if (prev) prev.insertAdjacentElement('beforebegin', s); else host.appendChild(s);
    wireCards(s);
  }
  function mountChip() {
    const right = $('.topbar-right');
    const chip = $('#playerChip');
    if (!right || !chip || $('#wsChip')) return;
    const b = document.createElement('button');
    b.id = 'wsChip';
    b.type = 'button';
    b.className = 'chip';
    b.textContent = '📄 내 학습지';
    b.hidden = chip.hidden;
    chip.insertAdjacentElement('beforebegin', b);
    b.addEventListener('click', openPersonal);
    new MutationObserver(() => { b.hidden = chip.hidden; }).observe(chip, { attributes: true, attributeFilter: ['hidden'] });
  }
  function watchEnding() {
    const body = $('#endingBody');
    if (!body) return;
    const add = () => {
      if (!$('#endCredits', body) || $('#wsEndBtn', body)) return;
      const row = $('#endCredits', body).closest('.credits-row') || $('#endCredits', body).parentElement;
      const b = document.createElement('button');
      b.id = 'wsEndBtn';
      b.type = 'button';
      b.className = 'btn btn-blue btn-sm';
      b.textContent = '📄 내 학습지 만들기';
      b.style.marginLeft = '8px';
      row.appendChild(b);
      b.addEventListener('click', openPersonal);
    };
    new MutationObserver(add).observe(body, { childList: true, subtree: true });
    add();
  }
  function watchTeacher() {
    const t = $('#teacherScreen');
    if (!t) return;
    new MutationObserver(() => { if (!t.hidden) mountTeacher(); }).observe(t, { attributes: true, attributeFilter: ['hidden'] });
    if (!t.hidden) mountTeacher();
  }

  function init() {
    ensureStyle();
    mountStart(); mountChip(); watchEnding(); watchTeacher();
  }
  window.MapWorksheet = { build, open, openPersonal, standalone, teacherPage, CSS, bands: BANDS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
