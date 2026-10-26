/* =====================================================================
   M.A.P. to Tomorrow — 반 결과 모으기 (Google Apps Script)
   ---------------------------------------------------------------------
   웹앱이 학생마다 한 줄씩(닉네임 기준, 실명 없음) 이 시트에 적어요.
   · 「결과」 시트: 전체 학생 (관리하는 선생님은 이 시트를 보면 돼요)
   · 「반」 시트: 담임 선생님들이 웹앱에서 만든 반 목록
   · 담임 선생님은 웹앱의 '선생님용 결과 주소'로 자기 반 학생만 봐요 (주소에 든 열쇠로 확인)

   ▶ 설치 (한 번만)
   1. 새 구글 시트를 만들어요.
   2. 메뉴 [확장 프로그램] → [Apps Script] → 원래 있던 글을 지우고 이 파일 내용을 모두 붙여 넣고 저장(💾).
   3. [배포] → [새 배포] → 톱니바퀴에서 [웹 앱] 선택
      - 설명: map-to-tomorrow  · 다음 사용자 인증 정보로 실행: 나  · 액세스 권한: 모든 사용자
      → [배포] → (처음이면 권한 허용) → 나오는 '웹 앱 URL'을 복사해요.
   4. 웹앱의 js/data.js 에서 classApi: '' 따옴표 안에 그 URL을 붙여 넣어요.
   ※ 코드를 고친 뒤에는 [배포] → [배포 관리] → ✏️ → 버전: 새 버전 → [배포] 해야 바뀐 내용이 적용돼요.
   📝 웹앱 후기: 학생이 게임 끝에 낸 후기 설문은 「후기」 시트에 모여요.
      선생님용 「후기 모아 보기」 주소는 이 편집기에서 함수 reviewLink 를 골라 [실행]하면 아래 [실행 로그]에 나와요.
   ===================================================================== */

const SHEET_RESULTS = '결과';
const SHEET_CLASSES = '반';
const SHEET_REVIEWS = '후기';
const APP_URL = 'https://llyj59-dotcom.github.io/map/';
// 후기 시트 칸 (웹앱 REVIEW_SURVEY 문항 id 와 같은 차례)
const REVIEW_IDS = ['grade', 'overall', 'fun', 'learned', 'diff', 'length', 'best', 'recommend', 'good', 'improve', 'message'];
const HEAD_R = ['보낸 때', '학교급', '언어', '기기', '반 코드', '닉네임', '기록 id', '학년', '전체', '재미', '새로 안 것', '난이도', '길이', '좋았던 활동', '추천', '좋았던 점', '고칠 점', '하고 싶은 말'];
const HEAD = ['마지막 활동', '반 코드', '반 이름', '문항 수준', '언어', '닉네임', '기록 id', '작전 지점',
  '사전 점수', '사후 점수', '변화', '문항 수', '사전 응답', '사후 응답', '사전 생각(앎·중요)', '사후 생각(앎·중요)',
  '소감', '추모 카드', '11/11 묵념', '인증서', '마지막 일'];

// 반 열쇠를 만드는 비밀 값 — 처음 실행할 때 저절로 만들어져 이 스크립트에만 저장돼요
function secret_() {
  const props = PropertiesService.getScriptProperties();
  let s = props.getProperty('SECRET');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); props.setProperty('SECRET', s); }
  return s;
}
function sign_(cls) {
  const sig = Utilities.computeHmacSha256Signature(String(cls), secret_());
  return Utilities.base64EncodeWebSafe(sig).replace(/[^A-Za-z0-9]/g, '').slice(0, 12);
}
function code_(n) {
  const A = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let s = '';
  for (let i = 0; i < n; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
}
function sheet_(name, head) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(head); sh.setFrozenRows(1); sh.getRange(1, 1, 1, head.length).setFontWeight('bold'); }
  return sh;
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
// 시트 수식으로 읽히지 않게 (=, +, -, @ 로 시작하면 앞에 ' )
function clean_(v, n) { return String(v == null ? '' : v).replace(/^[=+\-@]/, "'$&").slice(0, n || 200); }
function num_(v) { return v === '' || v == null || isNaN(Number(v)) ? '' : Number(v); }
function classInfo_(cls) {
  const sh = sheet_(SHEET_CLASSES, ['만든 때', '반 코드', '반 이름', '문항 수준']);
  if (sh.getLastRow() < 2) return {};
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues();
  const r = rows.find((x) => x[1] === cls);
  return r ? { name: r[2], grade: r[3] } : {};
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'create') {
    const name = clean_(p.name, 40).trim();
    const grade = /^(34|56|ms|hs)$/.test(p.grade) ? p.grade : '56';
    if (!name) return json_({ ok: false, error: 'name' });
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sh = sheet_(SHEET_CLASSES, ['만든 때', '반 코드', '반 이름', '문항 수준']);
      const have = sh.getLastRow() > 1 ? new Set(sh.getRange(2, 2, sh.getLastRow() - 1, 1).getValues().map((x) => x[0])) : new Set();
      let cls;
      do { cls = code_(6); } while (have.has(cls));
      sh.appendRow([new Date(), cls, name, grade]);
      return json_({ ok: true, cls: cls, key: sign_(cls), name: name, grade: grade });
    } finally { lock.releaseLock(); }
  }
  if (p.action === 'view') {
    const cls = String(p.cls || '').toUpperCase();
    if (!cls || String(p.key || '') !== sign_(cls)) return json_({ ok: false, error: 'key' });
    const info = classInfo_(cls);
    const sh = sheet_(SHEET_RESULTS, HEAD);
    const rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, HEAD.length).getValues() : [];
    const out = rows.filter((r) => r[1] === cls).map((r) => ({
      t: r[0] instanceof Date ? r[0].getTime() : r[0], set: r[3], lang: r[4], nick: r[5], prog: r[7],
      pre: r[8], post: r[9], total: r[11], preAns: r[12], postAns: r[13], preAtt: r[14], postAtt: r[15],
      reflect: r[16], card: r[17], ttb: r[18], cert: r[19], ev: r[20]
    }));
    return json_({ ok: true, cls: cls, name: info.name || '', grade: info.grade || '', rows: out });
  }
  if (p.action === 'reviews') {
    if (String(p.key || '') !== reviewKey_()) return json_({ ok: false, error: 'key' });
    const sh = sheet_(SHEET_REVIEWS, HEAD_R);
    const rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, HEAD_R.length).getValues() : [];
    const out = rows.map((r) => {
      const o = { t: r[0] instanceof Date ? r[0].getTime() : r[0], level: r[1], lang: r[2], mode: r[3], cls: r[4], nick: r[5] };
      REVIEW_IDS.forEach((id, k) => { o[id] = r[7 + k]; });
      return o;
    });
    return json_({ ok: true, rows: out });
  }
  return json_({ ok: true, app: 'map-to-tomorrow', v: 2 });
}

// 📝 후기 모아 보기 열쇠 (반 열쇠와 같은 방식, 이 스크립트의 비밀 값으로 만들어져요)
function reviewKey_() { return sign_('__REVIEWS__'); }
// ▶ 편집기에서 이 함수를 골라 [실행] → [실행 로그]에 선생님용 후기 주소가 나와요 (다른 사람에게 알려 주지 마세요)
function reviewLink() {
  const url = APP_URL + '?reviews=' + reviewKey_();
  Logger.log('후기 모아 보기 주소: ' + url);
  return url;
}

// 학생 한 명(기록 id)당 한 줄 — 다시 내면 새 답으로 바꿔요
function reviewPost_(d) {
  const cls = String(d.cls || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  const row = [new Date(), clean_(d.level, 4), clean_(d.lang, 4), clean_(d.mode, 8), cls, clean_(d.nick, 20), clean_(d.gid, 30)]
    .concat(REVIEW_IDS.map((id) => (/^(overall|fun|learned|diff|length|recommend)$/.test(id) ? num_(d[id]) : clean_(d[id], 600))));
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_(SHEET_REVIEWS, HEAD_R);
    const n = sh.getLastRow() - 1;
    const ids = n > 0 ? sh.getRange(2, 7, n, 1).getValues().map((x) => x[0]) : [];
    const at = ids.indexOf(row[6]);
    if (at >= 0) sh.getRange(at + 2, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
  } finally { lock.releaseLock(); }
  return json_({ ok: true });
}

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false }); }
  if (!d || !d.gid) return json_({ ok: false });
  if (d.type === 'review') return reviewPost_(d);
  const cls = String(d.cls || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  const info = cls ? classInfo_(cls) : {};
  const pre = num_(d.pre), post = num_(d.post);
  const row = [new Date(), cls, info.name || '', clean_(d.set, 4), clean_(d.lang, 4), clean_(d.nick, 20), clean_(d.gid, 30), clean_(d.prog, 10),
    pre, post, pre !== '' && post !== '' ? post - pre : '', num_(d.total), clean_(d.preAns, 30), clean_(d.postAns, 30),
    clean_(d.preAtt, 10), clean_(d.postAtt, 10), clean_(d.reflect, 300), d.card ? '✓' : '', d.ttb ? '✓' : '', d.cert ? '✓' : '', clean_(d.ev, 40)];
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_(SHEET_RESULTS, HEAD);
    const n = sh.getLastRow() - 1;
    const ids = n > 0 ? sh.getRange(2, 7, n, 1).getValues().map((x) => x[0]) : [];
    const at = ids.indexOf(row[6]);
    if (at >= 0) {
      // 비어 있는 칸은 예전 값을 그대로 (다른 기기에서 이어 하면 출발 전 점검 기록이 없을 수 있어요)
      const old = sh.getRange(at + 2, 1, 1, row.length).getValues()[0];
      const merged = row.map((v, c) => (v === '' ? old[c] : v));
      merged[10] = merged[8] !== '' && merged[9] !== '' ? merged[9] - merged[8] : '';
      sh.getRange(at + 2, 1, 1, merged.length).setValues([merged]);
    } else sh.appendRow(row);
  } finally { lock.releaseLock(); }
  return json_({ ok: true });
}
