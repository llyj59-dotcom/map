/* M.A.P. to Tomorrow — 게임 로직
   · 서버·로그인 없음: 모든 기록은 이 기기(브라우저 localStorage)에만 저장
   · 닉네임으로 시작 → 자동 저장 → "나의 여정 코드"로 다른 기기에서 이어 하기 / 선생님께 결과 알리기 */
(function () {
  'use strict';

  const STATIONS = window.STATIONS;
  const QUESTIONS = window.QUESTIONS;
  const CONFIG = window.MAP_CONFIG;
  const STORE_KEY = 'mapTomorrow.v2';
  const ROSTER_KEY = 'mapTomorrow.roster.v1';
  const N = STATIONS.length;
  // 🔗 claude.ai 링크(아티팩트)로 열 때: 다른 사이트를 페이지 안에 넣을 수 없어서
  //   유튜브는 새 탭으로, 외부 사진은 빼고, 패들렛은 링크로, 인증서는 '저장' 확인 창으로 받아요.
  const SANDBOX = window.MAP_HOST === 'artifact';
  if (SANDBOX) (window.HERO_CARDS || []).forEach((c) => { delete c.img; delete c.credit; });

  /* ---------------- 화면 글자 (한/스) ---------------- */
  const UI = {
    ko: {
      subtitle: '기억·연결·평화의 지도',
      narration: ['1950년, 한반도에 전쟁이 일어났어요.', '지구 반대편 콜롬비아에서, 한 젊은이가 배에 올랐어요.', '그날의 기억 속으로 들어가 봅시다.'],
      startTagline: '기억(M)·연결(A)·평화(P)의 지도로 그리는 평화의 내일',
      startLead: '인천상륙작전에서 콜롬비아대대의 전투, 서해를 지킨 콜롬비아 해군, 인천의 참전기념비까지! 지도 위 작전 지점 12곳을 하나씩 지나며 평화의 지도를 완성해 보세요.',
      mapLetters: [
        ['M', 'Memory · 기억', '기록 속 영웅을 찾아 기억해요'],
        ['A', 'Across · 연결', '시간과 국경을 넘어 콜롬비아 친구들과 만나요'],
        ['P', 'Peace · 평화', '우리 손으로 평화의 지도를 그려요']
      ],
      mapTo: '→ to Tomorrow: 그 지도로 함께 평화로운 내일을 그려요',
      aboutTitle: '💡 이 게임은 왜 만들었을까요?',
      about: [
        '이 게임은 인천신검단초등학교 6학년 친구들이 직접 조사한 이야기로 만든 평화의 지도예요.',
        '우리 학교는 인천 서구에 있어요. 같은 서구의 경명공원에는 콜롬비아 참전기념비가 서 있어요. 콜롬비아는 6·25 전쟁 때 라틴아메리카에서 유일하게 전투 부대를 보낸 나라예요. 기념비에는 콜롬비아 용사들이 싸운 흑운토령·금성 전투가 새겨져 있지요.',
        '인천상륙작전(1950)은 콜롬비아대대가 오기 전의 일이에요. 그래도 우리 고장 인천에서 시작된 이 작전이 전쟁의 흐름을 바꾸었고, 그 뒤 지구 반대편에서 온 콜롬비아 용사들이 고지에서 싸우고, 콜롬비아 해군이 서해를 지켰어요. 그 이야기를 인천에서 시작해 인천으로 돌아오는 한 장의 지도로 이었어요.'
      ],
      aboutGoals: [
        '참전용사들의 희생을 기억하고, 평화가 거저 오지 않았다는 것을 알아요.',
        '콜롬비아 파트너교 친구들과 이 기억을 나누며 국경을 넘어 연결돼요.',
        '마지막에 나의 평화 다짐을 인증서에 담아 함께 평화로운 내일을 약속해요.'
      ],
      aboutGoalsTitle: '이 게임으로 우리는',
      savedTitle: '이 기기에 저장된 여정',
      continue: '이어하기 ▶',
      newTitle: '새로 시작하기',
      nickLabel: '닉네임',
      nickGuide: '진짜 이름 말고 게임에서 쓸 닉네임을 지어 주세요! 온라인에서 실명 대신 닉네임을 쓰는 것도 개인정보를 지키는 방법이에요.',
      startBtn: '여정 시작하기 ▶',
      needNick: '닉네임을 적어 주세요.',
      tooLong: (n) => `닉네임은 ${n}글자까지 쓸 수 있어요.`,
      banned: '참전용사를 기억하는 게임이에요. 욕설이나 남을 낮추는 말 대신, 바르고 고운 말로 닉네임을 지어 주세요.',
      nickShort: '닉네임은 두 글자 이상으로 지어 주세요.',
      nickChars: '닉네임에는 글자와 숫자만 쓸 수 있어요. (이모지·특수문자는 안 돼요)',
      nickJamo: 'ㅋ, ㅎ, ㅗ처럼 자음·모음만 따로 쓸 수 없어요. 완성된 글자로 지어 주세요.',
      nickRepeat: 'ㅋㅋㅋ, 하하하처럼 같은 글자나 웃음소리를 반복한 닉네임은 쓸 수 없어요. 나를 잘 나타내는 이름으로 지어 볼까요?',
      textBad: '욕설이나 남을 낮추는 말이 들어 있어요. 바르고 고운 말로 다시 써 주세요.',
      textRepeat: 'ㅋㅋ, ㅎㅎ 같은 표현은 빼고 진지하게 써 주세요.',
      nickExists: (n) => `이 기기에 이미 "${n}" 여정이 있어요. 위 목록에서 [이어하기]를 누르거나 다른 닉네임을 지어 주세요.`,
      breakTitle: '1차시는 여기까지!',
      breakText: '다음 시간에 이어서 해요. 다른 기기를 쓸 수도 있으니 아래 코드를 공책에 적어 두세요.',
      backTeacher: '‹ 선생님 화면으로',
      resumeTitle: '다른 기기에서 하던 여정 이어 하기',
      resumeHelp: '게임 중 위쪽 [🔑 코드] 버튼에서 본 6글자 코드와 닉네임을 넣어 주세요.',
      codeLabel: '나의 여정 코드',
      resumeBtn: '코드로 이어 하기 ▶',
      badCode: '코드가 맞지 않아요. 글자를 다시 확인해 주세요.',
      teacherOpen: '🔒 선생님용',
      teacherGuide: '비밀번호를 넣으면 학생 결과 모으기, 방명록 모아 보기, 작전 지점 미리 보기를 쓸 수 있어요.',
      password: '비밀번호',
      enter: '들어가기',
      wrongPw: '비밀번호가 달라요.',

      journey: '나의 여정',
      chPrologue: '프롤로그 · 전쟁 이야기',
      chIncheon: '인천상륙작전',
      chJourney: '콜롬비아대대의 전투',
      chReturn: '다시 인천으로 · 기억의 바다',
      gToIncheon: 'A(연결)의 장도 끝! 이제 마지막 P(Peace·평화)의 장이야. 다시 인천으로 돌아가, 콜롬비아 해군이 지킨 서해와 오늘의 기념비를 만나자.',
      lensTitle: '인천 돋보기',
      nowEyebrow: (i, n) => `다음 작전 지점 · ${i} / ${n}`,
      enterStation: '작전 지점 들어가기 ▶',
      allDone: '모든 작전 지점을 지났어요!',
      allDoneMeta: '이제 참전용사님의 진짜 답을 만나러 가요.',
      toEnding: '🎬 엔딩: 진짜 답 만나기 ▶',
      guestbookBtn: '✎ 우리 방명록 보기',

      // 게임 요소
      langBtn: 'ES · Español',
      starChip: (n) => `⭐ ${n}`,
      cardChip: (a, b) => `🎴 ${a}/${b}`,
      starPop: (n) => `+${n} ⭐`,
      gHello: (n) => `안녕, ${n}! 나는 평화의 비둘기 파스야. 우리는 지금 1950년대 전쟁의 기억 속에 들어와 있어. 평화의 지도 조각을 모아 "내일의 문"을 열어야 오늘로 돌아갈 수 있어!`,
      // 🔑 이야기: 내일의 문
      briefTitle: '임무: 오늘로 돌아가라!',
      brief: [
        '여러분은 1950년대, 6·25 전쟁의 기억 속으로 들어왔어요. 오늘로 돌아가는 길은 단 하나, "내일의 문"을 여는 것뿐이에요.',
        '그런데 문을 여는 "평화의 지도"가 12조각으로 찢어져 전쟁의 현장 곳곳에 흩어졌어요.',
        '작전 지점을 하나씩 지나며 지도 조각을 모으세요. 조각 2개가 모일 때마다 🔑 열쇠 낱말이 하나씩 나타나요.',
        '열쇠 낱말 6개로 콜롬비아 참전용사가 남긴 한 문장을 완성하면, 인천에서 문이 열려요!'
      ],
      briefGo: '임무 시작 ▶',
      routeTitle: '여정 지도: M → A → P → to Tomorrow',
      route: [
        ['M', 'Memory · 기억', '① 6·25 전쟁 ② 인천상륙작전', '전쟁의 기억을 되살려요'],
        ['A', 'Across · 연결', '③ 콜롬비아 출발 ~ ⑩ 판문점', '태평양을 건너온 콜롬비아 용사들과 함께 걸어요'],
        ['P', 'Peace · 평화', '⑪ 서해 ⑫ 참전기념비', '다시 인천에서, 오늘의 평화를 만나요'],
        ['🚪', 'to Tomorrow', '내일의 문 → 평화 다짐', '열쇠 낱말로 문을 열고 내일을 약속해요']
      ],
      keyListTitle: '지금까지 모은 열쇠 낱말과 기억의 조각',
      keyFrom: (a, b) => `${a}·${b}번에서`,
      // 조각 2개마다 나타나는 열쇠 낱말과 함께 읽는 '기억의 조각' (나타나는 차례대로)
      keyMemo: [
        '22개 나라가 대한민국을 도우러 왔어요. 인천상륙작전에서도 여러 나라 군인이 한 편이 되었지요. 남의 나라를 위해 함께 싸운 사람들을 우리는 형제라고 불러요.',
        '콜롬비아 용사들은 한 번도 가 본 적 없는 나라의 평화를 지키려고 태평양을 건넜어요.',
        '흑운토령과 금성 — 콜롬비아대대는 전쟁의 한가운데에서 싸웠어요.',
        '고지 위에서 콜롬비아 용사들과 유엔군은 서로의 목숨을 지켜 준 형제였어요.',
        '불모고지의 큰 희생 뒤, 1953년 7월 27일 정전협정으로 총소리가 멈췄어요. 그 기억 속 이름들을 우리가 기억해요.',
        '서해를 지킨 콜롬비아 해군, 그리고 인천에 서 있는 참전기념비. 기억은 오늘도 우리 곁에 있어요.'
      ],
      keyLabel: '🔑 열쇠 낱말',
      keyWords: ['전쟁', '속의', '형제,', '평화', '속의', '형제'],
      keyPop: (w) => `🔑 열쇠 낱말 발견: "${w}"`,
      gKey: (w, n, t) => `조각 2개가 모이자 열쇠 낱말이 나타났어: "${w}" (${n}/${t}) 잘 기억해 둬!`,
      gDoorReady: '평화의 지도를 다 모았어! 이제 열쇠 낱말 6개로 내일의 문을 열자.',
      doorTitle: '내일의 문',
      doorMeta: '열쇠 낱말 6개로 참전용사의 말을 완성하면 오늘로 돌아갈 수 있어요.',
      doorBtn: '🔑 내일의 문 열기 ▶',
      doorStory: '12번째 지도 조각을 맞추자, 인천의 참전기념비 앞에 오래된 문이 나타났어요. 문에는 빈칸 6개가 새겨져 있어요. 모은 열쇠 낱말을 순서대로 눌러 채워 보세요.',
      doorHint1: '콜롬비아 참전용사 하이메 알바레스 님이 한국 친구들에게 보낸 말이에요. 전쟁 때도, 평화로운 지금도 두 나라는 어떤 사이일까요?',
      doorHint2: '힌트: "○○ 속의 형제, ○○ 속의 형제"',
      doorWrong: '문이 꿈쩍도 하지 않아요… 다시 맞춰 봐요!',
      doorReset: '다시 놓기',
      doorOpen: '내일의 문이 열렸어요! 기억(M)을 되살리고, 바다 건너 이어진(A) 평화(P)의 지도를 완성했어요. 이제 오늘로 돌아가 참전용사님의 진짜 답장을 만나고, 마지막엔 내일(to Tomorrow)을 위한 나의 평화 다짐을 남겨요.',
      doorGo: '오늘로 돌아가기 ▶',
      gDoorOpen: '해냈다! 문이 열렸어. 오늘로 돌아가자!',
      gNext: (name) => `다음은 "${name}"! 깜빡이는 번호를 눌러 봐.`,
      gToColombia: 'M(기억)의 장을 지났어! 이제 A(Across·연결)의 장이야. 지구 반대편 콜롬비아에서 태평양을 건너온 용사들을 만나러 가자 🌎',
      gAllDone: '모든 작전 지점을 지났어! 참전용사님의 답장(엔딩)이 기다리고 있어.',
      gFind: '길 표시를 모두 숨겼어. 지도에서 직접 찾아봐!',
      gFindWrong: (d) => `아깝다! 조금 더 ${d}쪽이야.`,
      gFindRight: '찾았다! 정말 대단해!',
      gFindReveal: '바로 여기였어! 이제 기억해 두자.',
      gCard: (n) => `새 영웅 카드를 얻었어: ${n}!`,
      gMission: '캄캄한 밤바다야… 등대부터 켜 줘!',
      gMissionDone: '작전 성공! 네 덕분에 함대가 무사히 들어왔어!',
      gQuizRetry: '괜찮아, 한 번 더 골라 봐!',
      dirs: { N: '북', S: '남', E: '동', W: '서', NE: '북동', NW: '북서', SE: '남동', SW: '남서' },
      kFind: '미션: 지도에서 찾아라!',
      findTap: '👆 지도를 눌러 보세요',
      findLeft: (n) => `기회 ${n}번 남았어요`,
      kMission: '미션: 팔미도 등대를 켜라!',
      m1: '1950년 9월 15일, 자정을 막 넘긴 새벽. 캄캄한 바다에서 261척의 함대가 기다리고 있어요.',
      m2: '① 지도에서 팔미도 등대 🗼를 눌러 불을 켜세요.',
      m3: '② 바다 쪽부터 부표를 차례로 눌러 함대를 월미도까지 안내하세요. 갯벌 쪽 부표는 조심!',
      mLit: '등대에 불이 켜졌어요! 이제 바닷길의 부표를 찾아요.',
      mDecoy: '앗! 그쪽은 갯벌이에요. 배가 걸릴 뻔했어요!',
      mOrder: '그 부표는 아직이에요. 배에서 가까운 부표부터!',
      mProgress: (a, b) => `부표 ${a} / ${b}`,
      mSuccess: '작전 성공! 함대가 무사히 월미도에 도착했어요.',
      mRetry: '처음부터 다시 하기',
      quizRetry: '아쉬워요! 한 번 더 골라 볼까요?',
      albumTitle: '영웅 카드 도감',
      albumLead: (a, b) => `${b}장 중 ${a}장을 모았어요. 작전 지점을 돌며 영웅을 만나면 카드가 생겨요!`,
      albumWhere: (w) => `${w}에서 만날 수 있어요`,
      albumEnding: '엔딩',
      newCard: '새 영웅 카드!',
      ranks: [[0, '기억 탐험 새내기'], [300, '기억 탐험대원'], [600, '평화 탐험대장'], [900, '평화의 기억 지킴이'], [1083, '1,083명의 용사를 모두 기억한 평화의 별']],
      rankLine: (n, t, r) => `⭐ ${n.toLocaleString()} / ${t.toLocaleString()} · 칭호 「${r}」`,
      gHelloStars: '별 1,083개를 모아 봐! 1951년 태평양을 건너온 콜롬비아 용사 1,083명을 한 분씩 기억하는 별이야.',
      starInfoTitle: '평화의 별 1,083개',
      starInfoLead: '1951년, 콜롬비아대대 용사 1,083명이 태평양을 건너 한국에 왔어요. 별 하나하나가 그 용사 한 분을 기억하는 마음이에요. 미션마다 받는 별의 숫자에도 역사가 숨어 있어요!',
      starMine: (n, t) => `지금까지 ${n.toLocaleString()}개 / ${t.toLocaleString()}개`,
      starRows: [
        ['mission', '🔦 팔미도 등대 미션', '안내한 함대 261척'],
        ['find:war', '🎯 38도선 찾기', '38도선'],
        ['find:busan', '🎯 부산항 찾기', '6월 15일 부산 도착'],
        ['find:armistice', '🎯 판문점 찾기', '7월 27일 정전협정'],
        ['voyage', '🌏 태평양 항해', '25일 동안의 항해'],
        ['allies', '🗺️ 전쟁 흐름 끝까지 보기', '함께 싸운 22개 나라'],
        ['quiz', '❓ 추리 퀴즈 (12문제)', '처음 35 · 두 번째 15'],
        ['question', '✎ 질문 카드 (5장)', '한 장에 45'],
        ['op', '📍 인천 5대 작전 (5곳)', '한 곳에 10']
      ],
      starWhy: { mission: '함대 261척 안내!', 'find:war': '38도선을 찾았어요', 'find:busan': '6월 15일, 부산 도착', 'find:armistice': '7월 27일, 정전협정', voyage: '25일 동안의 항해', allies: '함께한 22개 나라' },
      glossTitle: '어려운 낱말 풀이',
      atlasOpen: '🗺️ 전체 지도',
      atlasClose: '✕ 전체 지도 닫기',
      atlasHint: '지도 위에 떠 있는 카드를 눌러 보세요. 아직 못 간 곳은 회색이에요.',
      atlasDoneHint: '🎉 평화의 지도 완성! 이제 지도 어디든 눌러 보세요.',
      placeGo: '이곳으로 가기 ▶',
      placeLocked: '🔒 아직 가 보지 않은 곳이에요. 여정을 따라가면 열려요!',
      placeDone: '✓ 지나온 곳',
      placeNext: '▶ 다음에 갈 곳',
      placeHeroes: '이곳에서 만나는 영웅 카드',
      placeOps: '이곳에서 있었던 작전',
      photoCredit: '사진',
      gAtlas: '전체 지도야! 떠 있는 카드를 눌러 봐.',
      albumSections: { co: '콜롬비아', kr: '대한민국', us: '유엔군' },
      albumTap: '모은 카드를 누르면 영웅의 업적을 볼 수 있어요.',
      deedsTitle: '업적',
      cardBy: (g) => `🎒 ${g}모둠이 조사한 영웅`,
      cardMet: (w) => `만난 곳: ${w}`,
      pieceLabel: '🧩 평화의 지도 조각',
      piecePop: '🧩 지도 조각을 찾았어요!',
      mapComplete: '🎉 평화의 지도가 완성됐어요!',
      gMapDone: (n) => `와! ${n}조각을 모두 모아 평화의 지도가 완성됐어!`,
      goldLabel: '금빛 카드',
      goldNew: '금빛 카드로 변신!',
      gGold: (n) => `대단해! ${n} 카드가 금빛으로 빛나!`,
      goldCount: (a, b) => `금빛 카드 ${a} / ${b}`,
      goldHowTitle: '금빛 카드로 만들려면?',
      goldHow: '이 작전 지점의 퀴즈·찾기·미션을 모두 첫 번째에 해내고, 질문 카드가 있으면 예상 답을 남겨요.',
      goldHowEnding: '질문 카드 5장에 모두 예상 답을 남기면 금빛이 돼요.',
      retryBtn: '다시 도전하기',
      gRetry: '다시 도전! 이번엔 첫 번째에 맞혀 보자. 모자랐던 별만큼 더 받을 수 있어.',
      watchNeed: '이 영상은 끝까지 봐야 [다음]으로 넘어갈 수 있어요. (빨리 감기는 안 세요)',
      watchNeedLink: '꼭 볼 영상이에요. 아래를 눌러 유튜브에서 끝까지 본 뒤, 돌아와서 [다 봤어요]를 눌러 주세요. (영상 길이만큼 시간이 지나야 눌려요)',
      watchDoneBtn: '✅ 다 봤어요',
      watchLeft: (t) => `${t} 뒤에 누를 수 있어요`,
      ytOpen: '유튜브에서 영상 보기 ↗',
      padletLinkHelp: '아래 버튼을 누르면 패들렛이 새 탭으로 열려요. ＋를 누르고 복사한 글이나 저장한 그림을 올려 주세요.',
      certLongPress: '그림을 길게 누르거나(태블릿·휴대폰) 오른쪽 클릭(컴퓨터) → "이미지 저장" 또는 "이미지 복사"를 고른 뒤 패들렛에 올려 주세요.',
      watchOther: (t) => `꼭 볼 영상 "${t}"을(를) 끝까지 봐야 다음으로 넘어갈 수 있어요.`,
      watchGo: '꼭 볼 영상으로 ▶',
      watchBadge: '꼭 보기',
      watchDone: '다 봤어요! 이제 [다음]으로 넘어가요.',
      watchSkip: '영상을 불러올 수 없어서 이번엔 그냥 넘어가요.',
      gWatchDone: '끝까지 봤구나! 다음으로 가 보자.',
      longTitle: '집에서 볼 긴 영상 (10분 넘음)',
      certTitle: '평화의 지도 완성 인증서',
      certLead: (n) => `${n} 님이 완성한 평화의 지도예요! 이름·학교·국적을 적고, 여정의 마지막 한 걸음으로 나의 평화 다짐을 한 줄 적어 주세요. 모두 인증서에 새겨지면 그림으로 저장해서 패들렛에 올릴 수 있어요.`,
      certNeedPledge: '이름·학교·국적·평화 다짐을 모두 적으면 인증서를 저장할 수 있어요.',
      certRealName: '이름',
      certRealNamePh: '예) 홍길동',
      certSchool: '학교',
      certSchoolPh: '예) ○○초등학교',
      certExample: (x) => `예) ${x}`,
      certNation: '국적',
      certNationPick: '골라 주세요',
      certNationOtherPh: '나라 이름을 적어 주세요',
      certPrivacy: '이름과 학교는 이 기기와 인증서 그림에만 들어가요. 여정 코드나 인터넷으로 보내지 않아요.',
      certPadletTitle: '패들렛 글 제목:',
      certTitleCopy: '제목 복사',
      certTitleCopied: '제목을 복사했어요! 패들렛 글의 제목 칸에 붙여 넣으세요.',
      certTap: '지도 위 도장을 눌러 보세요. 그곳 이름이 떠요.',
      certNameLabel: '평화의 지도를 완성한 사람',
      certStars: '평화의 별', certCards: '영웅 카드', certGold: '금빛 카드', certPieces: '지도 조각',
      certMyHero: '나의 영웅',
      certPledge: '나의 평화 다짐',
      certPledgePh: '예) 참전용사의 이야기를 가족에게 들려줄게요.',
      certGoldStamp: '금빛 도장 = 첫 시도에 완벽하게 해낸 작전 지점',
      certPerfect: '완벽!',
      certSave: '인증서 그림으로 저장',
      certCopy: '그림 복사 (패들렛에 붙여 넣기)',
      certShare: '공유 · 사진에 저장',
      certSaved: '저장했어요! 패들렛에서 ＋ → 이미지(파일) 올리기로 올려 보세요.',
      certCopied: '그림을 복사했어요! 패들렛에서 ＋를 누르고 붙여 넣으세요 (Ctrl+V).',
      certPadletHint: '패들렛에서 ＋ → 이미지(파일) 올리기로 저장한 그림을 올려 주세요.',
      certHow: '💡 컴퓨터: [그림 복사] → 패들렛에서 Ctrl+V · 태블릿/휴대폰: [저장] 또는 [공유]로 사진에 저장 → 패들렛에서 이미지 올리기',

      endTitle: '그날의 기억에서 돌아왔어요',
      endLead: '여러분이 참전용사께 드린 질문에, 참전용사님이 콜롬비아에서 영상으로 답을 보내 주셨어요. 내가 예상한 답과 진짜 답을 나란히 비교해 봐요.',
      endStatQuiz: (a, b) => `퀴즈 ${a} / ${b}`,
      endStatGuess: (a, b) => `예상 답 ${a} / ${b}`,
      endStart: '진짜 답 만나러 가기 ▶',
      endTip: '영상은 모두 합쳐 15분쯤이에요. 선생님과 함께 큰 화면으로 봐도 좋아요.',
      qLabel: (n, total) => `질문 ${n} / ${total}`,
      myGuessTitle: '내 예상',
      realTitle: '참전용사님의 진짜 답',
      noGuessYet: '아직 예상 답을 적지 않았어요. 영상을 보기 전에 한 줄 적어 볼까요?',
      saveHere: '적어 두기',
      videoSoon: '영상 준비 중이에요',
      videoSoonSub: '선생님이 곧 영상을 넣어 주실 거예요. 아래 요약을 먼저 읽어 봐요.',
      summaryLabel: '답변 요약',
      summaryNote: '영상 속 말씀을 짧게 줄여 옮겼어요.',
      reactQ: '내 예상과 비교해 보니…',
      reacts: [['same', '🙂 비슷했어요'], ['diff', '😮 달랐어요'], ['new', '💡 새로 알게 됐어요']],
      moreTitle: '더 알아보기',
      moreLead: '국가보훈부가 만든 자료에서 참전용사들의 이야기를 더 찾아볼 수 있어요.',
      worksTitle: '친구들이 만든 모둠 작품',
      finishTitle: '평화의 기억 지킴이',
      finishText: (n) => `${n} 님은 지구 반대편에서 온 콜롬비아 참전용사들의 발자취를 끝까지 따라갔어요. 그분들의 기억을 오늘의 평화로 이어 가는 사람이 바로 여러분이에요.`,
      finishQuote: '“전쟁 속의 형제, 평화 속의 형제.”',
      finishQuoteBy: '— 하이메 알바레스 님의 답변 중에서',
      toMapBtn: '지도로 돌아가기',
      toStartBtn: '처음 화면으로',
      showCodeBtn: '🔑 나의 여정 코드',
      endingPreview: '🎬 엔딩',
      prev: '◀ 이전',
      next: '다음 ▶',
      toMap: '지도로 ▶',
      close: '닫기',
      kStory: '그곳에서 있었던 일',
      kTimeline: '전쟁의 흐름 한눈에 보기',
      kHero: '위인전 카드',
      kQuiz: '추리 퀴즈',
      kQuestion: '질문 카드',
      kVideo: '영상으로 보기',
      videoGroup: (g) => `${g}모둠이 찾은 영상`,
      videoLong: '긴 영상이에요. 앞부분만 보거나 집에서 보세요.',
      videoPick: '다른 영상',
      videoOptional: '영상은 골라서 봐도 돼요.',
      onYoutube: 'YouTube에서 보기 ↗',
      tlHint: '하나씩 눌러 보세요. 지도 위 전선이 움직여요!',
      tlPlay: '▶ 차례로 보기',
      tlStop: '■ 멈추기',
      legendNorth: '북한군·중국군이 차지한 곳',
      legendFront: '전선',
      legendSouth: '국군·유엔군',
      mapHome: '지도 전체 보기',
      worldCol: '콜롬비아',
      worldKor: '대한민국',
      worldPacific: '태 평 양',
      worldDist: '직선거리만 약 15,000km',
      worldVoyage: '태평양을 건너 한국으로',
      kOps: '친구들이 만든 인천 지도',
      opsHint: '지도 위 번호나 아래 목록을 눌러 보세요. 친구들이 조사한 인천상륙작전 5대 작전이에요!',
      opsBy: (g) => `🎒 ${g}모둠 친구들이 조사했어요`,
      opsSeen: (n, t) => `${t}곳 중 ${n}곳 살펴봤어요`,
      opsHeroes: '이 작전의 영웅',
      opsWorks: '모둠 사이트 보기 ↗',
      groupN: (g) => `${g}모둠`,
      inchRoute: '함대가 들어온 바닷길',
      inchSeoul: '서울로 →',
      inchMemorial: '경명공원 기념비',
      inchCity: '인천',
      inchNames: { ganghwa: '강화도', yeongjong: '영종도', wolmi: '월미도', palmi: '팔미도', yeongheung: '영흥도', daebu: '대부도', gyodong: '교동도', sea: '서 해' },
      openPadlet: '📋 복사하고 패들렛 열기',
      padletPopup: '패들렛이 새 창으로 열렸어요. ＋를 누르고 붙여 넣으세요.',
      popupBlocked: '새 창이 막혔어요. 아래 주소를 눌러 열어 주세요.',
      openWork: '모둠 작품 보러 가기 ↗',
      quizHint: '몰라도 괜찮아요! 골라 보고 정답을 확인해 봐요. (안 풀고 넘어가도 돼요)',
      right: '정답이에요!',
      wrong: '아쉬워요! 정답은…',
      stamp: '통과!',
      doneTitle: (name) => `"${name}" 작전 지점 통과`,
      nextStop: (name) => `다음 작전 지점은 "${name}"이에요.`,
      lastStop: '마지막 작전 지점까지 모두 지났어요!',
      preview: '미리 보기',

      askedBy: (name) => `${name} 학생이 참전용사께 드린 질문`,
      qIntro: '6학년 친구가 콜롬비아 참전용사께 진짜로 보낸 질문이에요. 참전용사님은 뭐라고 답하셨을까요?',
      showEn: '영어 원문 보기',
      myGuessLabel: '참전용사님은 이렇게 답하실 것 같아요',
      guessPh: '내가 참전용사라면…',
      saveGuess: '방명록에 남기기',
      editGuess: '고쳐서 다시 남기기',
      saved: '방명록에 남겼어요!',
      emptyGuess: '한 줄이라도 적어 볼까요?',
      skipGuess: '생각이 안 나면 그냥 넘어가도 돼요. 방명록에서 친구들 생각을 먼저 봐도 좋아요.',
      othersTitle: '이 기기에서 친구들이 남긴 생각',
      noOthers: '아직 아무도 남기지 않았어요. 첫 번째 주인공이 되어 볼까요?',

      guestbookTitle: '우리 방명록',
      gbIntro: '참전용사께 드린 질문에 친구들이 "이렇게 답하실 것 같아요"라고 남긴 생각이에요.',
      gbDevice: '이 기기에서 남긴 글만 보여요. 우리 반 모두의 생각은 온라인 게시판에 모아요.',
      gbMine: '내 답 모두 복사하기',
      gbBoard: '패들렛 새 창으로 열기 ↗',
      padletTitle: '우리 반 패들렛',
      padletHint: '① [복사하기]를 누르고 → ② 패들렛의 ＋ 버튼을 눌러 → ③ 붙여 넣기(길게 누르기 또는 Ctrl+V) 하면 반 친구들과 함께 볼 수 있어요.',
      toPadlet: '📋 복사해서 패들렛에 올리기',
      padletCopied: '복사했어요! 방명록의 패들렛에서 ＋를 누르고 붙여 넣으세요.',
      deviceList: '이 기기에서 남긴 생각',
      copied: '복사했어요! 게시판에 붙여 넣으세요.',
      copyFail: '복사가 막혀 있어요. 아래 글을 길게 눌러 복사해 주세요.',
      noMine: '아직 남긴 답이 없어요.',
      you: '나',

      codeTitle: '나의 여정 코드',
      codeGuide: '이 코드를 적어 두면 다른 기기에서도 이어서 할 수 있어요. 선생님께 결과를 알려 드릴 때도 이 코드를 보여 주세요.',
      codeNote: '※ 방명록에 쓴 글은 코드에 담기지 않아요. (글은 이 기기에만 남아요)',
      codeChip: '🔑 코드',
      savedToast: '💾 저장됐어요 — 위쪽 [🔑 코드]로 다른 기기에서도 이어 할 수 있어요',
      playerChip: (p) => `${p.nick} ▾`,

      teacherTitle: '선생님 화면',
      teacherNote: '여기서 보는 기록은 모두 이 기기 안에만 있어요. 인터넷으로 보내지 않아요.',
      back: '‹ 처음 화면으로',
      rosterTitle: '학생 결과 모으기',
      rosterGuide: '학생의 "나의 여정 코드"만 넣어도 진행 정도와 퀴즈 결과가 보여요. 닉네임은 선택이에요. 코드 여러 개를 한꺼번에 붙여 넣어도 돼요 (띄어쓰기·줄바꿈으로 구분).',
      rosterAdd: '명단에 추가',
      reportNote: '📡 게임 진행 상황(닉네임·여정 코드·별)은 선생님께 자동으로 전달돼요. 실명이나 학교는 보내지 않아요.',
      feedbackBtn: '게임 소감 남기기 (설문)',
      surveyNext: '📝 마지막: 소감 남기기 ▶',
      surveyTitle: '마지막 한 걸음: 게임 소감 남기기',
      surveyLead: '평화의 지도 여행은 어땠나요? 솔직한 소감을 남겨 주면 더 좋은 게임을 만드는 데 쓸게요. (약 3분)',
      surveyHelp: '설문이 잘 안 보이면',
      surveyOpen: '새 창에서 설문 열기',
      surveyThanks: '끝까지 함께해 줘서 고마워요. 오늘 기억한 이야기를 내일의 평화로 이어 가요!',
      rosterNickOpt: '닉네임 (선택)',
      rosterCodePh: 'ABC-123 (여러 개 가능)',
      rosterBad: (list) => `잘못된 코드는 빼고 넣었어요: ${list}`,
      rosterAdded: (n) => `${n}명을 명단에 넣었어요.`,
      rosterEmpty: '아직 추가된 학생이 없어요.',
      rosterCopy: '📋 표로 복사 (엑셀에 붙여 넣기)',
      rosterCopied: '표를 복사했어요. 엑셀이나 한글에 붙여 넣으세요.',
      rosterClear: '명단 모두 지우기',
      rosterClearQ: '명단을 모두 지울까요? 되돌릴 수 없어요.',
      rosterHead: ['닉네임', '진행', '퀴즈 정답', '작전 지점별 퀴즈', '코드', '넣은 날짜'],
      del: '지우기',
      deviceGbTitle: '이 기기의 방명록',
      deviceGbGuide: '이 기기에서 학생들이 남긴 예상 답변을 모아 볼 수 있어요.',
      gbOpen: '방명록 보기',
      gbCopyAll: '📋 모두 복사',
      gbDownload: '💾 글 파일로 저장',
      previewTitle: '작전 지점 미리 보기',
      previewGuide: '순서와 상관없이 작전 지점을 열어 볼 수 있어요. 기록은 남지 않아요.',
      manageTitle: '저장 기록 관리',
      savedCount: (n) => `이 기기에 저장된 여정 ${n}개`,
      clearDevice: '이 기기의 여정·방명록 모두 지우기',
      clearQ: '이 기기에 저장된 여정과 방명록 글을 모두 지울까요? 되돌릴 수 없어요.',
      yesDelete: '네, 지울게요',
      cancel: '아니요',
      cleared: '모두 지웠어요.',
      pwMakeTitle: '비밀번호 바꾸기 값 만들기',
      pwNew: '새 비밀번호',
      pwHashOut: (h) => `js/data.js 의 teacherPasswordHash 를 '${h}' 로 바꿔 주세요.`,

      mapAria: '콜롬비아대대의 여정 지도',
      seaW: '서 해', seaE: '동 해', seaS: '남 해',
      line38: '38도선', dmz: '휴전선', fromCol: '지구 반대편 콜롬비아에서',
      pyongyang: '평양'
    },
    es: {
      subtitle: 'El mapa de la memoria, la conexión y la paz',
      narration: ['En 1950 estalló una guerra en la península de Corea.', 'Al otro lado del mundo, en Colombia, un joven subió a un barco.', 'Entremos en los recuerdos de aquel día.'],
      startTagline: 'Memoria · Conexión · Paz: un mapa para dibujar un mañana en paz',
      startLead: 'Del Desembarco de Incheon a las batallas del Batallón Colombia, la Armada colombiana en el Mar Amarillo y el monumento de Incheon: recorre los 12 puntos de misión y completa el mapa de la paz.',
      mapLetters: [
        ['M', 'Memory · Memoria', 'Recordamos a los héroes de la historia'],
        ['A', 'Across · Conexión', 'Corea y Colombia se encuentran más allá de las fronteras'],
        ['P', 'Peace · Paz', 'Dibujamos juntos un mapa de la paz']
      ],
      mapTo: '→ to Tomorrow: con ese mapa dibujamos juntos un mañana en paz',
      aboutTitle: '💡 ¿Por qué hicimos este juego?',
      about: [
        'Este mapa de la paz nace de las investigaciones de los estudiantes de 6.º grado de la Escuela Primaria Singeomdan, en Incheon (Corea del Sur), y está pensado para compartirlo con nuestros amigos de Colombia.',
        'Nuestra escuela está en el distrito de Seo-gu, en Incheon. En ese mismo distrito, en el parque Gyeongmyeong, se levanta el monumento a los soldados colombianos. Colombia fue el único país de América Latina que envió tropas de combate a la Guerra de Corea, y en el monumento están grabadas las batallas de Heukuntoryeong y Kumsong.',
        'El Desembarco de Incheon (1950) ocurrió antes de que llegara el Batallón Colombia. Pero esa operación, que empezó en nuestra ciudad, cambió el rumbo de la guerra; después, los soldados colombianos llegaron desde el otro lado del mundo para luchar en las colinas, y la Armada colombiana protegió el Mar Amarillo. Unimos toda esa historia en un solo mapa que empieza y termina en Incheon.'
      ],
      aboutGoals: [
        'Recordar el sacrificio de los veteranos y entender que la paz no llegó sola.',
        'Compartir esta memoria entre estudiantes de Corea y Colombia y conectarnos más allá de las fronteras.',
        'Al final, escribir nuestro compromiso de paz en un certificado y prometer juntos un mañana en paz.'
      ],
      aboutGoalsTitle: 'Con este juego queremos',
      savedTitle: 'Viajes guardados en este dispositivo',
      continue: 'Continuar ▶',
      newTitle: 'Empezar de nuevo',
      nickLabel: 'Apodo',
      nickGuide: 'Usa un apodo, no tu nombre real: en internet, es una forma sencilla de proteger tus datos personales.',
      startBtn: 'Empezar el viaje ▶',
      needNick: 'Escribe tu apodo.',
      tooLong: (n) => `El apodo puede tener hasta ${n} letras.`,
      banned: 'Este juego rinde homenaje a los veteranos. Elige un apodo respetuoso, sin groserías ni palabras ofensivas.',
      nickShort: 'El apodo debe tener al menos dos letras.',
      nickChars: 'El apodo solo puede tener letras y números (sin emojis ni símbolos).',
      nickJamo: 'No puedes usar consonantes o vocales coreanas sueltas (como ㅋ o ㅗ).',
      nickRepeat: 'No se permiten apodos con letras o risas repetidas (como jajaja o aaa). Elige un nombre que te represente.',
      textBad: 'El texto contiene palabras ofensivas. Escríbelo de nuevo con respeto.',
      textRepeat: 'Evita expresiones como ㅋㅋ o jaja y escríbelo con seriedad.',
      nickExists: (n) => `Ya hay un viaje de "${n}" en este dispositivo. Pulsa [Continuar] en la lista de arriba o elige otro apodo.`,
      breakTitle: 'Hasta aquí la 1.ª clase',
      breakText: 'Continuaremos en la próxima clase. Como quizá uses otro dispositivo, anota este código en tu cuaderno.',
      backTeacher: '‹ Volver a la pantalla docente',
      resumeTitle: 'Continuar un viaje de otro dispositivo',
      resumeHelp: 'Escribe tu apodo y el código de 6 letras del botón [🔑 Código].',
      codeLabel: 'Mi código de viaje',
      resumeBtn: 'Continuar con el código ▶',
      badCode: 'El código no es correcto. Revisa las letras.',
      teacherOpen: '🔒 Para docentes',
      teacherGuide: 'Con la contraseña puedes reunir resultados, ver el libro de visitas y abrir cualquier punto de misión.',
      password: 'Contraseña',
      enter: 'Entrar',
      wrongPw: 'La contraseña no es correcta.',

      journey: 'Mi viaje',
      chPrologue: 'Prólogo · La guerra',
      chIncheon: 'Desembarco de Incheon',
      chJourney: 'Las batallas del Batallón Colombia',
      chReturn: 'De vuelta a Incheon · El mar de la memoria',
      gToIncheon: 'Cerramos el capítulo A (Across). Empieza el último, P (Peace): volvemos a Incheon, al Mar Amarillo que protegió la Armada colombiana y al monumento de hoy.',
      lensTitle: 'Lupa de Incheon',
      nowEyebrow: (i, n) => `Próximo punto de misión · ${i} / ${n}`,
      enterStation: 'Entrar al punto de misión ▶',
      allDone: 'Completaste todos los puntos de misión',
      allDoneMeta: 'Ahora descubre qué respondieron realmente los veteranos.',
      toEnding: '🎬 Final: las respuestas reales ▶',
      guestbookBtn: '✎ Ver nuestro libro de visitas',

      langBtn: 'KO · 한국어',
      starChip: (n) => `⭐ ${n}`,
      cardChip: (a, b) => `🎴 ${a}/${b}`,
      starPop: (n) => `+${n} ⭐`,
      gHello: (n) => `Hola, ${n}. Soy Paz, la paloma de la paz. Estamos atrapados en la memoria de la guerra de los años cincuenta: solo volveremos al presente si reunimos el mapa de la paz y abrimos la "Puerta del Mañana".`,
      briefTitle: 'Misión: volver al presente',
      brief: [
        'Has entrado en la memoria de la Guerra de Corea, en los años cincuenta. Solo hay una forma de volver al presente: abrir la "Puerta del Mañana".',
        'El "mapa de la paz" que abre esa puerta se rompió en 12 piezas, dispersas por los escenarios de la guerra.',
        'Recorre los puntos de misión y recupera cada pieza. Cada dos piezas aparece una 🔑 palabra clave.',
        'Con las 6 palabras clave tendrás que reconstruir una frase que dejó un veterano colombiano. Si lo logras, la puerta se abrirá en Incheon.'
      ],
      briefGo: 'Aceptar la misión ▶',
      routeTitle: 'Ruta del viaje: M → A → P → to Tomorrow',
      route: [
        ['M', 'Memory · Memoria', '① Guerra de Corea ② Incheon', 'Recuperar la memoria de la guerra'],
        ['A', 'Across · Conexión', '③ Colombia – ⑩ Panmunjom', 'Recorrer el camino del Batallón Colombia'],
        ['P', 'Peace · Paz', '⑪ Mar Amarillo ⑫ Monumento', 'Volver a Incheon y encontrar la paz de hoy'],
        ['🚪', 'to Tomorrow', 'Puerta del Mañana → compromiso', 'Abrir la puerta y comprometerse con el mañana']
      ],
      keyListTitle: 'Palabras clave y fragmentos de memoria reunidos',
      keyFrom: (a, b) => `puntos ${a} y ${b}`,
      keyMemo: [
        'Veintidós países acudieron en ayuda de Corea del Sur, y en el Desembarco de Incheon combatieron juntos soldados de varias naciones. A quienes lucharon por un país ajeno los llamamos hermanos.',
        'Los soldados colombianos cruzaron el Pacífico para defender la paz de un país que nunca habían visto.',
        'Heukuntoryeong y Kumsong: el Batallón Colombia combatió en pleno corazón de la guerra.',
        'En las colinas, los soldados colombianos y las demás tropas de la ONU se protegieron la vida unos a otros, como hermanos.',
        'Tras el gran sacrificio de Old Baldy, el armisticio del 27 de julio de 1953 silenció las armas. Nos toca recordar los nombres que quedaron en esa memoria.',
        'La Armada colombiana en el Mar Amarillo y el monumento de Incheon: la memoria sigue viva hoy, a nuestro lado.'
      ],
      keyLabel: '🔑 Palabras clave',
      keyWords: ['Hermanos', 'en la', 'guerra,', 'hermanos', 'en la', 'paz.'],
      keyPop: (w) => `🔑 Palabra clave: «${w}»`,
      gKey: (w, n, t) => `Al unir dos piezas apareció una palabra clave: «${w}» (${n}/${t}). No la olvides.`,
      gDoorReady: 'El mapa de la paz está completo. Ahora usa las 6 palabras clave para abrir la Puerta del Mañana.',
      doorTitle: 'La Puerta del Mañana',
      doorMeta: 'Reconstruye la frase del veterano con las 6 palabras clave para volver al presente.',
      doorBtn: '🔑 Abrir la Puerta del Mañana ▶',
      doorStory: 'Al encajar la última pieza, frente al monumento de Incheon aparece una puerta antigua con seis espacios grabados. Ordena las palabras clave que reuniste.',
      doorHint1: 'Es un mensaje que el veterano colombiano Jaime Álvarez envió a los estudiantes coreanos. ¿Qué une a los dos países, tanto en la guerra como hoy en paz?',
      doorHint2: 'Pista: «Hermanos en la ___, hermanos en la ___».',
      doorWrong: 'La puerta no cede. Revisa el orden e inténtalo de nuevo.',
      doorReset: 'Reiniciar',
      doorOpen: 'La Puerta del Mañana se abrió. Recuperaste la memoria (M), cruzaste el océano (A) y completaste el mapa de la paz (P). Ahora vuelves al presente: te esperan las respuestas reales de los veteranos y, al final, tu propio compromiso de paz para el mañana (to Tomorrow).',
      doorGo: 'Volver al presente ▶',
      gDoorOpen: 'Lo lograste: la puerta está abierta. Volvamos al presente.',
      gNext: (name) => `Próximo destino: "${name}". Toca el número que parpadea.`,
      gToColombia: 'Terminaste el capítulo M (Memory). Ahora comienza A (Across): cruzamos al otro lado del mundo para acompañar a los soldados colombianos que atravesaron el Pacífico. 🌎',
      gAllDone: 'Completaste todos los puntos de misión. En el final te esperan las respuestas de los veteranos.',
      gFind: 'Oculté las pistas del mapa. Esta vez te toca ubicarlo a ti.',
      gFindWrong: (d) => `Cerca. Prueba un poco más al ${d}.`,
      gFindRight: 'Exacto, lo encontraste. Buen ojo.',
      gFindReveal: 'Era aquí. Ahora ya sabes dónde queda.',
      gCard: (n) => `Nueva tarjeta de héroe: ${n}.`,
      gMission: 'El mar está a oscuras. Primero hay que encender el faro.',
      gMissionDone: 'Misión cumplida: gracias a ti, la flota llegó a salvo.',
      gQuizRetry: 'Tranquilo, tienes otra oportunidad.',
      dirs: { N: 'norte', S: 'sur', E: 'este', W: 'oeste', NE: 'noreste', NW: 'noroeste', SE: 'sureste', SW: 'suroeste' },
      kFind: 'Misión: ubícalo en el mapa',
      findTap: '👆 Toca el mapa',
      findLeft: (n) => `Te quedan ${n} intentos`,
      kMission: 'Misión: enciende el faro de Palmido',
      m1: '15 de septiembre de 1950, medianoche. En el mar oscuro esperan 261 barcos.',
      m2: '① Toca el faro de Palmido 🗼 en el mapa para encenderlo.',
      m3: '② Toca las boyas en orden, desde el mar abierto, para guiar la flota hasta Wolmido. Cuidado con las boyas que marcan las marismas.',
      mLit: 'El faro ya está encendido. Ahora sigue las boyas del canal.',
      mDecoy: 'Eso es marisma: el barco estuvo a punto de encallar.',
      mOrder: 'Esa boya todavía no. Primero, la más cercana al barco.',
      mProgress: (a, b) => `Boyas ${a} / ${b}`,
      mSuccess: 'Misión cumplida: la flota llegó a salvo a Wolmido.',
      mRetry: 'Empezar de nuevo',
      quizRetry: 'Casi. ¿Lo intentas otra vez?',
      albumTitle: 'Álbum de tarjetas de héroes',
      albumLead: (a, b) => `Tienes ${a} de ${b} tarjetas. Conoce a los héroes de cada punto de misión para completar el álbum.`,
      albumWhere: (w) => `Se encuentra en: ${w}`,
      albumEnding: 'el final',
      newCard: 'Nueva tarjeta de héroe',
      ranks: [[0, 'Explorador novato'], [300, 'Explorador de la memoria'], [600, 'Capitán de la paz'], [900, 'Guardián de la memoria y la paz'], [1083, 'Estrella de la paz: recordaste a los 1.083 soldados']],
      rankLine: (n, t, r) => `⭐ ${n.toLocaleString('es')} / ${t.toLocaleString('es')} · Título «${r}»`,
      gHelloStars: 'Tu objetivo: reunir 1.083 estrellas, una por cada uno de los 1.083 soldados colombianos que cruzaron el Pacífico en 1951.',
      starInfoTitle: '1.083 estrellas de la paz',
      starInfoLead: 'En 1951, 1.083 soldados del Batallón Colombia cruzaron el Pacífico hasta Corea. Cada estrella recuerda a uno de ellos, y las cifras de cada misión también esconden un dato histórico.',
      starMine: (n, t) => `Llevas ${n.toLocaleString('es')} de ${t.toLocaleString('es')}`,
      starRows: [
        ['mission', '🔦 Misión del faro de Palmido', '261 barcos guiados'],
        ['find:war', '🎯 Encontrar el paralelo 38', 'El paralelo 38'],
        ['find:busan', '🎯 Encontrar Busan', 'Llegada el 15 de junio'],
        ['find:armistice', '🎯 Encontrar Panmunjom', 'Armisticio del 27 de julio'],
        ['voyage', '🌏 Viaje por el Pacífico', '25 días de viaje'],
        ['allies', '🗺️ Ver toda la guerra', '22 países aliados'],
        ['quiz', '❓ Quiz (12 preguntas)', '35 a la primera · 15 a la segunda'],
        ['question', '✎ Tarjetas de pregunta (5)', '45 cada una'],
        ['op', '📍 5 operaciones de Incheon', '10 cada una']
      ],
      starWhy: { mission: '261 barcos guiados', 'find:war': 'Encontraste el paralelo 38', 'find:busan': '15 de junio, llegada a Busan', 'find:armistice': '27 de julio, armisticio', voyage: '25 días de viaje', allies: '22 países aliados' },
      glossTitle: 'Glosario',
      atlasOpen: '🗺️ Mapa completo',
      atlasClose: '✕ Cerrar mapa completo',
      atlasHint: 'Toca las tarjetas que flotan sobre el mapa. Los lugares que aún no visitaste están en gris.',
      atlasDoneHint: '🎉 Mapa de la paz completo. Ahora puedes tocar cualquier parte del mapa.',
      placeGo: 'Ir a este lugar ▶',
      placeLocked: '🔒 Aún no has visitado este lugar. Se desbloqueará a medida que avances.',
      placeDone: '✓ Ya visitado',
      placeNext: '▶ Tu próximo destino',
      placeHeroes: 'Tarjetas de héroes de este lugar',
      placeOps: 'Operaciones en este lugar',
      photoCredit: 'Foto',
      gAtlas: 'Este es el mapa completo. Toca las tarjetas flotantes para explorarlo.',
      albumSections: { co: 'Colombia', kr: 'Corea del Sur', us: 'Fuerzas de la ONU' },
      albumTap: 'Toca una tarjeta para ver lo que hizo cada héroe.',
      deedsTitle: 'Lo que hizo',
      cardBy: (g) => `🎒 Investigado por el Grupo ${g}`,
      cardMet: (w) => `Dónde lo conociste: ${w}`,
      pieceLabel: '🧩 Piezas del mapa de la paz',
      piecePop: '🧩 Encontraste una pieza del mapa',
      mapComplete: '🎉 Completaste el mapa de la paz',
      gMapDone: (n) => `Reuniste las ${n} piezas: el mapa de la paz está completo.`,
      goldLabel: 'Carta dorada',
      goldNew: 'Ahora es dorada',
      gGold: (n) => `Excelente: la carta de ${n} ahora brilla en dorado.`,
      goldCount: (a, b) => `Cartas doradas ${a} / ${b}`,
      goldHowTitle: '¿Cómo se vuelve dorada?',
      goldHow: 'Logra al primer intento el quiz, la búsqueda y la misión de este punto, y si hay tarjeta de pregunta, deja tu respuesta.',
      goldHowEnding: 'Deja tu respuesta en las 5 tarjetas de pregunta y se volverá dorada.',
      retryBtn: 'Intentar de nuevo',
      gRetry: 'Otra oportunidad: si aciertas al primer intento, recuperas las estrellas que te faltaron.',
      watchNeed: 'Mira este video hasta el final para pasar a [Siguiente]. (Adelantar no cuenta)',
      watchNeedLink: 'Video obligatorio: ábrelo en YouTube, míralo completo y vuelve para pulsar [Ya lo vi]. (El botón se activa cuando pasa el tiempo del video)',
      watchDoneBtn: '✅ Ya lo vi',
      watchLeft: (t) => `Disponible en ${t}`,
      ytOpen: 'Ver el video en YouTube ↗',
      padletLinkHelp: 'Pulsa el botón para abrir el Padlet en otra pestaña. Luego pulsa ＋ y pega el texto copiado o sube la imagen guardada.',
      certLongPress: 'Mantén pulsada la imagen (tableta/celular) o haz clic derecho (computador) → "Guardar imagen" o "Copiar imagen", y súbela al Padlet.',
      watchOther: (t) => `Mira el video obligatorio "${t}" hasta el final para continuar.`,
      watchGo: 'Ir al video obligatorio ▶',
      watchBadge: 'Obligatorio',
      watchDone: 'Video completo. Ya puedes pasar a [Siguiente].',
      watchSkip: 'No se pudo cargar el video, así que esta vez puedes seguir.',
      gWatchDone: 'Lo viste hasta el final. Sigamos.',
      longTitle: 'Videos largos para ver en casa (más de 10 min)',
      certTitle: 'Certificado del Mapa de la Paz',
      certLead: (n) => `Este es el mapa de la paz que completó ${n}. Escribe tu nombre, tu colegio y tu nacionalidad y, como último paso del viaje, una frase con tu compromiso de paz. Cuando todo aparezca en el certificado, podrás guardarlo como imagen y subirlo al Padlet.`,
      certNeedPledge: 'Completa nombre, colegio, nacionalidad y compromiso de paz para guardar el certificado.',
      certRealName: 'Nombre',
      certRealNamePh: 'Ej.: María Gómez',
      certSchool: 'Colegio',
      certSchoolPh: 'Ej.: Colegio San José',
      certExample: (x) => `Ej.: ${x}`,
      certNation: 'Nacionalidad',
      certNationPick: 'Elige una opción',
      certNationOtherPh: 'Escribe el nombre del país',
      certPrivacy: 'Tu nombre y tu colegio solo quedan en este dispositivo y en la imagen del certificado. No van en el código ni se envían por internet.',
      certPadletTitle: 'Título para el Padlet:',
      certTitleCopy: 'Copiar título',
      certTitleCopied: 'Título copiado. Pégalo en el título de tu publicación del Padlet.',
      certTap: 'Toca los sellos del mapa para ver el nombre de cada lugar.',
      certNameLabel: 'Completó el mapa de la paz',
      certStars: 'Estrellas', certCards: 'Tarjetas', certGold: 'Doradas', certPieces: 'Piezas',
      certMyHero: 'Mi héroe',
      certPledge: 'Mi compromiso de paz',
      certPledgePh: 'Ej.: Contaré la historia de los veteranos a mi familia.',
      certGoldStamp: 'Sello dorado = punto superado a la perfección al primer intento',
      certPerfect: 'Perfecto',
      certSave: 'Guardar el certificado como imagen',
      certCopy: 'Copiar imagen (pegar en Padlet)',
      certShare: 'Compartir · Guardar en fotos',
      certSaved: 'Guardado. En Padlet pulsa ＋ y sube la imagen.',
      certCopied: 'Imagen copiada. En Padlet pulsa ＋ y pega (Ctrl+V).',
      certPadletHint: 'En Padlet pulsa ＋ y sube la imagen que guardaste.',
      certHow: '💡 Computador: [Copiar imagen] → Ctrl+V en Padlet · Tableta/celular: [Guardar] o [Compartir] → sube la imagen en Padlet',

      endTitle: 'Volvimos de los recuerdos de aquel día',
      endLead: 'Desde Colombia, los veteranos respondieron en video a las preguntas de estudiantes coreanos de 6.º grado. Compara tu hipótesis con su respuesta real.',
      endStatQuiz: (a, b) => `Quiz ${a} / ${b}`,
      endStatGuess: (a, b) => `Respuestas ${a} / ${b}`,
      endStart: 'Ver las respuestas reales ▶',
      endTip: 'Los videos duran unos 15 minutos en total. Pueden verlos juntos en la pantalla grande.',
      qLabel: (n, total) => `Pregunta ${n} / ${total}`,
      myGuessTitle: 'Lo que yo pensé',
      realTitle: 'La respuesta real del veterano',
      noGuessYet: 'Aún no has escrito tu respuesta. ¿Por qué no escribes una línea antes de ver el video?',
      saveHere: 'Guardar',
      videoSoon: 'Video en preparación',
      videoSoonSub: 'Tu docente pondrá el video pronto. Lee primero el resumen.',
      summaryLabel: 'Resumen de la respuesta',
      summaryNote: 'Resumimos brevemente las palabras del video.',
      reactQ: 'Comparando con lo que pensé…',
      reacts: [['same', '🙂 Parecido'], ['diff', '😮 Diferente'], ['new', '💡 Aprendí algo nuevo']],
      moreTitle: 'Para saber más',
      moreLead: 'Descubre más historias de los veteranos en los recursos del Ministerio de Patriotas y Veteranos de Corea.',
      worksTitle: 'Trabajos de los grupos',
      finishTitle: 'Guardián de la memoria y la paz',
      finishText: (n) => `${n} siguió hasta el final los pasos de los veteranos colombianos que vinieron desde el otro lado del mundo. Tú eres quien lleva sus recuerdos a la paz de hoy.`,
      finishQuote: '“Hermanos en la guerra, hermanos en la paz.”',
      finishQuoteBy: '— de la respuesta de Jaime Álvarez',
      toMapBtn: 'Volver al mapa',
      toStartBtn: 'Ir al inicio',
      showCodeBtn: '🔑 Mi código de viaje',
      endingPreview: '🎬 Final',
      prev: '◀ Atrás',
      next: 'Siguiente ▶',
      toMap: 'Al mapa ▶',
      close: 'Cerrar',
      kStory: 'Qué pasó aquí',
      kTimeline: 'La guerra de un vistazo',
      kHero: 'Tarjeta biográfica',
      kQuiz: 'Ponte a prueba',
      kQuestion: 'Tarjeta de pregunta',
      kVideo: 'Ver en video',
      videoGroup: (g) => `Video encontrado por el Grupo ${g}`,
      videoLong: 'Es un video largo. Mira el comienzo o termínalo en casa.',
      videoPick: 'Otros videos',
      videoOptional: 'Puedes elegir qué videos ver.',
      onYoutube: 'Ver en YouTube ↗',
      tlHint: 'Toca cada momento y observa cómo se desplaza el frente en el mapa.',
      tlPlay: '▶ Ver en orden',
      tlStop: '■ Parar',
      legendNorth: 'Corea del Norte y China',
      legendFront: 'Frente',
      legendSouth: 'Corea del Sur y ONU',
      mapHome: 'Ver todo el mapa',
      worldCol: 'Colombia',
      worldKor: 'Corea del Sur',
      worldPacific: 'O c é a n o   P a c í f i c o',
      worldDist: 'Unos 15.000 km en línea recta',
      worldVoyage: 'Cruzando el Pacífico hacia Corea',
      kOps: 'Incheon según los estudiantes coreanos',
      opsHint: 'Toca los números del mapa o la lista: son las 5 operaciones de Incheon que investigaron los estudiantes coreanos.',
      opsBy: (g) => `🎒 Investigado por el Grupo ${g}`,
      opsSeen: (n, t) => `Viste ${n} de ${t} lugares`,
      opsHeroes: 'Héroes de esta operación',
      opsWorks: 'Ver la página del grupo ↗',
      groupN: (g) => `Grupo ${g}`,
      inchRoute: 'Ruta de la flota',
      inchSeoul: 'Hacia Seúl →',
      inchMemorial: 'Monumento Gyeongmyeong',
      inchCity: 'Incheon',
      inchNames: { ganghwa: 'Ganghwa', yeongjong: 'Yeongjong', wolmi: 'Wolmido', palmi: 'Palmido', yeongheung: 'Yeongheung', daebu: 'Daebu', gyodong: 'Gyodong', sea: 'Mar Amarillo' },
      openPadlet: '📋 Copiar y abrir Padlet',
      padletPopup: 'Padlet se abrió en otra ventana. Pulsa ＋ y pega.',
      popupBlocked: 'La ventana nueva fue bloqueada. Abre el enlace de abajo.',
      openWork: 'Ver el trabajo del grupo ↗',
      quizHint: 'Si no lo sabes, no pasa nada: elige una opción y descubre la respuesta. (También puedes seguir sin responder)',
      right: '¡Correcto!',
      wrong: 'Casi. La respuesta es…',
      stamp: 'Superado',
      doneTitle: (name) => `Punto "${name}" superado`,
      nextStop: (name) => `El próximo punto de misión es "${name}".`,
      lastStop: 'Llegaste al último punto de misión.',
      preview: 'Vista previa',

      askedBy: (name) => `Pregunta de ${name} (6.º grado, Corea) a los veteranos`,
      qIntro: 'Esta pregunta la envió de verdad uno de los estudiantes coreanos de 6.º grado a los veteranos colombianos. ¿Qué crees que respondieron?',
      showEn: 'Ver el original en inglés',
      myGuessLabel: 'Creo que el veterano respondería así',
      guessPh: 'Si yo fuera el veterano…',
      saveGuess: 'Dejar en el libro de visitas',
      editGuess: 'Corregir y guardar',
      saved: 'Guardado en el libro de visitas.',
      emptyGuess: 'Escribe al menos una línea.',
      skipGuess: 'Si no se te ocurre nada, puedes seguir. También puedes leer primero lo que pensaron tus compañeros.',
      othersTitle: 'Lo que dejaron tus compañeros en este dispositivo',
      noOthers: 'Nadie ha escrito todavía. ¿Quieres ser el primero?',

      guestbookTitle: 'Nuestro libro de visitas',
      gbIntro: 'Lo que tus compañeros creen que respondieron los veteranos.',
      gbDevice: 'Solo se ve lo escrito en este dispositivo. Reúnan las ideas de toda la clase en el tablero en línea.',
      gbMine: 'Copiar todas mis respuestas',
      gbBoard: 'Abrir Padlet en otra ventana ↗',
      padletTitle: 'Padlet de la clase',
      padletHint: '① Pulsa [Copiar] → ② pulsa el botón ＋ del Padlet → ③ pega (mantén pulsado o Ctrl+V) para compartir con tu clase.',
      toPadlet: '📋 Copiar y subir al Padlet',
      padletCopied: 'Copiado. En el Padlet del libro de visitas, pulsa ＋ y pega.',
      deviceList: 'Lo que se escribió en este dispositivo',
      copied: 'Copiado. Pégalo en el tablero.',
      copyFail: 'No se pudo copiar. Mantén pulsado el texto de abajo para copiarlo.',
      noMine: 'Todavía no has escrito respuestas.',
      you: 'yo',

      codeTitle: 'Mi código de viaje',
      codeGuide: 'Anota este código para continuar en otro dispositivo. También muéstraselo a tu docente para compartir tu resultado.',
      codeNote: '※ Lo que escribiste en el libro de visitas no va en el código (queda solo en este dispositivo).',
      codeChip: '🔑 Código',
      savedToast: '💾 Guardado — con [🔑 Código] puedes continuar en otro dispositivo',
      playerChip: (p) => `${p.nick} ▾`,

      teacherTitle: 'Pantalla docente',
      teacherNote: 'Todo lo que ves aquí está solo en este dispositivo. No se envía por internet.',
      back: '‹ Volver al inicio',
      rosterTitle: 'Reunir resultados',
      rosterGuide: 'Basta con el "código de viaje" de cada estudiante para ver su progreso y sus resultados. El apodo es opcional. Puedes pegar varios códigos a la vez (separados por espacios o saltos de línea).',
      rosterAdd: 'Añadir',
      reportNote: '📡 Tu progreso (apodo, código de viaje y estrellas) se envía automáticamente a los docentes. No se envían tu nombre real ni tu colegio.',
      feedbackBtn: 'Deja tu opinión sobre el juego (encuesta)',
      surveyNext: '📝 Último paso: tu opinión ▶',
      surveyTitle: 'Último paso: tu opinión sobre el juego',
      surveyLead: '¿Qué te pareció el viaje por el Mapa de la Paz? Tus respuestas sinceras nos ayudarán a mejorar el juego. (Unos 3 minutos)',
      surveyHelp: 'Si la encuesta no se ve bien,',
      surveyOpen: 'ábrela en otra pestaña',
      surveyThanks: 'Gracias por llegar hasta el final. Llevemos lo que recordamos hoy hacia la paz del mañana.',
      rosterNickOpt: 'Apodo (opcional)',
      rosterCodePh: 'ABC-123 (uno o varios)',
      rosterBad: (list) => `Se omitieron los códigos no válidos: ${list}`,
      rosterAdded: (n) => `Se añadieron ${n} a la lista.`,
      rosterEmpty: 'Todavía no hay estudiantes.',
      rosterCopy: '📋 Copiar como tabla (para Excel)',
      rosterCopied: 'Tabla copiada. Pégala en Excel.',
      rosterClear: 'Borrar la lista',
      rosterClearQ: '¿Borrar toda la lista? No se puede deshacer.',
      rosterHead: ['Apodo', 'Progreso', 'Aciertos', 'Quiz por punto', 'Código', 'Fecha'],
      del: 'Borrar',
      deviceGbTitle: 'Libro de visitas de este dispositivo',
      deviceGbGuide: 'Reúne las respuestas que escribieron los estudiantes en este dispositivo.',
      gbOpen: 'Ver libro de visitas',
      gbCopyAll: '📋 Copiar todo',
      gbDownload: '💾 Guardar como texto',
      previewTitle: 'Ver puntos de misión',
      previewGuide: 'Abre cualquier punto de misión sin importar el orden. No se guarda nada.',
      manageTitle: 'Datos guardados',
      savedCount: (n) => `Viajes guardados en este dispositivo: ${n}`,
      clearDevice: 'Borrar todos los viajes y el libro de visitas',
      clearQ: '¿Borrar todos los viajes y respuestas de este dispositivo? No se puede deshacer.',
      yesDelete: 'Sí, borrar',
      cancel: 'No',
      cleared: 'Todo borrado.',
      pwMakeTitle: 'Crear valor para nueva contraseña',
      pwNew: 'Nueva contraseña',
      pwHashOut: (h) => `Cambia teacherPasswordHash en js/data.js por '${h}'.`,

      mapAria: 'Mapa del viaje del Batallón Colombia',
      seaW: 'Mar Amarillo', seaE: 'Mar del Este', seaS: 'Mar del Sur',
      line38: 'Paralelo 38', dmz: 'Línea de demarcación', fromCol: 'Desde Colombia, al otro lado del mundo',
      pyongyang: 'Pyongyang'
    },
    en: {
      subtitle: 'A map of memory, connection and peace',
      narration: ['In 1950, a war broke out on the Korean Peninsula.', 'On the other side of the world, in Colombia, a young man boarded a ship.', "Let's step into the memories of that day."],
      startTagline: 'A peaceful tomorrow, drawn with a map of Memory, Across and Peace',
      startLead: 'From the Incheon Landing to the Colombia Battalion’s battles, the Colombian Navy in the Yellow Sea and the memorial in Incheon: pass all 12 mission points and complete the map of peace!',
      mapLetters: [
        ['M', 'Memory', 'Find and remember the heroes in the records'],
        ['A', 'Across', 'Meet friends in Colombia across time and borders'],
        ['P', 'Peace', 'Draw a map of peace with our own hands']
      ],
      mapTo: '→ to Tomorrow: with that map, we draw a peaceful tomorrow together',
      aboutTitle: '💡 Why did we make this game?',
      about: [
        'This map of peace was made from the research of 6th graders at Singeomdan Elementary School in Incheon, Korea, to share with our friends in Colombia.',
        'Our school is in Seo-gu, a district of Incheon. In the same district, in Gyeongmyeong Park, stands the memorial to the Colombian soldiers. Colombia was the only Latin American country to send combat troops to the Korean War, and the battles of Heukuntoryeong and Kumsong are carved on the memorial.',
        'The Incheon Landing (1950) happened before the Colombia Battalion arrived. But that operation, which began in our city, turned the tide of the war; afterwards, Colombian soldiers came from the other side of the world to fight on the hills, and the Colombian Navy guarded the Yellow Sea. We joined all of this into one map that starts and ends in Incheon.'
      ],
      aboutGoals: [
        'Remember the sacrifice of the veterans and understand that peace did not come for free.',
        'Share this memory between students in Korea and Colombia and connect across borders.',
        'At the end, put our own peace pledge on a certificate and promise a peaceful tomorrow together.'
      ],
      aboutGoalsTitle: 'With this game, we want to',
      savedTitle: 'Journeys saved on this device',
      continue: 'Continue ▶',
      newTitle: 'Start a new journey',
      nickLabel: 'Nickname',
      nickGuide: 'Make up a nickname for the game, not your real name! Using a nickname online is one way to protect your personal information.',
      startBtn: 'Start the journey ▶',
      needNick: 'Please write your nickname.',
      tooLong: (n) => `Your nickname can be up to ${n} characters.`,
      banned: 'This game honors veterans. Please choose a respectful nickname without swear words or insults.',
      nickShort: 'Your nickname needs at least two letters.',
      nickChars: 'Nicknames can only use letters and numbers (no emoji or symbols).',
      nickJamo: 'Single Korean consonants or vowels (like ㅋ or ㅗ) can’t be used.',
      nickRepeat: 'Nicknames with repeated letters or laughs (like hahaha or aaa) aren’t allowed. Pick a name that represents you.',
      textBad: 'This contains offensive words. Please rewrite it respectfully.',
      textRepeat: 'Please leave out things like ㅋㅋ or lol and write it seriously.',
      nickExists: (n) => `There is already a journey for "${n}" on this device. Press [Continue] in the list above, or choose a different nickname.`,
      breakTitle: "That's it for lesson 1!",
      breakText: 'We will continue next time. You might use a different device, so write this code in your notebook.',
      backTeacher: '‹ Back to teacher screen',
      resumeTitle: 'Continue a journey from another device',
      resumeHelp: 'Enter your nickname and the 6-letter code from the [🔑 Code] button.',
      codeLabel: 'My journey code',
      resumeBtn: 'Continue with code ▶',
      badCode: "That code doesn't match. Please check the letters again.",
      teacherOpen: '🔒 For teachers',
      teacherGuide: 'With the password you can collect results, view the guestbook, and preview any mission point.',
      password: 'Password',
      enter: 'Enter',
      wrongPw: 'Wrong password.',

      journey: 'My journey',
      chPrologue: 'Prologue · The war',
      chIncheon: 'Incheon Landing',
      chJourney: 'Battles of the Colombia Battalion',
      chReturn: 'Back to Incheon · The sea of memory',
      gToIncheon: "Chapter A (Across) is done! Now the last one, P (Peace): back to Incheon, to the Yellow Sea the Colombian Navy guarded and the memorial of today.",
      lensTitle: 'Incheon lens',
      nowEyebrow: (i, n) => `Next mission point · ${i} / ${n}`,
      enterStation: 'Enter mission point ▶',
      allDone: 'You passed every mission point!',
      allDoneMeta: "Now let's meet the veterans' real answers.",
      toEnding: '🎬 Ending: meet the real answers ▶',
      guestbookBtn: '✎ Our guestbook',

      langBtn: 'EN · English',
      starChip: (n) => `⭐ ${n}`,
      cardChip: (a, b) => `🎴 ${a}/${b}`,
      starPop: (n) => `+${n} ⭐`,
      gHello: (n) => `Hi, ${n}! I'm Paz, the dove of peace. We're trapped in the memory of the war in the 1950s. To get back to today, we must collect the map of peace and open the "Door to Tomorrow"!`,
      briefTitle: 'Mission: get back to today!',
      brief: [
        'You have stepped into the memory of the Korean War in the 1950s. There is only one way back to today: open the "Door to Tomorrow".',
        'But the "map of peace" that opens the door was torn into 12 pieces and scattered across the battlefields.',
        'Pass the mission points one by one and collect the pieces. Every 2 pieces, a 🔑 key word appears.',
        'Use the 6 key words to rebuild a sentence left by a Colombian veteran, and the door will open in Incheon!'
      ],
      briefGo: 'Start the mission ▶',
      routeTitle: 'Journey map: M → A → P → to Tomorrow',
      route: [
        ['M', 'Memory', '① Korean War ② Incheon', 'Bring back the memory of the war'],
        ['A', 'Across', '③ Colombia – ⑩ Panmunjom', 'Walk with the soldiers who crossed the Pacific'],
        ['P', 'Peace', '⑪ Yellow Sea ⑫ Memorial', 'Back in Incheon, meet the peace of today'],
        ['🚪', 'to Tomorrow', 'Door to Tomorrow → pledge', 'Open the door and promise a peaceful tomorrow']
      ],
      keyListTitle: 'Key words and memory fragments so far',
      keyFrom: (a, b) => `points ${a} & ${b}`,
      keyMemo: [
        '22 countries came to help South Korea, and at the Incheon Landing soldiers from many nations fought on the same side. People who fought for someone else’s country — we call them brothers.',
        'The Colombian soldiers crossed the Pacific to protect the peace of a country they had never seen.',
        'Heukuntoryeong and Kumsong: the Colombia Battalion fought in the very middle of the war.',
        'On the hills, the Colombian soldiers and the other UN troops protected each other’s lives like brothers.',
        'After the great sacrifice at Old Baldy, the armistice of July 27, 1953 silenced the guns. We remember the names kept in that memory.',
        'The Colombian Navy in the Yellow Sea and the memorial in Incheon: the memory is still here with us today.'
      ],
      keyLabel: '🔑 Key words',
      keyWords: ['Brothers', 'in', 'war,', 'brothers', 'in', 'peace.'],
      keyPop: (w) => `🔑 Key word found: "${w}"`,
      gKey: (w, n, t) => `Two pieces joined and a key word appeared: "${w}" (${n}/${t}). Remember it!`,
      gDoorReady: 'The map of peace is complete! Now use the 6 key words to open the Door to Tomorrow.',
      doorTitle: 'The Door to Tomorrow',
      doorMeta: "Rebuild the veteran's words with the 6 key words to get back to today.",
      doorBtn: '🔑 Open the Door to Tomorrow ▶',
      doorStory: 'As the 12th piece clicks into place, an old door appears in front of the memorial in Incheon. Six blanks are carved into it. Tap your key words in the right order.',
      doorHint1: 'These are words the Colombian veteran Jaime Álvarez sent to Korean students. What are the two countries to each other, in war and in peace today?',
      doorHint2: 'Hint: "Brothers in ___, brothers in ___."',
      doorWrong: "The door won't budge… try a different order!",
      doorReset: 'Start over',
      doorOpen: "The Door to Tomorrow is open! You brought back the Memory (M), crossed the ocean (A) and completed the map of Peace (P). Now you're back in today: meet the veterans' real answers, and at the end, leave your own peace pledge for tomorrow (to Tomorrow).",
      doorGo: 'Back to today ▶',
      gDoorOpen: 'You did it! The door is open. Back to today!',
      gNext: (name) => `Next stop: "${name}"! Tap the blinking number.`,
      gToColombia: "You've finished chapter M (Memory)! Now begins A (Across): let's meet the Colombian soldiers who crossed the Pacific from the other side of the world. 🌎",
      gAllDone: "You passed every mission point! The veterans' reply (the ending) is waiting for you.",
      gFind: "I hid all the road signs. Find it on the map yourself!",
      gFindWrong: (d) => `So close! A little more to the ${d}.`,
      gFindRight: 'You found it! Amazing!',
      gFindReveal: "It was right here! Now you'll remember it.",
      gCard: (n) => `You got a new hero card: ${n}!`,
      gMission: 'The sea is pitch dark… light the lighthouse first!',
      gMissionDone: 'Mission complete! Thanks to you, the fleet arrived safely!',
      gQuizRetry: "It's okay, pick again!",
      dirs: { N: 'north', S: 'south', E: 'east', W: 'west', NE: 'northeast', NW: 'northwest', SE: 'southeast', SW: 'southwest' },
      kFind: 'Mission: find it on the map!',
      findTap: '👆 Tap the map',
      findLeft: (n) => `${n} ${n === 1 ? 'try' : 'tries'} left`,
      kMission: 'Mission: light the Palmido lighthouse!',
      m1: 'September 15, 1950, just after midnight. In the dark sea, a fleet of 261 ships is waiting.',
      m2: '① Tap the Palmido lighthouse 🗼 on the map to turn on the light.',
      m3: '② Tap the buoys in order, starting from the open sea, to guide the fleet to Wolmido. Watch out for buoys on the mudflats!',
      mLit: 'The lighthouse is on! Now find the buoys along the channel.',
      mDecoy: 'Oops! That way is mudflat. The ship almost got stuck!',
      mOrder: 'Not that buoy yet. Start with the one closest to the ship!',
      mProgress: (a, b) => `Buoys ${a} / ${b}`,
      mSuccess: 'Mission complete! The fleet arrived safely at Wolmido.',
      mRetry: 'Start over',
      quizRetry: 'So close! Want to pick again?',
      albumTitle: 'Hero card album',
      albumLead: (a, b) => `You collected ${a} of ${b} cards. Meet heroes at each mission point to get more cards!`,
      albumWhere: (w) => `Found at: ${w}`,
      albumEnding: 'the ending',
      newCard: 'New hero card!',
      ranks: [[0, 'Rookie memory explorer'], [300, 'Memory explorer'], [600, 'Peace expedition captain'], [900, 'Keeper of peaceful memories'], [1083, 'Star of peace who remembered all 1,083 soldiers']],
      rankLine: (n, t, r) => `⭐ ${n.toLocaleString('en')} / ${t.toLocaleString('en')} · Title "${r}"`,
      gHelloStars: 'Collect 1,083 stars! Each star remembers one of the 1,083 Colombian soldiers who crossed the Pacific in 1951.',
      starInfoTitle: '1,083 stars of peace',
      starInfoLead: 'In 1951, 1,083 soldiers of the Colombia Battalion crossed the Pacific to Korea. Each star is a way of remembering one of them. The number of stars for each mission hides a piece of history, too!',
      starMine: (n, t) => `So far: ${n.toLocaleString('en')} / ${t.toLocaleString('en')}`,
      starRows: [
        ['mission', '🔦 Palmido lighthouse mission', '261 ships guided'],
        ['find:war', '🎯 Find the 38th parallel', 'The 38th parallel'],
        ['find:busan', '🎯 Find Busan port', 'Arrived June 15'],
        ['find:armistice', '🎯 Find Panmunjom', 'Armistice on July 27'],
        ['voyage', '🌏 Crossing the Pacific', 'A 25-day voyage'],
        ['allies', '🗺️ Watch the whole war', '22 countries together'],
        ['quiz', '❓ Quiz (12 questions)', '35 first try · 15 second try'],
        ['question', '✎ Question cards (5)', '45 each'],
        ['op', '📍 5 Incheon operations', '10 each']
      ],
      starWhy: { mission: '261 ships guided!', 'find:war': 'You found the 38th parallel', 'find:busan': 'June 15, arrived in Busan', 'find:armistice': 'July 27, the armistice', voyage: 'A 25-day voyage', allies: '22 countries together' },
      glossTitle: 'Word helper',
      atlasOpen: '🗺️ Full map',
      atlasClose: '✕ Close full map',
      atlasHint: "Tap the cards floating on the map. Places you haven't visited yet are gray.",
      atlasDoneHint: '🎉 The map of peace is complete! Now tap anywhere on the map.',
      placeGo: 'Go here ▶',
      placeLocked: "🔒 You haven't been here yet. It opens as you follow the journey!",
      placeDone: '✓ Visited',
      placeNext: '▶ Your next stop',
      placeHeroes: 'Hero cards from this place',
      placeOps: 'Operations at this place',
      photoCredit: 'Photo',
      gAtlas: "Here's the full map! Tap a floating card.",
      albumSections: { co: 'Colombia', kr: 'Republic of Korea', us: 'UN forces' },
      albumTap: 'Tap a card you collected to see what the hero did.',
      deedsTitle: 'What they did',
      cardBy: (g) => `🎒 Researched by Group ${g}`,
      cardMet: (w) => `Met at: ${w}`,
      pieceLabel: '🧩 Pieces of the map of peace',
      piecePop: '🧩 You found a map piece!',
      mapComplete: '🎉 The map of peace is complete!',
      gMapDone: (n) => `Wow! You collected all ${n} pieces and the map of peace is complete!`,
      goldLabel: 'Gold card',
      goldNew: 'It turned gold!',
      gGold: (n) => `Awesome! The ${n} card is shining gold!`,
      goldCount: (a, b) => `Gold cards ${a} / ${b}`,
      goldHowTitle: 'How do I make it gold?',
      goldHow: 'Get the quiz, the map search and the mission at this point right on the first try. If there is a question card, leave your guess.',
      goldHowEnding: 'Leave your guess on all 5 question cards and it turns gold.',
      retryBtn: 'Try again',
      gRetry: "Try again! Get it right on the first try this time. You'll earn the stars you missed.",
      watchNeed: 'Watch this video to the end to unlock [Next]. (Skipping ahead does not count.)',
      watchNeedLink: 'Must-see video: open it on YouTube, watch it to the end, then come back and press [I watched it]. (The button unlocks after the length of the video.)',
      watchDoneBtn: '✅ I watched it',
      watchLeft: (t) => `Available in ${t}`,
      ytOpen: 'Watch the video on YouTube ↗',
      padletLinkHelp: 'Press the button to open Padlet in a new tab. Then press ＋ and paste your copied text or upload your saved picture.',
      certLongPress: 'Long-press the picture (tablet/phone) or right-click it (computer) → "Save image" or "Copy image", then post it on Padlet.',
      watchOther: (t) => `Watch the must-see video "${t}" to the end to continue.`,
      watchGo: 'Go to the must-see video ▶',
      watchBadge: 'Must see',
      watchDone: 'You watched it all! Now go on to [Next].',
      watchSkip: "The video couldn't load, so you can move on this time.",
      gWatchDone: 'You watched it to the end! Let’s keep going.',
      longTitle: 'Long videos to watch at home (over 10 min)',
      certTitle: 'Map of Peace Certificate',
      certLead: (n) => `This is the map of peace ${n} completed! Write your name, school and nationality, and as the last step of the journey, one line for your peace pledge. Once it's all on the certificate, you can save it as a picture and post it on Padlet.`,
      certNeedPledge: 'Fill in your name, school, nationality and peace pledge to save the certificate.',
      certRealName: 'Name',
      certRealNamePh: 'e.g. Alex Kim',
      certSchool: 'School',
      certSchoolPh: 'e.g. Sunny Hill Middle School',
      certExample: (x) => `e.g. ${x}`,
      certNation: 'Nationality',
      certNationPick: 'Choose one',
      certNationOtherPh: 'Type the country name',
      certPrivacy: 'Your name and school stay only on this device and in the certificate picture. They are not in your code or sent over the internet.',
      certPadletTitle: 'Padlet post title:',
      certTitleCopy: 'Copy title',
      certTitleCopied: 'Title copied! Paste it into the title of your Padlet post.',
      certTap: 'Tap a stamp on the map to see the place name.',
      certNameLabel: 'Completed the map of peace',
      certStars: 'Peace stars', certCards: 'Hero cards', certGold: 'Gold cards', certPieces: 'Map pieces',
      certMyHero: 'My hero',
      certPledge: 'My peace pledge',
      certPledgePh: "e.g. I'll tell my family the veterans' story.",
      certGoldStamp: 'Gold stamp = a mission point done perfectly on the first try',
      certPerfect: 'Perfect!',
      certSave: 'Save certificate as a picture',
      certCopy: 'Copy picture (paste into Padlet)',
      certShare: 'Share · Save to photos',
      certSaved: 'Saved! On Padlet, press ＋ and upload the picture.',
      certCopied: 'Picture copied! On Padlet, press ＋ and paste (Ctrl+V).',
      certPadletHint: 'On Padlet, press ＋ and upload the picture you saved.',
      certHow: '💡 Computer: [Copy picture] → Ctrl+V on Padlet · Tablet/phone: [Save] or [Share] to your photos → upload on Padlet',

      endTitle: 'Back from the memories of that day',
      endLead: "The veterans sent video answers from Colombia to the questions you asked them. Let's compare your guess with the real answer, side by side.",
      endStatQuiz: (a, b) => `Quiz ${a} / ${b}`,
      endStatGuess: (a, b) => `Guesses ${a} / ${b}`,
      endStart: 'Meet the real answers ▶',
      endTip: 'The videos are about 15 minutes in total. You can watch them together on a big screen with your teacher.',
      qLabel: (n, total) => `Question ${n} / ${total}`,
      myGuessTitle: 'My guess',
      realTitle: "The veteran's real answer",
      noGuessYet: "You haven't written a guess yet. Want to write one line before watching?",
      saveHere: 'Save',
      videoSoon: 'Video coming soon',
      videoSoonSub: 'Your teacher will add the video soon. Read the summary below first.',
      summaryLabel: 'Answer summary',
      summaryNote: 'A short summary of what was said in the video.',
      reactQ: 'Compared with my guess…',
      reacts: [['same', '🙂 Similar'], ['diff', '😮 Different'], ['new', '💡 I learned something new']],
      moreTitle: 'Learn more',
      moreLead: "Find more veterans' stories in materials made by Korea's Ministry of Patriots and Veterans Affairs.",
      worksTitle: "Our groups' projects",
      finishTitle: 'Keeper of peaceful memories',
      finishText: (n) => `${n} followed the footsteps of the Colombian veterans, who came from the other side of the world, all the way to the end. You are the one who carries their memories into today's peace.`,
      finishQuote: '“Brothers in war, brothers in peace.”',
      finishQuoteBy: "— from Jaime Álvarez's answer",
      toMapBtn: 'Back to the map',
      toStartBtn: 'Go to start',
      showCodeBtn: '🔑 My journey code',
      endingPreview: '🎬 Ending',
      prev: '◀ Back',
      next: 'Next ▶',
      toMap: 'To the map ▶',
      close: 'Close',
      kStory: 'What happened here',
      kTimeline: 'The war at a glance',
      kHero: 'Hero story card',
      kQuiz: 'Guess quiz',
      kQuestion: 'Question card',
      kVideo: 'Watch a video',
      videoGroup: (g) => `Video found by Group ${g}`,
      videoLong: "It's a long video. Watch the beginning, or finish it at home.",
      videoPick: 'Other videos',
      videoOptional: 'You can choose which videos to watch.',
      onYoutube: 'Watch on YouTube ↗',
      tlHint: 'Tap each one. The front line moves on the map!',
      tlPlay: '▶ Play in order',
      tlStop: '■ Stop',
      legendNorth: 'Held by North Korean and Chinese forces',
      legendFront: 'Front line',
      legendSouth: 'South Korea · UN forces',
      mapHome: 'See the whole map',
      worldCol: 'Colombia',
      worldKor: 'Korea',
      worldPacific: 'P a c i f i c   O c e a n',
      worldDist: 'About 15,000 km in a straight line',
      worldVoyage: 'Across the Pacific to Korea',
      kOps: 'Incheon map made by our classmates',
      opsHint: 'Tap the numbers on the map or the list below. These are the 5 Incheon Landing operations our classmates researched!',
      opsBy: (g) => `🎒 Researched by Group ${g}`,
      opsSeen: (n, t) => `You looked at ${n} of ${t} places`,
      opsHeroes: 'Heroes of this operation',
      opsWorks: "See the group's site ↗",
      groupN: (g) => `Group ${g}`,
      inchRoute: 'Sea route of the fleet',
      inchSeoul: 'To Seoul →',
      inchMemorial: 'Gyeongmyeong Park memorial',
      inchCity: 'Incheon',
      inchNames: { ganghwa: 'Ganghwa', yeongjong: 'Yeongjong', wolmi: 'Wolmido', palmi: 'Palmido', yeongheung: 'Yeongheung', daebu: 'Daebu', gyodong: 'Gyodong', sea: 'Yellow Sea' },
      openPadlet: '📋 Copy and open Padlet',
      padletPopup: 'Padlet opened in a new window. Press ＋ and paste.',
      popupBlocked: 'The new window was blocked. Tap the link below to open it.',
      openWork: "See the group's project ↗",
      quizHint: "It's okay if you don't know! Pick one and check the answer. (You can also skip it.)",
      right: 'Correct!',
      wrong: 'So close! The answer is…',
      stamp: 'Cleared!',
      doneTitle: (name) => `Mission point "${name}" cleared`,
      nextStop: (name) => `The next mission point is "${name}".`,
      lastStop: 'You passed the very last mission point!',
      preview: 'Preview',

      askedBy: (name) => `A question ${name} asked the veterans`,
      qIntro: 'A 6th grader really sent this question to the Colombian veterans. What do you think they answered?',
      showEn: 'See the original English',
      myGuessLabel: 'I think the veteran would answer like this',
      guessPh: 'If I were the veteran…',
      saveGuess: 'Leave it in the guestbook',
      editGuess: 'Edit and save again',
      saved: 'Saved in the guestbook!',
      emptyGuess: 'How about writing just one line?',
      skipGuess: "If nothing comes to mind, you can move on. You can also read your classmates' ideas in the guestbook first.",
      othersTitle: 'Ideas classmates left on this device',
      noOthers: 'Nobody has written yet. Want to be the first?',

      guestbookTitle: 'Our guestbook',
      gbIntro: 'Here are the guesses classmates left: "I think the veteran would answer like this."',
      gbDevice: 'You can only see what was written on this device. We collect the whole class\'s ideas on the online board.',
      gbMine: 'Copy all my answers',
      gbBoard: 'Open Padlet in a new window ↗',
      padletTitle: 'Our class Padlet',
      padletHint: '① Press [Copy] → ② press the ＋ button on Padlet → ③ paste (long-press or Ctrl+V) to share with your class.',
      toPadlet: '📋 Copy and post to Padlet',
      padletCopied: 'Copied! In the guestbook Padlet, press ＋ and paste.',
      deviceList: 'Ideas left on this device',
      copied: 'Copied! Paste it on the board.',
      copyFail: "Copying is blocked. Long-press the text below to copy it.",
      noMine: "You haven't left any answers yet.",
      you: 'me',

      codeTitle: 'My journey code',
      codeGuide: 'Write down this code to continue on another device. Show it to your teacher to share your result, too.',
      codeNote: '※ Guestbook writing is not saved in the code. (It stays only on this device.)',
      codeChip: '🔑 Code',
      savedToast: '💾 Saved — use [🔑 Code] at the top to continue on another device',
      playerChip: (p) => `${p.nick} ▾`,

      teacherTitle: 'Teacher screen',
      teacherNote: 'Everything you see here is stored only on this device. Nothing is sent over the internet.',
      back: '‹ Back to start',
      rosterTitle: 'Collect student results',
      rosterGuide: "A student's journey code alone shows their progress and quiz results. The nickname is optional. You can paste several codes at once (separated by spaces or new lines).",
      rosterAdd: 'Add to list',
      reportNote: '📡 Your progress (nickname, journey code and stars) is sent to your teacher automatically. Your real name and school are not sent.',
      feedbackBtn: 'Share your feedback (survey)',
      surveyNext: '📝 Last step: your feedback ▶',
      surveyTitle: 'Last step: share your feedback',
      surveyLead: 'How was your journey on the Map of Peace? Your honest answers will help us make the game better. (About 3 minutes)',
      surveyHelp: "If the survey doesn't show well,",
      surveyOpen: 'open it in a new tab',
      surveyThanks: "Thank you for coming all the way. Let's carry what we remembered today into tomorrow's peace!",
      rosterNickOpt: 'Nickname (optional)',
      rosterCodePh: 'ABC-123 (one or more)',
      rosterBad: (list) => `Invalid codes were skipped: ${list}`,
      rosterAdded: (n) => `Added ${n} to the list.`,
      rosterEmpty: 'No students added yet.',
      rosterCopy: '📋 Copy as table (paste into Excel)',
      rosterCopied: 'Table copied. Paste it into Excel or a document.',
      rosterClear: 'Clear the whole list',
      rosterClearQ: 'Clear the whole list? This cannot be undone.',
      rosterHead: ['Nickname', 'Progress', 'Quiz correct', 'Quiz by point', 'Code', 'Date added'],
      del: 'Delete',
      deviceGbTitle: "This device's guestbook",
      deviceGbGuide: 'See the guesses students left on this device.',
      gbOpen: 'Open guestbook',
      gbCopyAll: '📋 Copy all',
      gbDownload: '💾 Save as text file',
      previewTitle: 'Preview mission points',
      previewGuide: 'Open any mission point in any order. Nothing is saved.',
      manageTitle: 'Saved records',
      savedCount: (n) => `Journeys saved on this device: ${n}`,
      clearDevice: 'Delete all journeys and guestbook entries on this device',
      clearQ: 'Delete all journeys and guestbook entries on this device? This cannot be undone.',
      yesDelete: 'Yes, delete',
      cancel: 'No',
      cleared: 'All deleted.',
      pwMakeTitle: 'Make a value for a new password',
      pwNew: 'New password',
      pwHashOut: (h) => `Change teacherPasswordHash in js/data.js to '${h}'.`,

      mapAria: "Map of the Colombia Battalion's journey",
      seaW: 'Yellow Sea', seaE: 'East Sea', seaS: 'South Sea',
      line38: '38th parallel', dmz: 'Armistice line', fromCol: 'From Colombia, on the other side of the world',
      pyongyang: 'Pyongyang'
    }
  };
  const LANGS = [['ko', 'KO', '한국어'], ['es', 'ES', 'Español'], ['en', 'EN', 'English']];
  // 유튜브 채널 이름 (스페인어·영어 화면에서는 로마자로)
  const CHANNEL_NAMES = {
    '국가보훈부': 'MPVA Korea', '공부왕찐천재': 'Gongbuwang Jjincheonjae', '국방부 M프렌즈': 'MND M-Friends', '인사이드 스토리': 'Inside Story',
    'LG헬로비전': 'LG HelloVision', '짧군': 'Jjalgun', '채널A': 'Channel A', '국방뉴스': 'Kookbang News',
    '꼬끼오 History': 'Kkokkio History', 'TV나라사랑': 'TV Narasarang', '연합뉴스TV': 'Yonhap News TV'
  };

  /* ---------------- 저장 ---------------- */
  let store = loadStore();
  let lang = UI[store.lang] ? store.lang : 'ko';
  let player = null;      // 지금 하는 여정
  let previewMode = false; // 선생님 미리 보기

  function loadStore() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && s.games) return s;
    } catch (e) { /* 저장이 막힌 환경 — 메모리로만 진행 */ }
    return { lang: 'ko', games: {} };
  }
  function save() {
    if (player && !previewMode) player.updated = Date.now();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* 무시 */ }
  }
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  /* ---------------- 도우미 ---------------- */
  const $ = (id) => document.getElementById(id);
  const T = (key, ...args) => { const v = UI[lang][key] ?? UI.ko[key]; return typeof v === 'function' ? v(...args) : v; };
  const L = (obj) => (obj == null ? '' : typeof obj === 'string' ? obj : (obj[lang] || obj.ko || ''));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svgEl = (tag, attrs = {}, parent) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  };
  const chapterOf = (s) => s.chapter || 'journey';
  // 여정의 네 장: 프롤로그 → 인천상륙작전 → 콜롬비아대대의 전투 → 다시 인천으로
  const CH_KEY = { prologue: 'chPrologue', incheon: 'chIncheon', journey: 'chJourney', return: 'chReturn' };
  // 네 장을 M.A.P.의 세 글자로: 기억(M) → 연결(A) → 평화(P)
  const CH_LETTER = { prologue: 'M', incheon: 'M', journey: 'A', return: 'P' };
  const chLabel = (ch) => `${CH_LETTER[ch]} · ${T(CH_KEY[ch])}`;

  // 📖 어려운 낱말에 점선 밑줄 + 번호를 달고, 아래에 풀이(주석)를 붙여요
  function annotate(root, max = 6) {
    const list = ((window.GLOSSARY || {})[lang] || []).slice().sort((a, b) => b[0].length - a[0].length);
    if (!root || !list.length) return;
    const old = root.querySelector(':scope > .gloss'); if (old) old.remove();
    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || p.closest('button, textarea, a, .gloss, .gl, .facts, .kicker, .others, .by, .v-list, .op-works')) return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const used = [];
    for (const [term, def] of list) {
      if (used.length >= max) break;
      if (used.some((u) => u.term.toLowerCase().includes(term.toLowerCase()))) continue; // '유엔군'을 이미 풀었으면 '유엔'은 건너뛰기
      // 영어·스페인어는 낱말 단위로만 찾기 ('UN'이 'unit' 안에서 잡히지 않게)
      const latin = /^[A-Za-z0-9 .À-ɏ-]+$/.test(term);
      const re = latin ? new RegExp(`(?<![\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'iu') : null;
      for (const node of nodes) {
        const i = re ? node.nodeValue.search(re) : node.nodeValue.toLowerCase().indexOf(term.toLowerCase());
        if (i < 0) continue;
        const hit = node.splitText(i);
        const rest = hit.splitText(term.length);
        const span = document.createElement('span');
        span.className = 'gl';
        span.textContent = hit.nodeValue;
        span.title = def;
        hit.replaceWith(span);
        nodes.push(rest);
        used.push({ term, def, span });
        break;
      }
    }
    if (!used.length) return;
    // 글에 나온 순서대로 번호 매기기
    const order = [...root.querySelectorAll('.gl')];
    used.sort((a, b) => order.indexOf(a.span) - order.indexOf(b.span));
    used.forEach((u, k) => { u.span.dataset.n = k + 1; });
    const aside = document.createElement('aside');
    aside.className = 'gloss';
    aside.innerHTML = `<b>📖 ${esc(T('glossTitle'))}</b><ol>${used.map((u) => `<li><b>${esc(u.span.textContent)}</b> ${esc(u.def)}</li>`).join('')}</ol>`;
    root.appendChild(aside);
  }
  const fmtDate = (t) => { const d = new Date(t); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

  // 질문을 보낸 학생 이름 가리기 (민도연 → 민○연)
  function maskName(name, roman) {
    // 스페인어·영어 화면: 로마자로 (가릴 때는 성 + 이름 첫 글자: Min D.)
    if (lang !== 'ko' && roman) {
      if (CONFIG.showStudentNames) return roman;
      const [family, given = ''] = roman.split(' ');
      return given ? `${family} ${given[0]}.` : family;
    }
    if (CONFIG.showStudentNames) return name;
    const a = Array.from(name);
    if (a.length >= 3) return a[0] + '○'.repeat(a.length - 2) + a[a.length - 1];
    if (a.length === 2) return a[0] + '○';
    return name;
  }

  let toastTimer;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
  }

  async function copyText(text, fallbackEl) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      if (fallbackEl) { fallbackEl.hidden = false; fallbackEl.value = text; fallbackEl.focus(); fallbackEl.select(); }
      return false;
    }
  }

  function applyStaticText() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = T(el.dataset.i18n); });
    $('reportNote').hidden = !reportOn(); // 진행 상황을 선생님께 보낼 때만 알려 줘요
    // 시작 화면: M.A.P.의 뜻 + 이 게임을 만든 까닭
    const mlColor = { M: 'var(--co-blue)', A: 'var(--co-red)', P: '#1f8a4c' };
    $('mapLetters').innerHTML = T('mapLetters').map(([k, name, text]) => `
      <div class="ml" style="--c:${mlColor[k]}"><b>${k}</b><strong>${esc(name)}</strong><span>${esc(text)}</span></div>`).join('')
      + `<div class="ml-to">${esc(T('mapTo'))}</div>`;
    $('aboutBody').innerHTML = `<div class="about-body">${T('about').map((p) => `<p>${esc(p)}</p>`).join('')}
      <p><b>${esc(T('aboutGoalsTitle'))}</b></p><ul>${T('aboutGoals').map((g) => `<li>${esc(g)}</li>`).join('')}</ul></div>`;
    $('atlasBtn').textContent = T(typeof atlasOn !== 'undefined' && atlasOn ? 'atlasClose' : 'atlasOpen');
    // 🌐 언어 버튼: 지금 언어를 보여 주고, 누르면 한국어·Español·English 중에서 골라요
    const [, lcode, lname] = LANGS.find((x) => x[0] === lang);
    $('langBtn').innerHTML = `<span class="lb-globe" aria-hidden="true">🌐 </span><span>${esc(lcode)}</span><span class="lb-long"> · ${esc(lname)}</span>`;
    $('langMenu').innerHTML = LANGS.map(([id, code, name]) => `<button type="button" role="menuitemradio" aria-checked="${id === lang}" data-lang="${id}" lang="${id}"><b>${code}</b> ${esc(name)}</button>`).join('');
    $('map').setAttribute('aria-label', T('mapAria'));
    ['sheetClose', 'infoClose'].forEach((id) => $(id).setAttribute('aria-label', T('close')));
    $('nickInput').maxLength = CONFIG.nicknameMaxLength + 4; // 넘치면 안내 문구로 알려 줌
  }

  function showScreen(id) {
    ['startScreen', 'teacherScreen', 'gameScreen', 'endingScreen'].forEach((s) => { $(s).hidden = s !== id; });
    const inGame = (id === 'gameScreen' || id === 'endingScreen') && !previewMode;
    $('playerChip').hidden = !inGame;
    $('codeChip').hidden = !inGame;
    $('starChip').hidden = !inGame;
    $('cardChip').hidden = !inGame;
    if (inGame) updateChips();
  }

  /* =====================================================================
     게임 요소: 평화의 별 ⭐ · 영웅 카드 도감 🎴 · 길잡이 비둘기 파스 🕊️
     ===================================================================== */
  const starTotal = (p) => Object.values((p && p.stars) || {}).reduce((a, b) => a + b, 0);
  function rankOf(n) {
    let r = T('ranks')[0][1];
    T('ranks').forEach(([min, name]) => { if (n >= min) r = name; });
    return r;
  }

  const RULES = window.STAR_RULES || { total: 1083, quiz: [40, 20], question: 45, op: 14, find: {}, mission: 261, voyage: 25, allies: 22 };

  // 같은 일로는 별을 한 번만 받아요 (key = 'quiz:war', 'find:busan', 'mission' …)
  // 다시 도전해서 더 잘하면, 모자랐던 만큼만 더 받아요 (그래서 최대는 언제나 1,083개)
  function giveStars(key, n, near) {
    if (previewMode || !player || n <= 0) return;
    player.stars = player.stars || {};
    const old = player.stars[key];
    if (old != null && n <= old) return;
    player.stars[key] = n;
    const gain = n - (old || 0);
    save();
    updateChips();
    checkGold();
    const pop = document.createElement('span');
    pop.className = 'star-pop';
    // 역사와 이어진 숫자면 그 뜻도 함께 (예: "+261 ⭐ 함대 261척 안내!")
    const why = T('starWhy')[key];
    pop.innerHTML = `${esc(T('starPop', gain))}${why ? `<small>${esc(why)}</small>` : ''}`;
    const r = (near || $('starChip')).getBoundingClientRect();
    pop.style.left = `${Math.min(window.innerWidth - 90, Math.max(10, r.left + r.width / 2 - 30))}px`;
    pop.style.top = `${Math.max(10, r.top - 6)}px`;
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), why ? 2200 : 1400);
    $('starChip').classList.remove('bump'); void $('starChip').offsetWidth; $('starChip').classList.add('bump');
  }

  // 영웅 카드 목록 = data.js 의 HERO_CARDS. "어디서 만나는지"는 작전 지점·작전 데이터에서 찾아요
  const VET_CARD = { jaime: 'alvarez', jorge: 'suarez' }; // 엔딩 답장 영상 → 카드
  let CARDS = null;
  function allCards() {
    if (CARDS) return CARDS;
    const where = {};
    STATIONS.forEach((s, si) => {
      (s.heroes || []).forEach((h) => { if (h.card && where[h.card] == null) where[h.card] = si; });
      (s.cards || []).forEach((id) => { if (where[id] == null) where[id] = si; });
      if (s.inset === 'incheon') (window.INCHEON_OPS || []).forEach((op) => (op.heroes || []).forEach((h) => { if (h.card && where[h.card] == null) where[h.card] = si; }));
    });
    Object.values(VET_CARD).forEach((id) => { if (where[id] == null) where[id] = 'ending'; });
    CARDS = (window.HERO_CARDS || []).map((c) => ({ ...c, where: where[c.id] != null ? where[c.id] : 'ending' }));
    return CARDS;
  }
  const cardCount = () => allCards().filter((c) => player && player.cards && player.cards[c.id]).length;
  // 국기 이모지는 윈도우 컴퓨터에서 'KR'처럼 글자로 보여서, CSS로 그린 작은 국기를 써요
  const flagHtml = (code) => `<span class="mini-flag mf-${code}" aria-hidden="true"></span>`;

  function unlockCard(id) {
    if (previewMode || !player) return;
    const c = allCards().find((x) => x.id === id);
    if (!c) return;
    player.cards = player.cards || {};
    if (player.cards[id]) return;
    player.cards[id] = Date.now();
    save();
    updateChips();
    popQueue.push({ c });
    if (popQueue.length === 1) showCardPop();
    checkGold();
  }

  /* ---------- ✨ 금빛 카드: 그 작전 지점의 도전을 모두 첫 시도에 해내면 ----------
     퀴즈 첫 시도 정답 + 찾기 미션 첫 시도 + 등대 미션 성공 + 질문 카드 답 쓰기 (그 지점에 있는 것만)
     엔딩에서 만나는 카드는 질문 카드 5장에 모두 예상 답을 쓰면 금빛 */
  function goldReqs(c) {
    const st = (player && player.stars) || {};
    if (c.where === 'ending') return Object.keys(QUESTIONS).map((q) => st[`q:${q}`] != null);
    return stationReqs(STATIONS[c.where]);
  }
  // 이 작전 지점에서 별을 모두 받았나? (아니면 [다시 도전]이 보여요)
  function stationReqs(s) {
    const st = (player && player.stars) || {};
    const reqs = [];
    if (s.quiz) reqs.push(st[`quiz:${s.id}`] === RULES.quiz[0]);
    if (s.find) reqs.push(st[`find:${s.id}`] === RULES.find[s.id]);
    if (s.mission) reqs.push(st.mission != null);
    (s.questions || []).forEach((q) => reqs.push(st[`q:${q}`] != null));
    return reqs;
  }
  const isGold = (c) => !!(player && player.gold && player.gold[c.id]);
  const goldCount = () => allCards().filter(isGold).length;
  function checkGold() {
    if (previewMode || !player || !player.cards) return;
    player.gold = player.gold || {};
    allCards().forEach((c) => {
      if (!player.cards[c.id] || player.gold[c.id]) return;
      if (goldReqs(c).every(Boolean)) {
        player.gold[c.id] = Date.now();
        save();
        popQueue.push({ c, gold: true });
        if (popQueue.length === 1) showCardPop();
      }
    });
  }
  // 다시 도전: 퀴즈·찾기·미션을 처음부터 다시 (별은 더 잘한 만큼만 더해져요)
  function retryStation(si) {
    if (!player || !isUnlocked(si)) return;
    $('infoSheet').hidden = true;
    openStation(si, true);
    say(T('gRetry'));
  }

  // 카드 얻는 순간 (여러 장이면 한 장씩 차례로 떴다가 사라짐)
  const popQueue = [];
  function showCardPop() {
    const item = popQueue[0];
    if (!item) return;
    const c = item.c;
    const pop = document.createElement('div');
    pop.className = `card-pop${item.gold ? ' gold' : ''}`;
    pop.innerHTML = `<span class="card-pop-k">${item.gold ? `✨ ${esc(T('goldNew'))}` : `🎴 ${esc(T('newCard'))}`}</span>${cardHtml(c, true)}`;
    pop.addEventListener('click', () => pop.classList.add('out'));
    document.body.appendChild(pop);
    say(item.gold ? T('gGold', L(c.name)) : T('gCard', L(c.name)));
    const wait = popQueue.length > 1 ? 1100 : 1800; // 여러 장이면 빠르게
    setTimeout(() => pop.classList.add('out'), wait);
    setTimeout(() => { pop.remove(); popQueue.shift(); showCardPop(); }, wait + 400);
  }

  const whereName = (c) => (c.where === 'ending' ? T('albumEnding') : `${c.where + 1}. ${L(STATIONS[c.where].name)}`);

  // 카드 앞면 (도감 칸 · 카드 얻을 때 뜨는 창)
  // 카드 사진 (사진이 없으면 국기 색 바탕에 이름 첫 글자)
  function photoHtml(c, big) {
    const initial = Array.from(L(c.name).replace(/^(ARC|USS)\s+/, ''))[0] || '?';
    return c.img
      ? `<span class="hcard-photo${big ? ' big' : ''}"><img src="${esc(c.img)}" alt="${esc(L(c.name))}" loading="lazy" referrerpolicy="no-referrer"></span>`
      : `<span class="hcard-photo ph flag-${esc(c.flag)}${big ? ' big' : ''}" aria-hidden="true">${esc(c.unit ? (c.id === 'padilla' ? '⚓' : '🎖️') : initial)}</span>`;
  }
  function cardHtml(c, open) {
    if (!open) {
      // 아직 못 모은 카드: 이름은 보이지만 흑백 + 자물쇠
      return `<div class="hcard locked flag-${esc(c.flag)}">${photoHtml(c)}<span class="hcard-lock">🔒</span>
        <b>${esc(L(c.name))}</b><small>${esc(T('albumWhere', whereName(c)))}</small></div>`;
    }
    return `<button type="button" class="hcard flag-${esc(c.flag)}${c.unit ? ' unit' : ''}${isGold(c) ? ' gold' : ''}" data-card="${esc(c.id)}">
      ${photoHtml(c)}
      ${isGold(c) ? `<span class="hcard-gold">✨ ${esc(T('goldLabel'))}</span>` : ''}
      <span class="hcard-flag">${flagHtml(c.flag)}</span>
      <b>${esc(L(c.name))}</b>
      <span class="hcard-role">${esc(L(c.role))}</span>
      ${c.years ? `<span class="hcard-years">${esc(c.years)}</span>` : ''}
      <p>${esc(L((c.deeds || [])[0]))}</p>
    </button>`;
  }

  // 카드 뒷면: 업적 모두 보기
  function openCard(id) {
    const c = allCards().find((x) => x.id === id);
    if (!c) return;
    openInfo('🎴', L(c.name), `
      <article class="card-detail flag-${esc(c.flag)}">
        ${photoHtml(c, true)}
        ${c.img && c.credit ? `<p class="photo-credit">${esc(T('photoCredit'))}: ${esc(c.credit)}</p>` : ''}
        <div class="cd-top">${flagHtml(c.flag)}<span class="hcard-role">${esc(L(c.role))}</span>${c.years ? `<span class="hcard-years">${esc(c.years)}</span>` : ''}</div>
        <h4>🏅 ${esc(T('deedsTitle'))}</h4>
        <ol class="deeds">${(c.deeds || []).map((d) => `<li>${esc(L(d))}</li>`).join('')}</ol>
        ${(c.groups || []).length ? `<p class="op-by">${esc(T('cardBy', c.groups.join('·')))}</p>` : ''}
        <p class="t-help">${esc(T('cardMet', whereName(c)))}</p>
        ${isGold(c) ? `<p class="gold-note got">✨ ${esc(T('goldLabel'))}</p>`
          : `<div class="gold-note"><b>✨ ${esc(T('goldHowTitle'))}</b><span>${esc(c.where === 'ending' ? T('goldHowEnding') : T('goldHow'))}</span>
             ${c.where !== 'ending' && !previewMode && hasCard(c) && !$('gameScreen').hidden ? `<button type="button" class="btn btn-go btn-sm" id="retryBtn">${esc(T('retryBtn'))}</button>` : ''}</div>`}
      </article>
      <button type="button" class="btn btn-ghost btn-sm" id="backAlbum">← ${esc(T('albumTitle'))}</button>`);
    $('backAlbum').addEventListener('click', openAlbum);
    if ($('retryBtn')) $('retryBtn').addEventListener('click', () => retryStation(c.where));
    annotate(document.querySelector('#infoBody .card-detail'));
  }

  // 도감: 콜롬비아 / 대한민국 / 유엔군 으로 나눠서
  function openAlbum() {
    const cards = allCards();
    const has = (c) => !!(player && player.cards && player.cards[c.id]);
    const sections = ['co', 'kr', 'us'].map((f) => {
      const list = cards.filter((c) => c.flag === f);
      if (!list.length) return '';
      return `<section class="album-sec">
        <h3>${flagHtml(f)} ${esc(T('albumSections')[f])} <small>${list.filter(has).length} / ${list.length}</small></h3>
        <div class="album">${list.map((c) => cardHtml(c, has(c))).join('')}</div>
      </section>`;
    }).join('');
    openInfo('🎴', T('albumTitle'), `
      <p class="q-intro">${esc(T('albumLead', cardCount(), cards.length))}</p>
      <p class="gold-count">✨ ${esc(T('goldCount', goldCount(), cards.length))}</p>
      <p class="t-help">${esc(T('albumTap'))}</p>${sections}`);
    document.querySelectorAll('#infoBody .hcard[data-card]').forEach((b) => b.addEventListener('click', () => openCard(b.dataset.card)));
  }

  // 별 설명: 왜 1,083개인지, 미션마다 숫자의 뜻
  function openStarInfo() {
    const got = (player && player.stars) || {};
    const val = (k) => {
      if (k === 'quiz') return STATIONS.filter((s) => s.quiz).length * RULES.quiz[0];
      if (k === 'question') return Object.keys(QUESTIONS).length * RULES.question;
      if (k === 'op') return (window.INCHEON_OPS || []).length * RULES.op;
      if (k.startsWith('find:')) return RULES.find[k.slice(5)];
      return RULES[k];
    };
    const earned = (k) => (['quiz', 'question', 'op'].includes(k)
      ? Object.keys(got).filter((x) => x.startsWith(`${k === 'question' ? 'q' : k}:`)).reduce((a, x) => a + got[x], 0)
      : got[k] || 0);
    openInfo('⭐', T('starInfoTitle'), `
      <p class="q-intro">${esc(T('starInfoLead'))}</p>
      <p class="star-total">${esc(T('starMine', starTotal(player), RULES.total))}</p>
      <div class="table-wrap"><table class="roster star-table"><tbody>
        ${T('starRows').map(([k, label, why]) => `<tr><td>${esc(label)}</td><td class="num"><b>${val(k)}</b></td><td>${esc(why)}</td><td class="num">${earned(k) ? `✓ ${earned(k)}` : ''}</td></tr>`).join('')}
      </tbody></table></div>`);
  }

  function updateChips() {
    if (!player) return;
    $('starChip').textContent = T('starChip', starTotal(player).toLocaleString());
    $('cardChip').textContent = T('cardChip', cardCount(), allCards().length);
  }

  // 길잡이 비둘기 파스의 말풍선
  function say(text) {
    const g = $('guide'), t = $('guideText');
    if (!g || !text) return;
    t.textContent = text;
    g.classList.remove('talk'); void g.offsetWidth; g.classList.add('talk');
    g.classList.remove('quiet');
  }
  function sayNext() {
    if (!player || previewMode) return;
    const ni = nextIndex();
    if (ni >= N) say(player.keyDone ? T('gAllDone') : T('gDoorReady'));
    else if (ni === 0 && !player.done.length) say(`${T('gHello', player.nick)} ${T('gHelloStars')}`);
    else if (chapterOf(STATIONS[ni]) === 'journey' && ni > 0 && chapterOf(STATIONS[ni - 1]) !== 'journey') say(T('gToColombia'));
    else if (chapterOf(STATIONS[ni]) === 'return' && ni > 0 && chapterOf(STATIONS[ni - 1]) !== 'return') say(T('gToIncheon'));
    else say(T('gNext', L(STATIONS[ni].name)));
  }

  /* =====================================================================
     🔑 이야기: 1950년대 전쟁의 기억 속에 들어온 우리 → 오늘로 돌아가려면 '내일의 문'을 열어야 해요.
     평화의 지도 조각 2개가 모일 때마다 열쇠 낱말이 하나씩 나타나고(모두 6개),
     마지막에 낱말을 순서대로 놓아 참전용사의 말 "전쟁 속의 형제, 평화 속의 형제"를 완성하면 문이 열려요.
     ===================================================================== */
  const KEY_N = 6;
  const KEY_REVEAL = [2, 3, 0, 5, 1, 4]; // 낱말이 나타나는 차례 (정답 순서와 달라야 퍼즐이 돼요)
  const keysFound = (p) => (p ? Math.min(KEY_N, Math.floor(doneCount(p) / 2)) : 0);
  const foundWords = (p) => KEY_REVEAL.slice(0, keysFound(p)).map((k) => T('keyWords')[k]);
  const normWord = (w) => String(w).toLowerCase().replace(/[.,;:!?¡¿“”"«»\s]/g, '');

  // 열쇠 낱말 칸 (게임 패널 · 임무 안내에 함께 써요)
  function keySlotsHtml() {
    const got = foundWords(player);
    return `<span class="key-slots">${Array.from({ length: KEY_N }, (_, k) => got[k]
      ? `<span class="kt">${esc(got[k])}</span>` : '<span class="kt empty">?</span>').join('')}</span>`;
  }
  function renderKeyRow() {
    const row = $('keyRow');
    if (!row) return;
    row.hidden = previewMode || !player;
    if (row.hidden) return;
    row.innerHTML = `<button type="button" class="key-label" id="keyInfo">${esc(T('keyLabel'))} <small>${keysFound(player)}/${KEY_N}</small></button>${keySlotsHtml()}`;
    $('keyInfo').addEventListener('click', openBriefing);
  }

  // 열쇠 낱말 r번째(나타난 차례) — 어느 작전 지점 두 곳에서 나왔는지 + 기억의 조각 한 줄
  const keyCard = (r) => ({ word: T('keyWords')[KEY_REVEAL[r]], from: T('keyFrom', 2 * r + 1, 2 * r + 2), memo: T('keyMemo')[r] });
  // 새 열쇠 낱말이 나타나면 잠깐 떠오르는 카드 (누르면 닫혀요)
  function showKeyPop(r) {
    const k = keyCard(r);
    const pop = document.createElement('div');
    pop.className = 'card-pop key-pop';
    pop.innerHTML = `<span class="card-pop-k">🔑 ${esc(T('keyLabel').replace(/^🔑\s*/, ''))} ${r + 1}/${KEY_N}</span>
      <div class="key-card"><b class="kt big">${esc(k.word)}</b><small>${esc(k.from)}</small><p>${esc(k.memo)}</p></div>`;
    pop.addEventListener('click', () => pop.classList.add('out'));
    document.body.appendChild(pop);
    setTimeout(() => pop.classList.add('out'), 5200);
    setTimeout(() => pop.remove(), 5700);
  }

  // 🧭 임무 안내 (처음 한 번 자동으로, 그다음엔 [🔑 열쇠 낱말]을 누르면)
  function openBriefing() {
    const got = keysFound(player);
    openInfo('🧭', T('briefTitle'), `<div class="brief">
        ${T('brief').map((p, k) => `<p><b>${k + 1}.</b> ${esc(p)}</p>`).join('')}
        <h4 class="brief-h">🗺️ ${esc(T('routeTitle'))}</h4>
        <ol class="route">${T('route').map(([L1, name, where, what]) => `
          <li class="route-${L1 === '🚪' ? 'T' : L1}"><b>${L1}</b><span><strong>${esc(name)}</strong> <small>${esc(where)}</small><em>${esc(what)}</em></span></li>`).join('')}</ol>
        <h4 class="brief-h">${esc(T('keyListTitle'))} (${got}/${KEY_N})</h4>
        <div class="brief-keys">${keySlotsHtml()}</div>
        ${got ? `<ul class="key-list">${Array.from({ length: got }, (_, r) => { const k = keyCard(r); return `<li><b class="kt">${esc(k.word)}</b> <small>${esc(k.from)}</small><p>${esc(k.memo)}</p></li>`; }).join('')}</ul>` : ''}
        <button type="button" class="btn btn-go" id="briefGo">${esc(T('briefGo'))}</button>
      </div>`);
    $('briefGo').addEventListener('click', () => { $('infoSheet').hidden = true; });
    if (player && !player.briefed && !previewMode) { player.briefed = Date.now(); save(); }
  }

  // 🚪 내일의 문: 열쇠 낱말 6개를 차례대로 놓아요
  function openDoor() {
    const words = foundWords(player);
    // 섞어서 보여 주기 (정답 순서와 다르게)
    const tiles = words.map((w, i) => ({ w, i })).sort((a, b) => ((a.i * 7 + 3) % KEY_N) - ((b.i * 7 + 3) % KEY_N));
    let picked = [];
    let tries = 0;
    openInfo('🚪', T('doorTitle'), `<div class="door" id="doorBox">
        <p class="door-story">${esc(T('doorStory'))}</p>
        <p class="door-hint" id="doorHint">💡 ${esc(T('doorHint1'))}</p>
        <div class="door-slots" id="doorSlots"></div>
        <div class="door-tiles" id="doorTiles">${tiles.map((t) => `<button type="button" class="door-tile" data-i="${t.i}">${esc(t.w)}</button>`).join('')}</div>
        <p class="door-msg" id="doorMsg" role="status"></p>
        <button type="button" class="btn btn-ghost btn-sm" id="doorReset">↺ ${esc(T('doorReset'))}</button>
      </div>`);
    const draw = () => {
      $('doorSlots').innerHTML = Array.from({ length: KEY_N }, (_, k) => picked[k] != null
        ? `<button type="button" class="ds filled" data-k="${k}">${esc(words[picked[k]])}</button>`
        : `<span class="ds">${k + 1}</span>`).join('');
      document.querySelectorAll('#doorTiles .door-tile').forEach((b) => { b.disabled = picked.includes(+b.dataset.i); });
      // 놓은 낱말을 누르면 다시 빼요
      document.querySelectorAll('#doorSlots .ds.filled').forEach((b) => b.addEventListener('click', () => { picked.splice(+b.dataset.k, 1); draw(); }));
    };
    const check = () => {
      const ok = picked.map((i) => normWord(words[i])).join('|') === T('keyWords').map(normWord).join('|');
      if (ok) {
        player.keyDone = Date.now();
        save();
        reportProgress('door');
        $('doorBox').classList.add('open');
        $('doorBox').innerHTML = `<div class="door-light" aria-hidden="true">🌅</div>
          <p class="door-quote">${esc(T('finishQuote'))}</p>
          <p class="door-open">${esc(T('doorOpen'))}</p>
          <button type="button" class="btn btn-go" id="doorGo">${esc(T('doorGo'))}</button>`;
        say(T('gDoorOpen'));
        renderPanel();
        $('doorGo').addEventListener('click', () => { $('infoSheet').hidden = true; openEnding(); });
        return;
      }
      tries++;
      $('doorMsg').textContent = T('doorWrong');
      $('doorBox').classList.remove('shake'); void $('doorBox').offsetWidth; $('doorBox').classList.add('shake');
      if (tries >= 1) $('doorHint').textContent = `💡 ${T('doorHint1')} ${T('doorHint2')}`;
      setTimeout(() => { picked = []; draw(); }, 900);
    };
    document.querySelectorAll('#doorTiles .door-tile').forEach((b) => b.addEventListener('click', () => {
      if (picked.length >= KEY_N) return;
      picked.push(+b.dataset.i);
      $('doorMsg').textContent = '';
      draw();
      if (picked.length === KEY_N) setTimeout(check, 250);
    }));
    $('doorReset').addEventListener('click', () => { picked = []; $('doorMsg').textContent = ''; draw(); });
    draw();
  }

  /* ---------------- 📡 진행 상황 자동 모으기 (구글 설문지로, 선택) ----------------
     서버 없이: 설문지의 formResponse 주소로 조용히 보내면 선생님의 응답 시트에 한 줄씩 쌓여요.
     인터넷이 끊겨도 게임은 그대로 (보내기만 실패) */
  const PF = CONFIG.progressForm || {};
  const reportOn = () => !SANDBOX && !!(PF.action && PF.entries && PF.entries.code); // 링크 모드는 다른 사이트로 보낼 수 없어요
  function reportProgress(event) {
    if (!reportOn() || previewMode || !player) return;
    try {
      const E = PF.entries;
      const body = new URLSearchParams();
      const put = (k, v) => { if (E[k]) body.append(E[k], String(v)); };
      put('nick', player.nick);
      put('code', makeCode(player));
      put('progress', `${doneCount(player)}/${N}${player.keyDone ? ' 🔑' : ''}`);
      put('stars', starTotal(player));
      put('cards', `${cardCount()}/${allCards().length} (✨${goldCount()})`);
      put('lang', lang);
      put('event', event);
      // sendBeacon: 페이지를 닫는 순간에도 보내져요. 안 되면 fetch(no-cors)로
      if (!(navigator.sendBeacon && navigator.sendBeacon(PF.action, body))) {
        fetch(PF.action, { method: 'POST', mode: 'no-cors', body }).catch(() => {});
      }
    } catch (e) { /* 보내기 실패는 조용히 */ }
  }

  /* ---------------- 진행 상황 ---------------- */
  const doneCount = (p) => { const i = STATIONS.findIndex((s) => !p.done.includes(s.id)); return i === -1 ? N : i; };
  const isDone = (id) => player && player.done.includes(id);
  const nextIndex = () => (player ? doneCount(player) : 0);
  const isUnlocked = (i) => previewMode || isDone(STATIONS[i].id) || i === nextIndex();

  /* =====================================================================
     나의 여정 코드 (6글자) — 서버 없이 기기를 옮기거나 선생님께 결과를 알릴 때
     담기는 것: 통과한 작전 지점 수 + 작전 지점별 퀴즈 결과(안 풂/맞음/틀림)
     ===================================================================== */
  const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 0·1·I·O 없음
  const CODE_LEN = 6;                     // 6글자 = 30비트
  const CODE_MOD = 1n << 30n;
  const CODE_MUL = 0x2D9E3B7n;            // 홀수 (되돌릴 수 있는 섞기)
  const CODE_ADD = 0x1A5C1F2n;
  const CODE_MUL_INV = (() => {
    let t = 0n, nt = 1n, r = CODE_MOD, nr = CODE_MUL;
    while (nr !== 0n) { const q = r / nr; [t, nt] = [nt, t - q * nt]; [r, nr] = [nr, r - q * nr]; }
    return ((t % CODE_MOD) + CODE_MOD) % CODE_MOD;
  })();
  const QUIZ_SPACE = Math.pow(3, N);
  const checksum = (p) => Math.imul((p ^ 0x2545F491) | 0, 0x9E3779B1 | 0) >>> 27; // 5비트

  function quizState(p, s) {
    const v = p.quiz[s.id];
    if (v === undefined || !s.quiz) return 0;
    return String(v) === String(s.quiz.answer) ? 1 : 2;
  }

  function makeCode(p) {
    let q = 0;
    for (let i = N - 1; i >= 0; i--) q = q * 3 + quizState(p, STATIONS[i]);
    const val = doneCount(p) * QUIZ_SPACE + q;
    let n = ((BigInt(val) * 32n + BigInt(checksum(val))) * CODE_MUL + CODE_ADD) % CODE_MOD;
    let out = '';
    for (let i = 0; i < CODE_LEN; i++) { out = CODE_ALPHABET[Number(n % 32n)] + out; n /= 32n; }
    return out.slice(0, 3) + '-' + out.slice(3);
  }

  function parseCode(input) {
    const clean = String(input).toUpperCase().replace(/[^0-9A-Z]/g, '');
    if (clean.length !== CODE_LEN) return null;
    let n = 0n;
    for (const ch of clean) {
      const d = CODE_ALPHABET.indexOf(ch);
      if (d < 0) return null;
      n = n * 32n + BigInt(d);
    }
    const full = (((n - CODE_ADD) % CODE_MOD + CODE_MOD) % CODE_MOD * CODE_MUL_INV) % CODE_MOD;
    const val = Number(full / 32n);
    if (checksum(val) !== Number(full % 32n)) return null;
    const k = Math.floor(val / QUIZ_SPACE);
    if (k > N) return null;
    let q = val % QUIZ_SPACE;
    const quiz = [];
    for (let i = 0; i < N; i++) { quiz.push(q % 3); q = Math.floor(q / 3); }
    // 아직 들어가지 않은 작전 지점에 퀴즈 기록이 있으면 틀린 코드
    for (let i = k + 1; i < N; i++) if (quiz[i] !== 0) return null;
    return { k, quiz };
  }

  // 코드 → 여정 기록
  function gameFromCode(nick, parsed) {
    const g = { id: newId(), nick, done: [], quiz: {}, answers: {}, created: Date.now(), updated: Date.now() };
    STATIONS.forEach((s, i) => {
      if (i < parsed.k) g.done.push(s.id);
      const st = parsed.quiz[i];
      if (st && s.quiz) {
        if (st === 1) g.quiz[s.id] = s.quiz.answer;
        else g.quiz[s.id] = s.quiz.type === 'ox' ? !s.quiz.answer : (s.quiz.answer === 0 ? 1 : 0);
      }
    });
    return g;
  }

  // 선생님 비밀번호 뒤섞기 (파일을 열어 봐도 비밀번호 글자가 보이지 않게 — 완전한 잠금은 아님)
  function teacherHash(text) {
    let h1 = 0x811c9dc5, h2 = 0x01000193;
    for (const ch of String(text)) {
      const c = ch.codePointAt(0);
      h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
      h2 = Math.imul(h2 + c, 0x5bd1e995) >>> 0;
    }
    return (h1 % 1679616).toString(36).padStart(4, '0') + (h2 % 1296).toString(36).padStart(2, '0');
  }

  /* =====================================================================
     시작 화면
     ===================================================================== */
  function nickProblem(nick) {
    if (!nick) return T('needNick');
    if (Array.from(nick).length > CONFIG.nicknameMaxLength) return T('tooLong', CONFIG.nicknameMaxLength);
    const low = nick.toLowerCase().replace(/\s/g, '');
    if ((CONFIG.bannedWords || []).some((w) => low.includes(w.toLowerCase()))) return T('banned');
    // 🧹 바른말 거르개 (js/filter.js): 욕설·비하·ㅗ·18·ㅋㅋㅋ·반복·이모지 …
    const why = window.WordFilter ? window.WordFilter.check(nick, 'nick') : '';
    return why ? T({ short: 'nickShort', chars: 'nickChars', jamo: 'nickJamo', repeat: 'nickRepeat', bad: 'banned' }[why]) : '';
  }
  // 문장(평화 다짐·이름·학교·방명록 글)용: 욕설·비하·장난 표현만 걸러요
  const textProblem = (text) => {
    const why = window.WordFilter ? window.WordFilter.check(text, 'text') : '';
    return why ? T(why === 'repeat' ? 'textRepeat' : 'textBad') : '';
  };

  function showStart() {
    previewMode = false;
    player = null;
    showScreen('startScreen');
    $('narration').innerHTML = T('narration').map((line, i) => `<span style="animation-delay:${0.3 + i * 1.1}s">${esc(line)}</span>`).join('\n');
    renderSaved();
  }

  function renderSaved() {
    const games = Object.values(store.games).sort((a, b) => b.updated - a.updated);
    $('savedBox').hidden = games.length === 0;
    $('savedList').innerHTML = games.map((g) => `
      <li>
        <span class="saved-nick">${esc(g.nick)}</span>
        <span class="saved-meta">${doneCount(g)} / ${N} · ${esc(fmtDate(g.updated))}</span>
        <button class="btn btn-blue btn-sm" type="button" data-id="${esc(g.id)}">${esc(T('continue'))}</button>
      </li>`).join('');
    $('savedList').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => startGame(store.games[b.dataset.id])));
  }

  function startGame(g) {
    player = g;
    store.last = g.id;
    save();
    enterGame();
  }

  $('startForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nick = $('nickInput').value.trim();
    const taken = nick && Object.values(store.games).some((g) => g.nick === nick);
    const err = nickProblem(nick) || (taken ? T('nickExists', nick) : '');
    $('startError').textContent = err;
    $('nickInput').classList.toggle('is-error', !!err);
    if (err) { $('nickInput').focus(); return; }
    const g = { id: newId(), nick, done: [], quiz: {}, answers: {}, created: Date.now(), updated: Date.now() };
    store.games[g.id] = g;
    $('nickInput').value = '';
    startGame(g);
    reportProgress('start');
  });

  $('resumeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nick = $('resumeNick').value.trim();
    const err = nickProblem(nick);
    if (err) { $('resumeError').textContent = err; return; }
    const parsed = parseCode($('resumeCode').value);
    if (!parsed) { $('resumeError').textContent = T('badCode'); $('resumeCode').classList.add('is-error'); return; }
    $('resumeError').textContent = '';
    $('resumeCode').classList.remove('is-error');
    const g = gameFromCode(nick, parsed);
    store.games[g.id] = g;
    $('resumeNick').value = ''; $('resumeCode').value = '';
    $('resumeFold').open = false;
    startGame(g);
  });

  $('teacherLogin').addEventListener('submit', (e) => {
    e.preventDefault();
    if (teacherHash($('teacherPw').value.trim()) === String(CONFIG.teacherPasswordHash)) {
      $('teacherPw').value = ''; $('teacherError').textContent = ''; $('teacherFold').open = false;
      showTeacher();
    } else {
      $('teacherError').textContent = T('wrongPw');
    }
  });

  $('playerChip').addEventListener('click', showStart);
  $('codeChip').addEventListener('click', showCode);
  $('cardChip').addEventListener('click', () => openAlbum());
  $('starChip').addEventListener('click', () => openStarInfo());
  document.querySelector('.guide-bird').addEventListener('click', () => $('guide').classList.toggle('quiet'));

  /* ---------------- 🌐 한국어 ⇄ Español ---------------- */
  $('langBtn').hidden = false;
  const langMenu = (open) => { $('langMenu').hidden = !open; $('langBtn').setAttribute('aria-expanded', String(open)); };
  $('langBtn').addEventListener('click', (e) => { e.stopPropagation(); langMenu($('langMenu').hidden); });
  $('langMenu').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-lang]');
    if (!b) return;
    langMenu(false);
    if (b.dataset.lang !== lang) setLang(b.dataset.lang);
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.lang-wrap')) langMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('langMenu').hidden) { langMenu(false); $('langBtn').focus(); } });
  function setLang(next) {
    lang = next;
    store.lang = lang;
    save();
    applyStaticText();
    $('infoSheet').hidden = true;
    $('guideText').textContent = ''; // 파스의 말풍선은 다음 말부터 새 언어로
    if (!$('startScreen').hidden) { showStart(); return; }
    if (!$('teacherScreen').hidden) { showTeacher(); return; }
    if (!$('endingScreen').hidden) { renderEnding(); updateChips(); return; }
    if (!$('gameScreen').hidden) {
      drawMap();
      renderPanel();
      updateChips();
      if (cur) {
        // 영상 목록이 언어마다 달라서 단계를 다시 만들고, 보던 단계로 돌아가요
        const before = cur.steps[cur.step];
        cur.steps = buildSteps(cur.s);
        const same = cur.steps.findIndex((x) => x.type === before.type && x.qid === before.qid && x.cid === before.cid);
        cur.step = same >= 0 ? same : Math.min(cur.step, cur.steps.length - 1);
        cur.video = 0;
        $('sheetTitle').textContent = L(cur.s.name);
        showLayer(cur.s.offMap ? 'world' : cur.s.inset === 'incheon' ? 'incheon' : null);
        focusStation(cur.s);
        renderStep();
      } else sayNext();
    }
  }

  /* =====================================================================
     지도
     ===================================================================== */
  const P = (lon, lat) => [+((lon - 124) * 80).toFixed(1), +((43 - lat) * 100).toFixed(1)];
  const COAST = [
    [124.35, 40.05], [124.9, 40.45], [125.6, 40.75], [126.3, 41.2], [126.9, 41.75], [127.3, 41.5], [128.0, 41.55], [128.2, 41.95],
    [128.9, 42.05], [129.6, 42.4], [129.95, 42.95], [130.25, 42.7], [130.65, 42.3], [130.2, 42.15], [129.8, 41.8], [129.7, 41.45],
    [129.5, 41.0], [129.2, 40.7], [128.9, 40.45], [128.6, 40.25], [128.2, 40.0], [127.8, 39.85], [127.5, 39.7], [127.55, 39.35],
    [127.4, 39.15], [127.75, 38.95], [128.1, 38.72], [128.35, 38.55], [128.6, 38.2], [128.9, 37.8], [129.1, 37.5], [129.35, 37.1],
    [129.45, 36.6], [129.4, 36.15], [129.57, 36.02], [129.45, 35.6], [129.3, 35.3], [129.05, 35.05], [128.7, 34.9], [128.4, 34.83],
    [128.0, 34.87], [127.7, 34.72], [127.4, 34.5], [127.1, 34.56], [126.8, 34.42], [126.5, 34.3], [126.28, 34.55], [126.35, 34.82],
    [126.45, 35.1], [126.38, 35.42], [126.55, 35.7], [126.7, 35.97], [126.55, 36.2], [126.45, 36.45], [126.15, 36.7], [126.33, 36.88],
    [126.75, 36.95], [126.85, 37.02], [126.7, 37.2], [126.6, 37.4], [126.55, 37.6], [126.5, 37.75], [126.2, 37.78], [125.95, 37.72],
    [125.7, 37.92], [125.3, 37.7], [125.0, 37.87], [124.72, 38.1], [125.0, 38.4], [125.2, 38.6], [125.1, 38.8], [125.35, 38.95],
    [125.15, 39.25], [125.3, 39.45], [124.95, 39.6], [124.6, 39.78]
  ];
  const DMZ = [[126.1, 37.75], [126.68, 37.96], [127.05, 38.25], [127.6, 38.3], [128.1, 38.3], [128.37, 38.6]];

  let tokenEl = null;
  let tokenAt = null;
  let newPiece = null; // 방금 얻은 지도 조각 (작전 지점 id) — 안개가 걷히는 모습을 보여 줄 때

  // 두 점을 살짝 휘어진 길로 잇기 (보드게임 말판 느낌)
  function curve(a, b, i) {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    const bend = Math.min(40, len * 0.18) * (i % 2 ? 1 : -1);
    return `Q${(mx - (dy / len) * bend).toFixed(1)} ${(my + (dx / len) * bend).toFixed(1)} ${b.x} ${b.y}`;
  }
  function pathThrough(list, uptoCount) {
    if (list.length === 0) return '';
    let d = `M${list[0].map.x} ${list[0].map.y}`;
    for (let i = 1; i < Math.min(list.length, uptoCount); i++) d += ' ' + curve(list[i - 1].map, list[i].map, i);
    return d;
  }

  function drawMap() {
    const svg = $('map');
    svg.innerHTML = '';

    const defs = svgEl('defs', {}, svg);
    const clip = svgEl('clipPath', { id: 'tokClip' }, defs);
    svgEl('circle', { cx: 0, cy: -30, r: 13 }, clip);
    const landD = 'M' + COAST.map((c) => P(...c).join(' ')).join(' L') + ' Z';
    svgEl('path', { d: landD }, svgEl('clipPath', { id: 'landClip' }, defs));
    // 전쟁 흐름 화살표 머리
    [['arrowRed', 'var(--war-red)'], ['arrowBlue', 'var(--war-blue)']].forEach(([id, color]) => {
      const m = svgEl('marker', { id, viewBox: '0 0 10 10', refX: 6, refY: 5, markerWidth: 4, markerHeight: 4, orient: 'auto-start-reverse' }, defs);
      svgEl('path', { d: 'M0 0 L10 5 L0 10 Z', fill: color }, m);
    });

    svgEl('rect', { x: -400, y: -400, width: 1400, height: 1900, class: 'm-sea' }, svg);
    for (let y = 360; y < 1000; y += 90) {
      for (let x = (y / 90) % 2 ? 40 : 90; x < 600; x += 130) {
        svgEl('path', { d: `M${x} ${y} q8 -6 16 0 t16 0`, fill: 'none', stroke: 'var(--sea-line)', 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
      }
    }
    svgEl('path', { d: landD, class: 'm-land' }, svg);
    const [jx, jy] = P(126.55, 33.38);
    svgEl('ellipse', { cx: jx, cy: jy, rx: 30, ry: 16, class: 'm-land' }, svg);
    // 전쟁 흐름 층 (① 작전 지점 타임라인에서 채워짐)
    svgEl('g', { id: 'warLayer' }, svg);

    const [, y38] = P(0, 38);
    svgEl('line', { x1: 50, y1: y38, x2: 580, y2: y38, class: 'm-line38' }, svg);
    svgEl('text', { x: 582, y: y38 - 8, class: 'm-text small l38', 'text-anchor': 'end' }, svg).textContent = T('line38');
    svgEl('path', { d: 'M' + DMZ.map((c) => P(...c).join(' ')).join(' L'), class: 'm-dmz' }, svg);
    const [dx, dy] = P(128.4, 38.62);
    svgEl('text', { x: dx + 6, y: dy - 6, class: 'm-text small ldmz' }, svg).textContent = T('dmz');

    const [px, py] = P(125.75, 39.03);
    svgEl('circle', { cx: px, cy: py, r: 5, fill: 'var(--ink-soft)' }, svg);
    svgEl('text', { x: px + 10, y: py + 5, class: 'm-text' }, svg).textContent = T('pyongyang');
    svgEl('text', { x: 40, y: 650, class: 'm-sea-name' }, svg).textContent = T('seaW');
    svgEl('text', { x: 470, y: 420, class: 'm-sea-name' }, svg).textContent = T('seaE');
    svgEl('text', { x: 300, y: 900, class: 'm-sea-name' }, svg).textContent = T('seaS');

    // 🧩 평화의 지도 조각: 처음엔 빛바랜 안개, 작전 지점을 통과할 때마다 그 둘레가 되살아나요
    if (!previewMode && player) {
      const doneList = STATIONS.filter((s) => isDone(s.id));
      const complete = doneList.length === N;
      if (!complete || newPiece) {
        const pat = svgEl('pattern', { id: 'fogPat', width: 14, height: 14, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' }, defs);
        svgEl('rect', { width: 14, height: 14, fill: '#f1ead7' }, pat);
        svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 14, stroke: '#e3d7b6', 'stroke-width': 3 }, pat);
        const mask = svgEl('mask', { id: 'fogMask' }, defs);
        svgEl('rect', { x: -400, y: -400, width: 1400, height: 1900, fill: '#fff' }, mask);
        doneList.forEach((s) => {
          const fresh = s.id === newPiece;
          const hole = svgEl('circle', { cx: s.map.x, cy: s.map.y, r: fresh ? 0 : 115, fill: '#000', class: 'fog-hole' }, mask);
          if (fresh) setTimeout(() => hole.setAttribute('r', 115), 400);
        });
        const fog = svgEl('rect', { x: -400, y: -400, width: 1400, height: 1900, class: 'fog', mask: 'url(#fogMask)' }, svg);
        if (complete) setTimeout(() => fog.classList.add('fog-clear'), 1500); // 마지막 조각 → 안개가 모두 걷혀요
      }
      newPiece = null;
    }

    const col = STATIONS.find((s) => s.offMap);
    if (col) {
      svgEl('path', { d: `M615 1000 Q590 960 ${col.map.x + 18} ${col.map.y + 14}`, class: 'm-voyage' }, svg);
      svgEl('text', { x: 585, y: 992, class: 'm-text small', 'text-anchor': 'end' }, svg).textContent = T('fromCol');
    }

    // 길: 프롤로그(파란 점선) / 콜롬비아대대의 여정(회색 점선 → 지나간 곳은 빨간 실선)
    const ni = nextIndex();
    // 여정 길: 모든 작전 지점을 순서대로 잇고, 지나온 길은 빨간 실선
    svgEl('path', { d: pathThrough(STATIONS, N), class: 'm-route' }, svg);
    if (ni > 0) svgEl('path', { d: pathThrough(STATIONS, Math.min(ni + 1, N)), class: 'm-route-done' }, svg);

    // 🔍 인천 돋보기: 한반도 지도 위에 언제나 떠 있는 인천 확대 지도 (5대 작전 + 기념비)
    drawLens(svg, defs);

    STATIONS.forEach((s, i) => {
      const state = isDone(s.id) ? 'done' : i === ni ? 'next' : (previewMode ? 'open' : 'locked');
      const g = svgEl('g', { class: `m-stop ${state} ch-${chapterOf(s)}`, transform: `translate(${s.map.x} ${s.map.y})`, tabindex: state === 'locked' ? -1 : 0, role: 'button', 'aria-label': `${i + 1}. ${L(s.name)}` }, svg);
      svgEl('circle', { class: 'ring', r: 20 }, g);
      svgEl('circle', { class: 'dot', r: 18 }, g);
      svgEl('text', { class: 'num' }, g).textContent = state === 'done' ? '✓' : i + 1;
      if (state !== 'locked') {
        const open = () => openStation(i);
        g.addEventListener('click', open);
        g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      }
      if (state === 'next') {
        const pos = { right: [28, 6, 'start'], left: [-28, 6, 'end'], top: [0, -70, 'middle'], /* 말(핀) 위로 */ bottom: [0, 42, 'middle'] }[s.label || 'right'];
        svgEl('text', { x: s.map.x + pos[0], y: s.map.y + pos[1], 'text-anchor': pos[2], class: 'm-label' }, svg).textContent = L(s.name);
      }
    });

    tokenEl = svgEl('g', { id: 'token' }, svg);
    svgEl('path', { d: 'M0 -2 C-5 -10 -17 -17 -17 -30 A17 17 0 1 1 17 -30 C17 -17 5 -10 0 -2Z', fill: '#fff', stroke: 'var(--ink)', 'stroke-width': 2.5 }, tokenEl);
    const flag = svgEl('g', { 'clip-path': 'url(#tokClip)' }, tokenEl);
    svgEl('rect', { x: -13, y: -43, width: 26, height: 13, fill: 'var(--co-yellow)' }, flag);
    svgEl('rect', { x: -13, y: -30, width: 26, height: 6.5, fill: 'var(--co-blue)' }, flag);
    svgEl('rect', { x: -13, y: -23.5, width: 26, height: 6.5, fill: 'var(--co-red)' }, flag);
    if (previewMode) tokenEl.style.display = 'none';
    placeToken(Math.min(ni, N - 1), false);
    // 지금 열어 본 작전 지점 강조 (지도 확대할 때)
    svgEl('g', { id: 'focusLayer' }, svg);
    setViewBox(cam);
    if (atlasOn) requestAnimationFrame(drawAtlas);
  }

  function placeToken(i, animate) {
    if (!tokenEl) return;
    const s = STATIONS[i].map;
    if (!animate) tokenEl.style.transition = 'none';
    tokenEl.style.transform = `translate(${s.x}px, ${s.y - 14}px)`;
    if (!animate) { tokenEl.getBoundingClientRect(); tokenEl.style.transition = ''; }
    tokenAt = i;
  }

  /* ---------------- 카메라: 작전 지점으로 확대 / 전체 보기 ---------------- */
  const FULL = [30, 330, 560, 670];
  let cam = FULL.slice();
  let camRaf = 0;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setViewBox(v) {
    cam = v;
    $('map').setAttribute('viewBox', v.map((n) => n.toFixed(1)).join(' '));
  }
  function flyTo(target, ms = 900) {
    cancelAnimationFrame(camRaf);
    if (reduceMotion || ms === 0) { setViewBox(target.slice()); return; }
    const from = cam.slice();
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      setViewBox(from.map((f, i) => f + (target[i] - f) * e));
      if (k < 1) camRaf = requestAnimationFrame(step);
    };
    camRaf = requestAnimationFrame(step);
  }
  // 작전 지점 주변을 보여 줄 확대 상자 (s.zoom = 보여 줄 가로 폭, false = 확대 안 함)
  function zoomBox(s) {
    if (s.timeline) return [10, 40, 590, 960]; // 전쟁 흐름은 한반도 전체(압록강까지)를 보여 줘요
    if (s.zoom === false) return FULL.slice();
    const W = s.zoom || 250;
    const H = W * FULL[3] / FULL[2];
    const x = Math.max(-60, Math.min(s.map.x - W / 2, 650 - W));
    const y = Math.max(300, Math.min(s.map.y - H / 2, 1040 - H));
    return [x, y, W, H];
  }
  function focusStation(s) {
    const layer = $('focusLayer');
    if (!layer) return;
    layer.innerHTML = '';
    if (!s || s.offMap) return;
    svgEl('circle', { cx: s.map.x, cy: s.map.y, r: 26, class: 'm-focus' }, layer);
    const t = svgEl('text', { x: s.map.x, y: s.map.y + 46, 'text-anchor': 'middle', class: 'm-label m-focus-label' }, layer);
    t.textContent = L(s.name);
  }
  $('mapHome').addEventListener('click', () => flyTo(FULL.slice()));

  /* ---------------- ① 전쟁 흐름: 지도 위 전선이 움직여요 ----------------
     zone = 북한군·중국군이 차지한 곳 (육지 모양으로 잘라서 칠함), line = 전선, arrows = 움직인 방향
     좌표는 [경도, 위도] — 대략적인 모습이에요 */
  const TOP = [[131.5, 43.5], [123.5, 43.5]];
  const FRONTS = {
    start: {
      line: [[124.5, 38], [129.0, 38]],
      arrows: [{ c: 'red', from: [126.9, 38.5], to: [127.0, 37.5] }, { c: 'red', from: [128.1, 38.6], to: [128.4, 37.6] }]
    },
    nakdong: {
      line: [[128.25, 34.85], [128.45, 35.4], [128.38, 35.85], [128.55, 36.15], [129.0, 36.25], [129.55, 36.1]],
      edgeStart: [128.25, 33.0], edgeEnd: [131.5, 36.1], tail: [[123.5, 33.0]], // 남서쪽까지 모두 칠하기
      arrows: [{ c: 'red', from: [127.2, 37.3], to: [127.9, 35.9] }, { c: 'red', from: [126.8, 36.4], to: [127.6, 35.3] }]
    },
    north: {
      line: [[124.4, 40.0], [125.4, 40.6], [126.5, 41.1], [127.6, 41.2], [128.6, 41.6], [129.7, 41.9], [130.5, 42.3]],
      arrows: [{ c: 'blue', from: [125.9, 37.25], to: [126.55, 37.45] }, { c: 'blue', from: [126.9, 37.8], to: [126.3, 39.9] }, { c: 'blue', from: [128.9, 36.5], to: [128.3, 39.7] }]
    },
    retreat: {
      line: [[124.5, 37.0], [126.9, 37.05], [127.6, 37.1], [128.3, 37.2], [129.4, 37.35]],
      arrows: [{ c: 'red', from: [126.4, 39.6], to: [127.0, 37.4] }, { c: 'red', from: [128.0, 39.6], to: [128.2, 37.5] }]
    },
    dmz: { line: [[124.5, 37.75], ...DMZ], arrows: [], fight: true },
    armistice: { line: [[124.5, 37.75], ...DMZ], arrows: [], final: true }
  };

  function setWarPhase(key) {
    const layer = $('warLayer');
    const cap = $('mapCaption');
    if (!layer) return;
    layer.innerHTML = '';
    if (!key || !FRONTS[key]) { cap.hidden = true; return; }
    const f = FRONTS[key];
    const g = svgEl('g', { class: 'war-phase' }, layer);
    // 북쪽이 차지한 곳: 전선 위쪽 전체를 육지 모양으로 잘라 칠하기
    const a = f.edgeStart || [f.line[0][0] - 1, f.line[0][1]];
    const b = f.edgeEnd || [f.line[f.line.length - 1][0] + 3, f.line[f.line.length - 1][1]];
    const zone = [a, ...f.line, b, ...TOP, ...(f.tail || [])];
    svgEl('path', { d: 'M' + zone.map((c) => P(...c).join(' ')).join(' L') + ' Z', class: 'war-zone', 'clip-path': 'url(#landClip)' }, g);
    const lineD = 'M' + f.line.map((c) => P(...c).join(' ')).join(' L');
    svgEl('path', { d: lineD, class: 'war-line-casing' }, g);
    svgEl('path', { d: lineD, class: `war-line${f.final ? ' final' : ''}${f.fight ? ' fight' : ''}` }, g);
    f.arrows.forEach((ar, i) => {
      const [x1, y1] = P(...ar.from), [x2, y2] = P(...ar.to);
      svgEl('path', {
        d: `M${x1} ${y1} Q${(x1 + x2) / 2 + (i % 2 ? 14 : -14)} ${(y1 + y2) / 2} ${x2} ${y2}`,
        class: `war-arrow ${ar.c}`, 'marker-end': `url(#${ar.c === 'red' ? 'arrowRed' : 'arrowBlue'})`
      }, g);
    });
    // 지도 위 설명
    const t = cur && cur.s.timeline ? cur.s.timeline.find((x) => x.front === key) : null;
    cap.innerHTML = `${t ? `<b>${esc(L(t.date))}</b><span>${esc(L(t.text))}</span>` : ''}
      <span class="legend"><i class="lg-zone"></i>${esc(T('legendNorth'))}<i class="lg-line"></i>${esc(T('legendFront'))}</span>`;
    cap.hidden = false;
  }

  /* ---------------- ③ 세계 지도: 콜롬비아 → 태평양 → 부산 ---------------- */
  // 태평양 가운데 지도 (경도 100°E ~ 300°E(=60°W), 위도 60°N ~ 16°S). 대륙 모양은 아주 단순하게 그렸어요.
  const WP = (lon, lat) => { const e = lon < 0 ? lon + 360 : lon; return [+((e - 100) * 4).toFixed(1), +((60 - lat) * 4).toFixed(1)]; };
  const WORLD = [
    // 아시아 (중국·러시아 동쪽 해안 + 한반도)
    [[100, 61], [155, 61], [163, 58], [157, 51], [156, 57], [143, 59], [137, 54], [141, 52], [140, 48], [135, 43], [130, 42.5], [129.5, 41], [128, 39],
      [129.3, 37], [129.4, 35.3], [126.5, 34.3], [126.3, 37], [126.6, 37.7], [125, 38], [124.5, 40], [121.5, 39], [122, 40.8], [119, 39.2], [118, 38.5],
      [119.5, 37], [122.5, 37.2], [120.5, 36], [119.2, 35], [120.9, 32], [121.9, 30.8], [119.8, 26], [117, 23.5], [113, 22.3], [110.5, 20.3], [109, 21.5],
      [108, 21.5], [105.8, 19], [106.6, 17.5], [108.8, 15.5], [109.2, 12], [106.8, 10.4], [104.8, 8.6], [103, 10.5], [100.5, 13.5], [99, 13.5], [99, 61]],
    // 일본
    [[130, 31.3], [131.4, 31.4], [132, 33.8], [135, 33.5], [136.9, 34.3], [139.8, 34.9], [140.9, 36], [140.9, 38.3], [141.9, 39.5], [141.5, 41.3], [140.3, 41.3],
      [139.9, 40.5], [140, 39], [138.8, 37.8], [137, 37], [136.7, 37.3], [135.5, 35.6], [133, 35.5], [131, 34.4], [129.7, 33.4]],
    [[140, 41.6], [141.2, 41.8], [143.3, 42], [145.5, 43.3], [144, 44], [141.7, 45.4], [141.3, 43.2], [140, 42.5]],
    // 타이완·필리핀·보르네오·뉴기니·호주 북쪽
    [[120.1, 23], [121, 25.2], [122, 25], [121.4, 22.2], [120.8, 21.9]],
    [[120, 18.5], [122.3, 18.5], [122, 14], [124, 13], [126, 9], [125.5, 6], [122, 7], [123, 10], [121, 13.5], [119.8, 16]],
    [[109, 1.5], [111, 2], [113, 3.5], [115.5, 5], [117.5, 7], [119, 5], [118, 1], [116, -3.5], [114, -3.5], [110.5, -3], [109, -1]],
    [[131, -1.5], [135, -3.5], [138, -1.8], [141, -2.6], [145, -4.5], [147.5, -6.5], [150, -10.5], [147, -10], [143, -9], [141, -9.2], [138, -8.3], [137.5, -5], [133, -4]],
    [[129, -17], [130, -11.5], [132, -11.2], [136.8, -12.1], [135.5, -15], [140, -17.5], [141.5, -12.5], [142.5, -10.8], [143.6, -14], [145.5, -17]],
    // 아메리카 (알래스카 → 북미 서해안 → 중미 → 남미 태평양 쪽, 카리브해는 비워 둠)
    [[-165, 61], [-161, 58], [-158, 57], [-154, 56], [-150, 59.5], [-146, 60.3], [-140, 59.7], [-136, 58], [-134, 56], [-132, 54], [-130, 52], [-127.5, 50],
      [-125, 48.5], [-124, 46], [-124.2, 43], [-124, 40.5], [-122.5, 38], [-121, 36], [-119, 34.4], [-117.2, 32.5], [-115, 30], [-114, 28], [-112, 26],
      [-110, 24], [-109, 23], [-105.5, 23], [-106, 20], [-105, 19], [-102, 18], [-98, 16], [-95, 15.8], [-92, 14.5], [-90, 13], [-88, 11], [-86, 9.5],
      [-84, 8.5], [-82, 8], [-80, 8.3], [-78.3, 8], [-77.3, 7.5], [-77.5, 5], [-77.8, 3], [-79, 1.5], [-80, 0], [-80.5, -2.5], [-81, -4], [-81.2, -6],
      [-80, -8], [-79, -10], [-77, -13], [-75.5, -15], [-74, -17], [-58, -17],
      [-58, 10.5], [-65, 10.6], [-69, 11.5], [-72, 11.7], [-74.2, 11.3], [-75.5, 10.5], [-76.8, 8.8], [-78, 9.3], [-79.5, 9.6], [-83, 10], [-83.6, 11.5],
      [-83.7, 13.5], [-83.2, 15], [-87.5, 15.8], [-88.2, 16.5], [-87.5, 18.5], [-87.3, 21.3], [-90, 21.2], [-90.5, 19], [-92, 18.5], [-94.5, 18.3],
      [-96, 19.5], [-97.2, 22], [-97.5, 25], [-97, 26], [-97.4, 27.8], [-96, 29.5], [-94, 29.8], [-90, 30.2], [-85, 29.8], [-83.5, 26], [-81, 25.2],
      [-80, 27], [-80.8, 30.5], [-81, 32], [-78, 34], [-76, 35.3], [-76, 37], [-75, 38.5], [-74, 39.5], [-71, 41.5], [-70, 42], [-58, 45], [-58, 61]]
  ];
  const COL_PORT = [-77.1, 3.9];   // 콜롬비아 태평양 항구 (부에나벤투라 부근)
  const BUSAN = [129.04, 35.1];
  let shipRaf = 0;

  function drawWorld() {
    const svg = $('world');
    svg.innerHTML = '';
    svgEl('rect', { x: -20, y: -20, width: 840, height: 344, class: 'w-sea' }, svg);
    for (let y = 30; y < 300; y += 44) {
      for (let x = (y / 44) % 2 ? 250 : 300; x < 620; x += 110) {
        svgEl('path', { d: `M${x} ${y} q6 -5 12 0 t12 0`, fill: 'none', stroke: 'var(--sea-line)', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, svg);
      }
    }
    WORLD.forEach((poly) => svgEl('path', { d: 'M' + poly.map((c) => WP(...c).join(' ')).join(' L') + ' Z', class: 'w-land' }, svg));
    // 한국·콜롬비아 강조
    svgEl('path', { d: 'M' + COAST.filter((c) => c[1] < 38.6).map((c) => WP(...c).join(' ')).join(' L') + ' Z', class: 'w-korea' }, svg);
    const [cx, cy] = WP(-74, 4.5);
    svgEl('circle', { cx, cy, r: 9, class: 'w-colombia' }, svg);
    svgEl('text', { x: WP(-150, 25)[0], y: WP(-150, 25)[1], class: 'w-ocean', 'text-anchor': 'middle' }, svg).textContent = T('worldPacific');

    const [x1, y1] = WP(...COL_PORT), [x2, y2] = WP(...BUSAN);
    const d = `M${x1} ${y1} C${x1 - 120} ${y1 - 40} ${x2 + 200} ${y2 - 90} ${x2} ${y2}`;
    svgEl('path', { d, class: 'w-route-bg' }, svg);
    const route = svgEl('path', { d, class: 'w-route' }, svg);

    const label = (x, y, text, anchor) => svgEl('text', { x, y, class: 'w-label', 'text-anchor': anchor }, svg).textContent = text;
    label(cx - 6, cy + 30, T('worldCol'), 'end');
    label(x2 + 8, y2 + 26, T('worldKor'), 'start');
    svgEl('text', { x: 440, y: 58, class: 'w-dist', 'text-anchor': 'middle' }, svg).textContent = `${T('worldVoyage')} · ${T('worldDist')}`;

    const ship = svgEl('g', { class: 'w-ship' }, svg);
    svgEl('circle', { r: 11, class: 'w-ship-bg' }, ship);
    svgEl('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'w-ship-icon' }, ship).textContent = '🚢';

    // 배가 콜롬비아에서 부산까지 태평양을 건너가요
    cancelAnimationFrame(shipRaf);
    const len = route.getTotalLength();
    route.style.strokeDasharray = `${len}`;
    const dur = reduceMotion ? 0 : 5200;
    const t0 = performance.now();
    const step = (now) => {
      const k = dur ? Math.min(1, (now - t0) / dur) : 1;
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const p = route.getPointAtLength(len * e);
      ship.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
      route.style.strokeDashoffset = `${len * (1 - e)}`;
      if (k < 1) shipRaf = requestAnimationFrame(step);
      else if (cur && cur.s.offMap) giveStars('voyage', RULES.voyage, $('world')); // 25일 동안의 항해
    };
    shipRaf = requestAnimationFrame(step);
  }

  /* ---------------- ② 인천 확대 지도: 아이들이 조사한 5대 작전 ---------------- */
  // 인천 앞바다만 크게 (경도 126.2~126.92, 위도 37.16~37.8). 섬 모양은 단순하게 그렸어요.
  const IP = (lon, lat) => [+((lon - 126.2) * 1000).toFixed(1), +((37.8 - lat) * 1250).toFixed(1)];
  const INCH_LAND = {
    main: [[126.53, 37.81], [126.53, 37.72], [126.57, 37.66], [126.60, 37.60], [126.63, 37.555], [126.61, 37.52], [126.605, 37.49], [126.615, 37.472],
      [126.63, 37.455], [126.645, 37.43], [126.68, 37.40], [126.70, 37.37], [126.74, 37.335], [126.76, 37.30], [126.80, 37.26], [126.86, 37.22],
      [126.93, 37.20], [126.93, 37.81]],
    ganghwa: [[126.37, 37.79], [126.52, 37.79], [126.535, 37.70], [126.50, 37.62], [126.43, 37.595], [126.36, 37.64], [126.33, 37.72]],
    gyodong: [[126.22, 37.80], [126.30, 37.80], [126.31, 37.76], [126.24, 37.75]],
    yeongjong: [[126.40, 37.50], [126.48, 37.525], [126.56, 37.51], [126.585, 37.49], [126.55, 37.455], [126.47, 37.44], [126.41, 37.46]],
    yeongheung: [[126.43, 37.285], [126.49, 37.285], [126.52, 37.255], [126.50, 37.225], [126.44, 37.23], [126.42, 37.255]],
    daebu: [[126.55, 37.29], [126.62, 37.28], [126.64, 37.23], [126.57, 37.21], [126.54, 37.24]]
  };
  const FLEET_ROUTE = [[126.20, 37.17], [126.33, 37.25], [126.45, 37.32], [126.505, 37.345], [126.55, 37.40], [126.575, 37.44], [126.592, 37.468]];
  const opColor = { xray: 'var(--co-blue)', palmido: '#d99a00', wolmido: 'var(--war-red)', port: 'var(--war-red)', bupyeong: 'var(--tk-blue)' };

  function drawIncheon() {
    const svg = $('incheon');
    svg.innerHTML = '';
    const names = T('inchNames');
    svgEl('rect', { x: -40, y: -40, width: 800, height: 880, class: 'w-sea' }, svg);
    for (let y = 60; y < 800; y += 80) {
      for (let x = (y / 80) % 2 ? 30 : 90; x < 700; x += 140) {
        svgEl('path', { d: `M${x} ${y} q8 -6 16 0 t16 0`, fill: 'none', stroke: 'var(--sea-line)', 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
      }
    }
    Object.values(INCH_LAND).forEach((poly) => svgEl('path', { d: 'M' + poly.map((c) => IP(...c).join(' ')).join(' L') + ' Z', class: 'm-land' }, svg));
    [[126.597, 37.476, 9, 7], [126.511, 37.358, 6, 5]].forEach(([lo, la, rx, ry]) => {
      const [x, y] = IP(lo, la);
      svgEl('ellipse', { cx: x, cy: y, rx, ry, class: 'm-land' }, svg);
    });
    const label = (lo, la, text, cls = 'i-place', anchor = 'middle') => {
      const [x, y] = IP(lo, la);
      svgEl('text', { x, y, class: cls, 'text-anchor': anchor }, svg).textContent = text;
    };
    label(126.44, 37.70, names.ganghwa);
    label(126.265, 37.735, names.gyodong);
    label(126.47, 37.502, names.yeongjong);
    label(126.485, 37.19, names.yeongheung);
    label(126.59, 37.198, names.daebu);
    label(126.80, 37.39, T('inchCity'), 'i-city');
    label(126.30, 37.45, names.sea, 'm-sea-name');

    // 함대가 들어온 바닷길 (비류수도)
    const routeD = 'M' + FLEET_ROUTE.map((c) => IP(...c).join(' ')).join(' L');
    svgEl('path', { d: routeD, class: 'i-route' }, svg);
    label(126.36, 37.19, `⛴ ${T('inchRoute')}`, 'i-note');
    // 서울 쪽 화살표
    const [sx1, sy1] = IP(126.74, 37.50), [sx2, sy2] = IP(126.90, 37.53);
    svgEl('path', { d: `M${sx1} ${sy1} L${sx2} ${sy2}`, class: 'i-seoul' }, svg);
    label(126.86, 37.555, T('inchSeoul'), 'i-note');
    // 경명공원 (⑩ 작전 지점) 자리
    const [mx, my] = IP(126.675, 37.548);
    svgEl('path', { d: `M${mx} ${my - 11} l3.2 7 7.6 .8 -5.7 5 1.7 7.4 -6.8 -3.9 -6.8 3.9 1.7 -7.4 -5.7 -5 7.6 -.8z`, class: 'i-memorial' }, svg);
    label(126.675, 37.567, T('inchMemorial'), 'i-note');

    // 작전 효과 층 + 핀
    svgEl('g', { id: 'opFx' }, svg);
    const ops = window.INCHEON_OPS || [];
    ops.forEach((op, k) => {
      const [x, y] = IP(...op.pin);
      const g = svgEl('g', { class: 'op-pin', 'data-op': op.id, transform: `translate(${x} ${y})`, tabindex: 0, role: 'button', 'aria-label': `${k + 1}. ${L(op.name)}` }, svg);
      svgEl('circle', { r: 22, class: 'op-ring' }, g);
      svgEl('circle', { r: 17, class: 'op-dot', style: `fill:${opColor[op.id] || 'var(--co-red)'}` }, g);
      svgEl('text', { class: 'num' }, g).textContent = k + 1;
      const side = op.id === 'bupyeong' || op.id === 'port' ? 1 : -1;
      svgEl('text', { x: side * 26, y: 6, 'text-anchor': side > 0 ? 'start' : 'end', class: 'm-label op-name' }, g).textContent = L(op.short || op.name);
      const pick = () => { if (cur) { const i = cur.steps.findIndex((s) => s.type === 'ops'); if (i >= 0 && cur.step !== i) { cur.step = i; renderStep(); } selectOp(k); } };
      g.addEventListener('click', pick);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
  }

  // 작전을 고르면 지도 위에 그 작전의 움직임을 보여 줘요
  function showOpFx(id) {
    const fx = $('opFx');
    if (!fx) return;
    fx.innerHTML = '';
    document.querySelectorAll('#incheon .op-pin').forEach((p) => p.classList.toggle('sel', p.dataset.op === id));
    const at = (c) => IP(...c);
    if (id === 'xray') {
      const [x, y] = at([126.47, 37.25]);
      svgEl('circle', { cx: x, cy: y, r: 60, class: 'fx-spy' }, fx);
      // 영흥도에서 인천 바다를 몰래 살피는 눈길
      [[126.55, 37.40], [126.60, 37.47]].forEach((c) => { const [x2, y2] = at(c); svgEl('path', { d: `M${x} ${y} L${x2} ${y2}`, class: 'fx-look' }, fx); });
    } else if (id === 'palmido') {
      const [x, y] = at([126.511, 37.358]);
      svgEl('path', { d: `M${x} ${y} L${x - 150} ${y + 40} A160 160 0 0 1 ${x - 120} ${y - 90} Z`, class: 'fx-beam' }, fx);
      svgEl('path', { d: `M${x} ${y} L${x + 120} ${y - 110} A160 160 0 0 1 ${x + 150} ${y - 20} Z`, class: 'fx-beam' }, fx);
      svgEl('path', { d: 'M' + FLEET_ROUTE.map((c) => at(c).join(' ')).join(' L'), class: 'fx-fleet' }, fx);
    } else if (id === 'wolmido' || id === 'port') {
      svgEl('path', { d: 'M' + FLEET_ROUTE.map((c) => at(c).join(' ')).join(' L'), class: 'fx-fleet' }, fx);
      const target = id === 'wolmido' ? [126.597, 37.476] : [126.625, 37.458];
      const [x, y] = at(target);
      svgEl('circle', { cx: x, cy: y, r: 34, class: 'fx-land' }, fx);
    } else if (id === 'bupyeong') {
      const [x1, y1] = at([126.625, 37.46]), [x2, y2] = at([126.72, 37.495]), [x3, y3] = at([126.90, 37.53]);
      svgEl('path', { d: `M${x1} ${y1} Q${(x1 + x2) / 2} ${y1 - 30} ${x2} ${y2} L${x3} ${y3}`, class: 'fx-advance', 'marker-end': 'url(#arrowBlueI)' }, fx);
      // 서해 해상 봉쇄: 영종도 바깥 바다를 지키는 선
      const [bx, by] = at([126.34, 37.46]);
      svgEl('path', { d: `M${bx + 10} ${by + 150} Q${bx - 40} ${by} ${bx + 30} ${by - 150}`, class: 'fx-blockade' }, fx);
    }
    // 화살표 머리 (한 번만)
    if (!$('arrowBlueI')) {
      const defs = svgEl('defs', {}, $('incheon'));
      const m = svgEl('marker', { id: 'arrowBlueI', viewBox: '0 0 10 10', refX: 6, refY: 5, markerWidth: 4, markerHeight: 4, orient: 'auto' }, defs);
      svgEl('path', { d: 'M0 0 L10 5 L0 10 Z', fill: 'var(--war-blue)' }, m);
    }
  }

  // 🔍 인천 돋보기 (한반도 지도 서해 쪽에 동그랗게)
  const LENS = { cx: 105, cy: 745, r: 64 };
  function drawLens(svg, defs) {
    const si = STATIONS.findIndex((s) => s.inset === 'incheon');
    if (si < 0) return;
    const s = STATIONS[si];
    const open = previewMode || isDone(s.id) || si === nextIndex();
    const done = previewMode || isDone(s.id);
    const clip = svgEl('clipPath', { id: 'lensClip' }, defs);
    svgEl('circle', { cx: LENS.cx, cy: LENS.cy, r: LENS.r }, clip);
    const g = svgEl('g', { class: `lens${done ? ' done' : ''}${open ? ' open' : ''}`, role: 'button', tabindex: open ? 0 : -1, 'aria-label': T('lensTitle') }, svg);
    // 인천 자리 → 돋보기로 이어지는 선
    svgEl('line', { x1: s.map.x, y1: s.map.y, x2: LENS.cx + 30, y2: LENS.cy - LENS.r + 8, class: 'lens-line' }, g);
    svgEl('circle', { cx: LENS.cx, cy: LENS.cy, r: LENS.r, class: 'lens-sea' }, g);
    // 인천 앞바다(경도 126.3~126.9, 위도 37.18~37.62)를 돋보기 안에 맞춰 줄이기
    const k = (LENS.r * 2) / 600;
    const inner = svgEl('g', { 'clip-path': 'url(#lensClip)' }, g);
    const map = svgEl('g', { transform: `translate(${LENS.cx - 400 * k} ${LENS.cy - 500 * k}) scale(${k})` }, inner);
    Object.values(INCH_LAND).forEach((poly) => svgEl('path', { d: 'M' + poly.map((c) => IP(...c).join(' ')).join(' L') + ' Z', class: 'lens-land' }, map));
    (window.INCHEON_OPS || []).forEach((op) => {
      const [x, y] = IP(...op.pin);
      svgEl('circle', { cx: x, cy: y, r: 26, class: 'lens-pin', style: done ? `fill:${opColor[op.id] || 'var(--co-red)'}` : '' }, map);
    });
    const [mx, my] = IP(126.675, 37.548);
    svgEl('path', { d: `M${mx} ${my - 30} l9 19 21 2 -16 14 5 21 -19 -11 -19 11 5 -21 -16 -14 21 -2z`, class: 'lens-star' }, map);
    svgEl('circle', { cx: LENS.cx, cy: LENS.cy, r: LENS.r, class: 'lens-ring' }, g);
    svgEl('text', { x: LENS.cx, y: LENS.cy + LENS.r + 16, 'text-anchor': 'middle', class: 'm-text small lens-label' }, g).textContent = `🔍 ${T('lensTitle')}`;
    const go = () => {
      if (atlasOn || !open) { openPlace(si); return; }
      openStation(si);
    };
    g.addEventListener('click', (e) => { e.stopPropagation(); go(); });
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  }

  // 큰 지도 대신 세계 지도·인천 지도를 보여 주기 (null = 원래 한반도 지도)
  function showLayer(name) {
    const wrap = document.querySelector('.map-wrap');
    wrap.classList.toggle('show-world', !!name);
    // SVG는 .hidden 속성이 없어서 속성을 직접 바꿔요
    $('world').toggleAttribute('hidden', name !== 'world');
    $('incheon').toggleAttribute('hidden', name !== 'incheon');
    cancelAnimationFrame(shipRaf);
    if (name === 'world') drawWorld();
    if (name === 'incheon') drawIncheon();
  }
  const showWorld = (on) => showLayer(on ? 'world' : null);

  /* =====================================================================
     🗺️ 전체 지도 (아틀라스): 장소마다 전투 이름 + 영웅 카드가 동동 떠 있어요
     · 지나온 곳은 컬러, 아직 못 간 곳은 회색 · 누르면 자세히
     · 지도를 다 완성하면 지도 어디든 눌러서 그 곳 이야기를 볼 수 있어요
     ===================================================================== */
  // 떠 있는 카드 자리 (지도 좌표). 작전 지점이 몰려 있어서 바깥쪽 바다로 빼고 선으로 이어요.
  const ATLAS_POS = {
    war: [490, 452], incheon: [72, 590], colombia: [500, 885], busan: [505, 780], heukun: [482, 388],
    geumseong: [348, 352], hill400: [488, 518], hill180: [175, 358], oldbaldy: [340, 588],
    armistice: [70, 505], westsea: [70, 425], memorial: [238, 640]
  };
  let atlasOn = false;
  const mapComplete = () => !!player && !previewMode && doneCount(player) === N;
  const cardsAt = (si) => allCards().filter((c) => c.where === si);
  const hasCard = (c) => !!(player && player.cards && player.cards[c.id]);

  function enterAtlas() {
    if (!$('stationSheet').hidden) return;
    atlasOn = true;
    $('gameScreen').classList.add('atlas');
    $('atlasBtn').textContent = T('atlasClose');
    flyTo(FULL.slice(), 0);
    drawAtlas();
    renderPanel();
    say(mapComplete() ? T('atlasDoneHint') : T('gAtlas'));
  }
  function exitAtlas() {
    atlasOn = false;
    $('gameScreen').classList.remove('atlas');
    $('atlasBtn').textContent = T('atlasOpen');
    $('atlasLayer').hidden = true; $('atlasLayer').innerHTML = '';
    $('atlasHint').hidden = true;
    const lines = $('atlasLines'); if (lines) lines.innerHTML = '';
    if (player && !$('gameScreen').hidden) renderPanel();
  }
  $('atlasBtn').addEventListener('click', () => (atlasOn ? exitAtlas() : enterAtlas()));

  function drawAtlas() {
    const layer = $('atlasLayer');
    const ni = nextIndex();
    // 지도 위 이음선
    const svg = $('map');
    let lines = $('atlasLines');
    if (!lines) lines = svgEl('g', { id: 'atlasLines' }, svg);
    lines.innerHTML = '';
    layer.innerHTML = STATIONS.map((s, i) => {
      const st = isDone(s.id) ? 'done' : i === ni ? 'next' : 'locked';
      const [ax, ay] = ATLAS_POS[s.id] || [s.map.x, s.map.y];
      svgEl('line', { x1: s.map.x, y1: s.map.y, x2: ax, y2: ay, class: `atlas-line ${st}` }, lines);
      const thumbs = cardsAt(i).map((c) => `<i class="ab-thumb flag-${esc(c.flag)} ${hasCard(c) ? 'own' : ''}" title="${esc(L(c.name))}">${c.img ? `<img src="${esc(c.img)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : esc(Array.from(L(c.name))[0] || '?')}</i>`).join('');
      const ops = s.inset === 'incheon' ? `<span class="ab-ops">📍 ${(window.INCHEON_OPS || []).length}</span>` : '';
      return `<button type="button" class="ab ${st} ch-${chapterOf(s)}" data-si="${i}" style="--bob:${(i % 4) * 0.35}s" title="${esc(L(s.name))}">
        <span class="ab-head"><span class="ab-num">${st === 'done' ? '✓' : i + 1}</span><span class="ab-name">${esc(L(s.short || s.name))}</span></span>
        <span class="ab-more"><span class="ab-date">${esc(L(s.date))}</span>${ops}<span class="ab-cards">${thumbs}</span></span>
      </button>`;
    }).join('');
    layer.hidden = false;
    layer.querySelectorAll('.ab').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); openPlace(+b.dataset.si); }));
    $('atlasHint').textContent = mapComplete() ? T('atlasDoneHint') : T('atlasHint');
    $('atlasHint').hidden = false;
    positionAtlas();
  }

  // 지도 좌표 → 화면 위치 (창 크기가 바뀌면 다시 계산)
  function positionAtlas() {
    if (!atlasOn) return;
    const svg = $('map');
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const wrap = document.querySelector('.map-wrap').getBoundingClientRect();
    $('atlasLayer').querySelectorAll('.ab').forEach((b) => {
      const s = STATIONS[+b.dataset.si];
      const [ax, ay] = ATLAS_POS[s.id] || [s.map.x, s.map.y];
      const p = svg.createSVGPoint(); p.x = ax; p.y = ay;
      const q = p.matrixTransform(ctm);
      const w = b.offsetWidth / 2, h = b.offsetHeight / 2;
      b.style.left = `${Math.max(w + 4, Math.min(wrap.width - w - 4, q.x - wrap.left))}px`;
      b.style.top = `${Math.max(h + 4, Math.min(wrap.height - h - 4, q.y - wrap.top))}px`;
    });
  }
  if (window.ResizeObserver) new ResizeObserver(() => positionAtlas()).observe(document.querySelector('.map-wrap'));

  // 지도를 다 완성하면: 지도 어디든 누르면 가장 가까운 곳 이야기
  $('map').addEventListener('click', (e) => {
    if (!atlasOn || !mapComplete() || (cur && cur.finding)) return;
    const svg = $('map');
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    let best = -1, bd = 1e9;
    STATIONS.forEach((s, i) => { const d = Math.hypot(s.map.x - p.x, s.map.y - p.y); if (d < bd) { bd = d; best = i; } });
    if (best >= 0 && bd < 160) openPlace(best);
  });

  // 장소 자세히: 이곳의 전투·작전 + 영웅 카드 (못 모은 카드는 회색)
  function openPlace(si) {
    const s = STATIONS[si];
    const ni = nextIndex();
    const st = isDone(s.id) ? 'done' : si === ni ? 'next' : 'locked';
    const open = st !== 'locked' || previewMode;
    const ops = s.inset === 'incheon' ? (window.INCHEON_OPS || []) : [];
    const cards = cardsAt(si);
    openInfo(String(si + 1), L(s.name), `
      <article class="place ${st}">
        <div class="facts"><span>📅 ${esc(L(s.date))}</span><span>📍 ${esc(L(s.place))}</span>
          <span class="place-state ${st}">${esc(st === 'done' ? T('placeDone') : st === 'next' ? T('placeNext') : '🔒')}</span></div>
        ${open ? `<p class="story-text">${esc(L(s.story))}</p>` : `<p class="t-help">${esc(T('placeLocked'))}</p>`}
        ${ops.length ? `<h4>📍 ${esc(T('placeOps'))}</h4>
          <ul class="place-ops">${ops.map((op, k) => `<li><span class="n" style="background:${opColor[op.id] || 'var(--co-red)'}">${k + 1}</span><b>${esc(L(op.name))}</b><small>${esc(L(op.date))}</small></li>`).join('')}</ul>` : ''}
        ${cards.length ? `<h4>🎴 ${esc(T('placeHeroes'))}</h4><div class="album">${cards.map((c) => cardHtml(c, hasCard(c))).join('')}</div>` : ''}
      </article>
      ${isUnlocked(si) ? `<button type="button" class="btn btn-go" id="placeGo">${esc(T('placeGo'))}</button>` : ''}
      ${st === 'done' && !previewMode && !stationReqs(s).every(Boolean) ? `<button type="button" class="btn btn-ghost" id="placeRetry">✨ ${esc(T('retryBtn'))}</button>` : ''}`);
    $('infoIcon').textContent = si + 1;
    document.querySelectorAll('#infoBody .hcard[data-card]').forEach((b) => b.addEventListener('click', () => openCard(b.dataset.card)));
    if ($('placeGo')) $('placeGo').addEventListener('click', () => { $('infoSheet').hidden = true; exitAtlas(); openStation(si); });
    if ($('placeRetry')) $('placeRetry').addEventListener('click', () => retryStation(si));
    if (open) annotate(document.querySelector('#infoBody .place'));
  }

  /* =====================================================================
     여정 패널
     ===================================================================== */
  function renderPanel() {
    const ni = nextIndex();
    const dc = player ? doneCount(player) : 0;
    $('progressText').textContent = `${dc} / ${N}`;
    $('progressFill').style.width = `${(dc / N) * 100}%`;

    const now = $('nowCard');
    if (previewMode) {
      now.innerHTML = `<span class="eyebrow">🔒 ${esc(T('preview'))}</span><h3>${esc(T('previewTitle'))}</h3><span class="meta">${esc(T('previewGuide'))}</span>
        <button class="btn btn-go" type="button" id="enterBtn">${esc(T('backTeacher'))}</button>`;
      $('enterBtn').addEventListener('click', showTeacher);
    } else if (ni < N) {
      const s = STATIONS[ni];
      now.innerHTML = `
        <span class="eyebrow">${esc(T('nowEyebrow', ni + 1, N))} · ${esc(chLabel(chapterOf(s)))}</span>
        <h3>${esc(L(s.name))}</h3>
        <span class="meta">${esc(L(s.date))} · ${esc(L(s.place))}</span>
        <button class="btn btn-go" type="button" id="enterBtn">${esc(T('enterStation'))}</button>`;
      $('enterBtn').addEventListener('click', () => openStation(ni));
    } else if (!player.keyDone) {
      // 지도 완성 → 마지막 관문: 내일의 문
      now.innerHTML = `<span class="eyebrow">🧩 ${N} / ${N} · 🔑 ${KEY_N} / ${KEY_N}</span><h3>${esc(T('doorTitle'))}</h3><span class="meta">${esc(T('doorMeta'))}</span>
        <button class="btn btn-go" type="button" id="enterBtn">${esc(T('doorBtn'))}</button>`;
      $('enterBtn').addEventListener('click', openDoor);
    } else {
      now.innerHTML = `<span class="eyebrow">${flagHtml('kr')} ${flagHtml('co')}</span><h3>${esc(T('allDone'))}</h3><span class="meta">${esc(T('allDoneMeta'))}</span>
        <button class="btn btn-go" type="button" id="enterBtn">${esc(T('toEnding'))}</button>`;
      $('enterBtn').addEventListener('click', () => openEnding());
    }
    renderKeyRow();

    // 목록: 프롤로그 / 여정 두 묶음
    const list = $('stationList');
    list.innerHTML = '';
    Object.keys(CH_KEY).forEach((ch) => {
      if (!STATIONS.some((s) => chapterOf(s) === ch)) return;
      const h = document.createElement('h4');
      h.className = `ch-title ch-${ch}`;
      h.innerHTML = `<span class="ch-letter l-${CH_LETTER[ch]}">${CH_LETTER[ch]}</span>${esc(T(CH_KEY[ch]))}`;
      list.appendChild(h);
      const ol = document.createElement('ol');
      STATIONS.forEach((s, i) => {
        if (chapterOf(s) !== ch) return;
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        const st = isDone(s.id) ? 'done' : i === ni ? 'next' : (previewMode ? 'open' : 'locked');
        b.className = st;
        b.disabled = st === 'locked' && !atlasOn; // 전체 지도에서는 못 간 곳도 눌러서 (회색으로) 볼 수 있어요
        b.innerHTML = `<span class="n">${i + 1}</span><span class="t">${esc(L(s.name))}<span class="d">${esc(L(s.date))}</span></span>${st === 'done' ? '<span class="ck">✓</span>' : ''}${(s.questions || []).length ? `<span class="qmark" title="${esc(T('kQuestion'))}">✎</span>` : ''}`;
        b.addEventListener('click', () => (atlasOn ? openPlace(i) : openStation(i)));
        li.appendChild(b);
        ol.appendChild(li);
      });
      list.appendChild(ol);
    });

    if (player) {
      $('playerChip').textContent = T('playerChip', player);
      $('codeChip').textContent = T('codeChip');
    }
  }

  function enterGame() {
    exitAtlas();
    resetStationUI();
    cam = FULL.slice();
    showScreen('gameScreen');
    applyStaticText();
    drawMap();
    renderPanel();
    $('guide').hidden = previewMode;
    sayNext();
    // 처음 들어오면 임무 안내부터 (이미 하던 여정이라도 안내를 못 봤으면 한 번)
    if (player && !previewMode && !player.briefed) setTimeout(openBriefing, 500);
  }

  // 작전 지점 카드·세계 지도·전선 표시를 모두 닫은 상태로
  function resetStationUI() {
    if (typeof stopTimeline === 'function') stopTimeline();
    endFind(); endMission();
    cur = null;
    $('stationSheet').hidden = true;
    $('gameScreen').classList.remove('is-open');
    $('mapHome').hidden = true;
    $('mapCaption').hidden = true;
    showWorld(false);
  }

  function refreshGame(animateToken) {
    const from = tokenAt;
    drawMap();
    renderPanel();
    const to = Math.min(nextIndex(), N - 1);
    if (animateToken && from != null && from !== to) {
      placeToken(from, false);
      requestAnimationFrame(() => requestAnimationFrame(() => placeToken(to, true)));
    }
  }

  /* =====================================================================
     작전 지점 카드
     ===================================================================== */
  let cur = null;

  // 지금 언어로 볼 수 있는 영상만
  // 화면 언어로 들을 수 있는 영상만: 말(lang, 없으면 한국어)이 같거나, 그 언어의 사람이 만든 자막(cc)이 있는 영상
  // + 언어별로 따로 찾은 영상 (data.js 의 LANG_VIDEOS)
  const videosAll = (s) => [
    ...(s.videos || []),
    ...(((window.LANG_VIDEOS || {})[lang] || {})[s.id] || []).map((v) => ({ lang, ...v }))
  ].filter((v) => [v.lang || 'ko', ...(v.cc || [])].includes(lang));
  // 게임 안에서는 10분 넘는 긴 영상은 빼고(→ 엔딩 '더 알아보기'), 꼭 볼 영상(req)을 맨 앞에
  const videosOf = (s) => videosAll(s).filter((v) => !v.long).sort((a, b) => !!b.req - !!a.req);
  const longVideos = () => STATIONS.flatMap((s) => videosAll(s).filter((v) => v.long));

  /* ---------------- 🎬 꼭 볼 영상: 끝까지 봐야 [다음]이 열려요 ----------------
     유튜브 IFrame API로 '실제로 재생된 시간'만 셉니다 (앞으로 건너뛰면 안 세요).
     유튜브가 막혔거나 영상 오류면 아이가 갇히지 않게 자동으로 열어 줘요. */
  const reqVideo = (s) => videosOf(s).find((v) => v.req);
  const mustWatch = (s) => {
    if (CONFIG.requireVideos === false || previewMode || !player || isDone(s.id)) return null;
    const v = reqVideo(s);
    return v && !(player.watched && player.watched[v.yt]) ? v : null;
  };
  const fmtSec = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
  const lenSec = (len) => { const [m, s2] = String(len || '0:0').split(':').map(Number); return m * 60 + (s2 || 0); };
  // ✂️ 영상의 보여 줄 부분만: data.js 에서 from: '0:30', to: '2:10' 처럼 적으면 그 구간만 재생되고, 그만큼만 보면 돼요
  const clipOf = (v) => ({ from: v.from ? lenSec(v.from) : 0, to: v.to ? lenSec(v.to) : 0 });
  const clipLen = (v) => { const c = clipOf(v); return (c.to || lenSec(v.len)) - c.from; };
  const clipLabel = (v) => (v.from || v.to ? `${v.from || '0:00'}~${v.to || v.len || ''} (${fmtSec(clipLen(v))})` : (v.len || ''));
  let ytApi = null;
  function loadYtApi() {
    if (ytApi) return ytApi;
    ytApi = new Promise((res, rej) => {
      if (window.YT && window.YT.Player) { res(window.YT); return; }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prev) prev(); res(window.YT); };
      const sc = document.createElement('script');
      sc.src = 'https://www.youtube.com/iframe_api';
      sc.onerror = () => rej(new Error('blocked'));
      document.head.appendChild(sc);
      setTimeout(() => rej(new Error('timeout')), 12000);
    });
    ytApi.catch(() => { ytApi = null; });
    return ytApi;
  }
  function stopWatch() { if (cur && cur.watch) { clearInterval(cur.watch.timer); cur.watch = null; } }
  function watchDone(v, why) {
    const w = cur && cur.watch;
    if (w) clearInterval(w.timer);
    if (!player || previewMode) return;
    player.watched = player.watched || {};
    if (player.watched[v.yt]) return;
    player.watched[v.yt] = Date.now();
    save();
    if (!cur || cur.steps[cur.step].type !== 'video') return;
    $('nextBtn').disabled = false;
    const gate = $('watchGate');
    if (gate) { gate.classList.add('ok'); gate.innerHTML = `✅ ${esc(why === 'watched' ? T('watchDone') : T('watchSkip'))}`; }
    say(why === 'watched' ? T('gWatchDone') : T('watchSkip'));
  }
  function trackWatch(v, frame) {
    stopWatch();
    const cut = clipOf(v);
    const w = cur.watch = { yt: v.yt, sec: 0, last: null, dur: clipLen(v), timer: null };
    loadYtApi().then((YT) => {
      if (!cur || cur.watch !== w) return;
      const p = new YT.Player(frame, { events: { onError: () => watchDone(v, 'error') } });
      const t0 = Date.now();
      w.timer = setInterval(() => {
        if (!cur || cur.watch !== w || !document.body.contains(frame)) { clearInterval(w.timer); return; }
        // 20초가 지나도 플레이어와 연결이 안 되면(재생 기록을 못 읽으면) 열어 줘요
        const st = p.getPlayerState ? p.getPlayerState() : undefined;
        if (typeof st === 'number') w.alive = true;
        else if (Date.now() - t0 > 20000) { watchDone(v, 'blocked'); return; }
        try {
          const d = p.getDuration && p.getDuration();
          if (d > 0) w.dur = (cut.to && cut.to < d ? cut.to : d) - cut.from; // 보여 줄 부분만 (from~to)
          const t = p.getCurrentTime ? p.getCurrentTime() : 0;
          const playing = p.getPlayerState && p.getPlayerState() === 1;
          if (playing && w.last != null) { const dt = t - w.last; if (dt > 0 && dt < 2.5) w.sec += dt; } // 건너뛰기(큰 점프)는 안 세요
          w.last = t;
          const fill = $('watchFill'), time = $('watchTime');
          if (fill && w.dur) fill.style.width = `${Math.min(100, (w.sec / w.dur) * 100)}%`;
          if (time && w.dur) time.textContent = `${fmtSec(w.sec)} / ${fmtSec(w.dur)}`;
          if (w.dur && w.sec >= w.dur * 0.92) watchDone(v, 'watched');
        } catch (e) { /* 플레이어 준비 중 */ }
      }, 1000);
    }).catch(() => watchDone(v, 'blocked')); // 학교망에서 유튜브가 막힌 경우
  }

  function buildSteps(s) {
    const steps = [{ type: 'story' }];
    if (s.find) steps.push({ type: 'find' });
    if (s.inset === 'incheon' && (window.INCHEON_OPS || []).length) steps.push({ type: 'ops' });
    if (s.mission === 'lighthouse') steps.push({ type: 'mission' });
    if (s.timeline && s.timeline.length) steps.push({ type: 'timeline' });
    if (videosOf(s).length) steps.push({ type: 'video' });
    (s.heroes || []).forEach((h) => steps.push({ type: 'hero', h, cid: h.card || null }));
    if (s.quiz) steps.push({ type: 'quiz' });
    (s.questions || []).forEach((qid) => { if (QUESTIONS[qid]) steps.push({ type: 'question', qid }); });
    steps.push({ type: 'done' });
    return steps;
  }

  function openStation(i, retry) {
    if (!isUnlocked(i)) return;
    if (atlasOn) exitAtlas();
    const s = STATIONS[i];
    stopTimeline();
    // retry: 원래 퀴즈 기록은 그대로 두고, 이번 도전은 따로 풀어요
    cur = { i, s, steps: buildSteps(s), step: 0, video: 0, retryQuiz: retry ? {} : null };
    $('sheetNum').textContent = i + 1;
    $('sheetNum').className = `sheet-num ch-${chapterOf(s)}`;
    $('sheetTitle').textContent = L(s.name);
    $('stationSheet').hidden = false;
    $('gameScreen').classList.add('is-open');
    // 지도가 그 장소로 날아가요 (③ 콜롬비아는 세계 지도로, ② 인천은 인천 확대 지도로)
    const layer = s.offMap ? 'world' : s.inset === 'incheon' ? 'incheon' : null;
    showLayer(layer);
    focusStation(s);
    $('mapHome').hidden = !!layer || !!s.timeline;
    requestAnimationFrame(() => flyTo(zoomBox(s)));
    renderStep();
    $('nextBtn').focus();
  }

  function closeStation() {
    // 배가 도착하기 전에 닫아도 25일 항해의 별은 받아요
    if (cur && cur.s.offMap && cur.completed) giveStars('voyage', RULES.voyage, $('starChip'));
    stopWatch();
    stopTimeline();
    endMission();
    $('map').classList.remove('finding', 'hide-line38', 'hide-dmz');
    $('stationSheet').hidden = true;
    $('gameScreen').classList.remove('is-open');
    $('mapHome').hidden = true;
    showWorld(false);
    setWarPhase(null);
    const wasDone = cur && cur.completed;
    cur = null;
    refreshGame(wasDone);
    requestAnimationFrame(() => flyTo(FULL.slice()));
    sayNext();
    if (wasDone && player) {
      const dc = doneCount(player);
      const all = dc === N;
      const newKey = dc % 2 === 0 && keysFound(player) > 0; // 조각 2개마다 열쇠 낱말 하나
      const word = newKey ? foundWords(player)[keysFound(player) - 1] : '';
      toast(all ? T('mapComplete') : newKey ? `${T('piecePop')} ${T('keyPop', word)}` : T('piecePop'));
      if (all) { say(`${T('gMapDone', N)} ${T('gDoorReady')}`); setTimeout(() => { if ($('stationSheet').hidden) enterAtlas(); }, 2600); } // 완성된 지도를 바로 보여 줘요
      else if (newKey) say(T('gKey', word, keysFound(player), KEY_N));
      if (newKey) {
        setTimeout(() => showKeyPop(keysFound(player) - 1), 700); // 카드 얻는 창이 먼저 뜨고 나서 (마지막 6번째 낱말도)
        const row = $('keyRow'); if (row) { row.classList.remove('bump'); void row.offsetWidth; row.classList.add('bump'); }
      }
    }
  }

  /* ---------------- ① 타임라인: 누르면 지도 위 전선이 바뀌어요 ---------------- */
  let tlTimer = 0;
  function stopTimeline() {
    clearInterval(tlTimer); tlTimer = 0;
    const b = $('tlPlay'); if (b) b.textContent = T('tlPlay');
  }
  function selectPhase(k) {
    if (!cur || !cur.s.timeline) return;
    cur.phase = k;
    setWarPhase(cur.s.timeline[k].front);
    document.querySelectorAll('#tlList button').forEach((b, j) => b.setAttribute('aria-pressed', String(j === k)));
    // 전쟁의 흐름을 끝까지 다 보면 ⭐22 (함께 싸운 22개 나라)
    cur.phasesSeen = cur.phasesSeen || new Set();
    cur.phasesSeen.add(k);
    if (cur.phasesSeen.size === cur.s.timeline.length) giveStars('allies', RULES.allies, $('tlList'));
  }
  function bindTimeline() {
    document.querySelectorAll('#tlList button').forEach((b, k) => b.addEventListener('click', () => { stopTimeline(); selectPhase(k); }));
    $('tlPlay').addEventListener('click', () => {
      if (tlTimer) { stopTimeline(); return; }
      const n = cur.s.timeline.length;
      selectPhase(0);
      $('tlPlay').textContent = T('tlStop');
      tlTimer = setInterval(() => {
        if (!cur || cur.phase >= n - 1) { stopTimeline(); return; }
        selectPhase(cur.phase + 1);
      }, 2600);
    });
    selectPhase(cur.phase || 0);
  }

  /* ---------------- ② 인천 5대 작전: 목록이나 지도 핀을 누르면 친구들의 조사 카드 ---------------- */
  function bindOps() {
    cur.seenOps = cur.seenOps || new Set();
    document.querySelectorAll('#opsList button').forEach((b) => b.addEventListener('click', () => selectOp(+b.dataset.k)));
    selectOp(cur.op || 0);
  }
  function selectOp(k) {
    const ops = window.INCHEON_OPS;
    const op = ops[k];
    if (!op || !$('opDetail')) return;
    cur.op = k;
    cur.seenOps.add(k);
    // 작전을 살펴보면 별 + 그 작전의 영웅 카드
    giveStars(`op:${op.id}`, RULES.op, document.querySelector(`#opsList button[data-k="${k}"]`));
    (op.heroes || []).forEach((h) => { if (h.card) unlockCard(h.card); });
    document.querySelectorAll('#opsList button').forEach((b, j) => {
      b.setAttribute('aria-pressed', String(j === k));
      b.querySelector('.ck').hidden = !cur.seenOps.has(j);
    });
    $('opsSeen').textContent = T('opsSeen', cur.seenOps.size, ops.length);
    const works = window.GROUP_WORKS || [];
    $('opDetail').innerHTML = `
      <article class="op-card" style="--op:${opColor[op.id] || 'var(--co-red)'}">
        <span class="op-num">${k + 1}</span>
        <h3>${esc(L(op.name))}</h3>
        <div class="facts"><span>📅 ${esc(L(op.date))}</span></div>
        <p>${esc(L(op.text))}</p>
        ${(op.heroes || []).length ? `<h4>🎖️ ${esc(T('opsHeroes'))}</h4>
          <ul class="op-heroes">${op.heroes.map((h) => `<li><b>${esc(L(h.name))}</b><span>${esc(L(h.text))}</span></li>`).join('')}</ul>` : ''}
        <p class="op-by">${esc(T('opsBy', op.groups.join('·')))}</p>
        <div class="op-works">${op.groups.map((g) => works[g - 1] ? `<a href="${esc(works[g - 1].url)}" target="_blank" rel="noopener">${esc(T('groupN', g))} ↗</a>` : '').join('')}</div>
      </article>`;
    annotate($('opDetail'));
    showOpFx(op.id);
  }

  /* ---------------- 영상: 썸네일을 누르면 재생 (학교 인터넷 아끼기) ---------------- */
  function videoCardHtml(s) {
    const list = videosOf(s);
    const v = list[Math.min(cur.video, list.length - 1)];
    const credit = v.group ? `<span class="v-group">🎒 ${esc(T('videoGroup', v.group))}</span>` : '';
    const must = mustWatch(s);
    // 🔒 꼭 볼 영상 안내: 지금 보는 영상이 그 영상이면 진행 막대, 아니면 그 영상으로 가는 버튼
    const gate = !must ? '' : must.yt === v.yt
      ? `<div class="watch-gate" id="watchGate" role="status">🔒 ${esc(T('watchNeed'))}
          <span class="watch-bar"><i id="watchFill"></i></span><b id="watchTime">0:00 / ${esc(fmtSec(clipLen(v)))}</b></div>`
      : `<div class="watch-gate" id="watchGate" role="status">🔒 ${esc(T('watchOther', L(must.title)))}
          <button type="button" class="btn btn-sm btn-blue" id="watchGo">${esc(T('watchGo'))}</button></div>`;
    // 🔗 링크 모드: 유튜브를 새 탭으로 열고, 영상 길이만큼 시간이 지나면 [다 봤어요]가 눌려요
    const ccq = ((v.lang || 'ko') !== lang ? `&cc_load_policy=1&cc_lang_pref=${lang}&hl=${lang}` : '') + (clipOf(v).from ? `&t=${clipOf(v).from}s` : '');
    const sbGate = !must ? '' : must.yt === v.yt
      ? `<div class="watch-gate" id="watchGate" role="status">🔒 ${esc(T('watchNeedLink'))}
          <button type="button" class="btn btn-sm btn-go" id="watchDoneBtn" disabled>${esc(T('watchDoneBtn'))}</button><b id="watchTime"></b></div>`
      : gate;
    const box = SANDBOX
      ? `<a class="video-box yt-link" id="ytLink" href="https://www.youtube.com/watch?v=${esc(v.yt)}${ccq}" target="_blank" rel="noopener">
          <span class="yt-link-play" aria-hidden="true">▶</span>
          <span class="yt-link-t">${esc(T('ytOpen'))}</span>
          <small>YouTube${v.len ? ` · ${esc(v.len)}` : ''}</small></a>`
      : `<div class="video-box yt-thumb" id="ytBox" data-yt="${esc(v.yt)}"${(v.lang || 'ko') !== lang ? ' data-cc="1"' : ''}>
        <img src="https://i.ytimg.com/vi/${esc(v.yt)}/hqdefault.jpg" alt="" loading="lazy">
        <button type="button" class="yt-play" id="ytPlay" aria-label="재생">▶</button>
      </div>`;
    return `<div class="kicker">${esc(T('kVideo'))}</div>
      ${SANDBOX ? sbGate : gate}
      ${box}
      <div class="v-meta">
        <b>${esc(L(v.title))}</b>
        <span>${esc(lang === 'ko' ? (v.by || '') : (CHANNEL_NAMES[v.by] || v.by || ''))}${v.len ? ` · ${esc(clipLabel(v))}` : ''}${(must && must.yt === v.yt) || SANDBOX ? '' : ` · <a href="https://www.youtube.com/watch?v=${esc(v.yt)}" target="_blank" rel="noopener">${esc(T('onYoutube'))}</a>`}</span>
        ${credit}
        ${v.long ? `<small class="v-long">⏱ ${esc(T('videoLong'))}</small>` : ''}
      </div>
      ${list.length > 1 ? `<h4 class="others-title">${esc(T('videoPick'))} · ${esc(T('videoOptional'))}</h4>
        <div class="v-list">${list.map((x, k) => `
          <button type="button" data-k="${k}" aria-pressed="${k === cur.video}">
            ${SANDBOX ? '<i class="v-ico" aria-hidden="true">▶</i>' : `<img src="https://i.ytimg.com/vi/${esc(x.yt)}/mqdefault.jpg" alt="" loading="lazy">`}
            <span>${x.req && CONFIG.requireVideos !== false ? `<em class="v-must">${esc(T('watchBadge'))}</em>` : ''}${esc(L(x.title))}${x.len ? ` <small class="v-len">${esc(clipLabel(x))}</small>` : ''}${x.group ? `<small>🎒 ${esc(T('videoGroup', x.group))}</small>` : ''}</span>
          </button>`).join('')}</div>` : must ? '' : `<p class="skip-hint">${esc(T('videoOptional'))}</p>`}`;
  }
  function bindVideo() {
    if (SANDBOX) { bindVideoLink(); return; }
    $('ytPlay').addEventListener('click', () => {
      const box = $('ytBox');
      box.classList.remove('yt-thumb');
      // referrerpolicy: 유튜브는 어느 사이트에서 틀었는지 알아야 재생돼요 (없으면 '오류 153')
      // 영상 말이 화면 언어와 다르면 그 언어 자막을 켜서 틀어요 (예: KBS 다큐 → 영어 자막)
      const cc = box.dataset.cc ? `&cc_load_policy=1&cc_lang_pref=${lang}` : '';
      const must = mustWatch(cur.s);
      const track = must && must.yt === box.dataset.yt;
      const api = track ? `&enablejsapi=1&origin=${encodeURIComponent(location.origin)}` : '';
      // ✂️ 보여 줄 부분만 (from~to)
      const cv = videosOf(cur.s).find((x) => x.yt === box.dataset.yt) || {};
      const cut = clipOf(cv);
      const range = `${cut.from ? `&start=${cut.from}` : ''}${cut.to ? `&end=${cut.to}` : ''}`;
      box.innerHTML = `<iframe id="ytFrame" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(box.dataset.yt)}?autoplay=1&rel=0&playsinline=1&hl=${lang}${cc}${api}${range}" title="video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      if (track) trackWatch(must, $('ytFrame'));
    });
    document.querySelectorAll('.v-list button').forEach((b) => b.addEventListener('click', () => { cur.video = +b.dataset.k; renderStep(); }));
    if ($('watchGo')) $('watchGo').addEventListener('click', () => { cur.video = videosOf(cur.s).findIndex((x) => x.req); renderStep(); });
  }

  // 🔗 링크 모드의 영상: 새 탭의 유튜브는 재생 기록을 읽을 수 없어서,
  //    영상을 연 뒤 '영상 길이의 90%'만큼 시간이 지나야 [다 봤어요]가 열려요 (바로 닫고 오면 안 열려요)
  function bindVideoLink() {
    document.querySelectorAll('.v-list button').forEach((b) => b.addEventListener('click', () => { cur.video = +b.dataset.k; renderStep(); }));
    if ($('watchGo')) $('watchGo').addEventListener('click', () => { cur.video = videosOf(cur.s).findIndex((x) => x.req); renderStep(); });
    const must = mustWatch(cur.s);
    const btn = $('watchDoneBtn');
    if (!must || !btn) return;
    const need = Math.max(30, Math.round(clipLen(must) * 0.9)) * 1000;
    // 영상을 연 시각은 기록에 저장해요 — 작전 지점을 닫았다 다시 열거나,
    // 태블릿이 유튜브 앱에서 돌아오며 페이지를 새로 불러와도 기다린 시간이 그대로 이어져요
    player.linkOpened = player.linkOpened || {};
    const opened = player.linkOpened;
    const tick = () => {
      if (!document.body.contains(btn)) { clearInterval(cur.linkTimer); return; }
      const t0 = opened[must.yt];
      if (!t0) { $('watchTime').textContent = ''; return; }
      const left = Math.ceil((need - (Date.now() - t0)) / 1000);
      btn.disabled = left > 0;
      $('watchTime').textContent = left > 0 ? T('watchLeft', fmtSec(left)) : '';
    };
    $('ytLink').addEventListener('click', () => { if (!opened[must.yt]) { opened[must.yt] = Date.now(); save(); } tick(); });
    // 다른 탭(유튜브)에서 돌아오는 순간 바로 다시 확인
    document.onvisibilitychange = tick; // (하나만 걸어 두기 — 단계를 오가도 겹치지 않게)
    btn.addEventListener('click', () => { clearInterval(cur.linkTimer); watchDone(must, 'watched'); });
    clearInterval(cur.linkTimer);
    cur.linkTimer = setInterval(tick, 1000);
    tick();
  }

  /* ---------------- 🎯 지도에서 찾아라! (길·작전 지점 표시를 숨기고 직접 눌러 찾기) ---------------- */
  function startFind(s) {
    const svg = $('map');
    const f = s.find;
    cur.finding = { tries: 0, done: false, f, sid: s.id };
    svg.classList.add('finding');
    (f.hide || []).forEach((h) => svg.classList.add(`hide-${h}`));
    const old = $('findLayer'); if (old) old.remove();
    svgEl('g', { id: 'findLayer' }, svg);
    flyTo(FULL.slice());
    $('findLeft').textContent = T('findLeft', 2);
    say(T('gFind'));
  }
  function endFind() {
    const svg = $('map');
    if (!svg.classList.contains('finding')) return;
    svg.classList.remove('finding', 'hide-line38', 'hide-dmz');
    const old = $('findLayer'); if (old) old.remove();
    if (cur) { cur.finding = null; if (!cur.s.offMap && !cur.s.inset) flyTo(zoomBox(cur.s)); }
  }
  // 누른 곳 → 정답 쪽 방향 (지도 위쪽이 북쪽)
  function dirTo(x, y, tx, ty, nsOnly) {
    const dx = tx - x, dy = ty - y;
    const ns = dy < 0 ? 'N' : 'S', ew = dx > 0 ? 'E' : 'W';
    if (nsOnly || Math.abs(dx) < Math.abs(dy) * 0.5) return T('dirs')[ns];
    if (Math.abs(dy) < Math.abs(dx) * 0.5) return T('dirs')[ew];
    return T('dirs')[ns + ew];
  }
  $('map').addEventListener('click', (e) => {
    const fd = cur && cur.finding;
    if (!fd || fd.done) return;
    const svg = $('map');
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    const f = fd.f;
    let tx, ty, ok;
    if (f.lat != null) { ty = P(0, f.lat)[1]; tx = p.x; ok = Math.abs(p.y - ty) <= f.tol && p.x > 90 && p.x < 570; }
    else { [tx, ty] = P(...f.target); ok = Math.hypot(p.x - tx, p.y - ty) <= f.tol; }
    const layer = $('findLayer');
    const reveal = () => {
      svg.classList.remove('hide-line38', 'hide-dmz');
      if (f.lat != null) svgEl('line', { x1: 60, y1: ty, x2: 580, y2: ty, class: 'find-answer-line' }, layer);
      else svgEl('circle', { cx: tx, cy: ty, r: f.tol, class: 'find-answer' }, layer);
    };
    const fb = $('findFeedback');
    if (ok) {
      fd.done = true;
      svgEl('circle', { cx: p.x, cy: p.y, r: 14, class: 'find-tap ok' }, layer);
      reveal();
      const full = RULES.find[fd.sid] || 0; // 38도선 38 · 부산 15 · 판문점 27 (두 번째에 찾으면 절반)
      giveStars(`find:${fd.sid}`, fd.tries === 0 ? full : Math.round(full / 2), fb);
      fb.innerHTML = `<div class="feedback good"><b>🎯 ${esc(T('gFindRight'))}</b>${esc(L(f.explain))}</div>`;
      say(T('gFindRight'));
    } else {
      fd.tries++;
      const m = svgEl('g', { class: 'find-tap no', transform: `translate(${p.x} ${p.y})` }, layer);
      svgEl('path', { d: 'M-10 -10 L10 10 M10 -10 L-10 10' }, m);
      if (fd.tries >= 2) {
        fd.done = true;
        reveal();
        fb.innerHTML = `<div class="feedback bad"><b>${esc(T('gFindReveal'))}</b>${esc(L(f.explain))}</div>`;
        say(T('gFindReveal'));
      } else {
        const d = dirTo(p.x, p.y, tx, ty, f.lat != null);
        fb.innerHTML = `<div class="feedback bad"><b>${esc(T('gFindWrong', d))}</b>${esc(L(f.hint))}</div>`;
        say(T('gFindWrong', d));
      }
    }
    $('findLeft').textContent = fd.done ? '' : T('findLeft', 2 - fd.tries);
    annotate($('sheetBody'));
  });

  /* ---------------- 🔦 미니게임: 팔미도 등대를 켜고 함대를 월미도까지 ---------------- */
  const BUOYS = [[126.40, 37.29], [126.47, 37.335], [126.545, 37.395], [126.575, 37.44]];   // 바닷길 (차례대로)
  const DECOYS = [[126.43, 37.40], [126.60, 37.33], [126.36, 37.36]];                      // 갯벌 쪽 (함정)
  const SHIP_START = [126.30, 37.23], WOLMI = [126.597, 37.476], PALMI = [126.511, 37.358];

  function startMission() {
    const svg = $('incheon');
    if (!svg || svg.hasAttribute('hidden')) return;
    endMission();
    svg.classList.add('missioning');
    cur.mission = { lit: false, next: 0, done: false };
    const g = svgEl('g', { id: 'mission' }, svg);
    svgEl('rect', { x: 0, y: 150, width: 800, height: 700, class: 'm-night', id: 'mNight' }, g);
    const buoyG = svgEl('g', { id: 'mBuoys', class: 'm-buoys' }, g);
    const all = BUOYS.map((c, i) => ({ c, i, ok: true })).concat(DECOYS.map((c) => ({ c, ok: false })));
    all.forEach((b) => {
      const [x, y] = IP(...b.c);
      const bg = svgEl('g', { class: 'm-buoy', transform: `translate(${x} ${y})`, role: 'button', tabindex: 0 }, buoyG);
      svgEl('circle', { r: 16, class: 'm-buoy-hit' }, bg);
      svgEl('circle', { r: 9, class: 'm-buoy-dot' }, bg);
      const hit = () => tapBuoy(b, bg);
      bg.addEventListener('click', hit);
      bg.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit(); } });
    });
    const [lx, ly] = IP(...PALMI);
    const lh = svgEl('g', { class: 'm-lh', transform: `translate(${lx} ${ly})`, role: 'button', tabindex: 0, id: 'mLh' }, g);
    svgEl('circle', { r: 26, class: 'm-lh-glow' }, lh);
    svgEl('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'm-lh-icon' }, lh).textContent = '🗼';
    const light = () => {
      if (cur.mission.lit) return;
      cur.mission.lit = true;
      lh.classList.add('lit');
      $('mNight').classList.add('dim');
      buoyG.classList.add('show');
      $('mStep1').classList.add('ok');
      $('mStatus').textContent = `💡 ${T('mLit')} (${T('mProgress', 0, BUOYS.length)})`;
    };
    lh.addEventListener('click', light);
    lh.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); light(); } });
    const [sx, sy] = IP(...SHIP_START);
    const ship = svgEl('g', { class: 'm-ship', id: 'mShip' }, g);
    ship.style.transform = `translate(${sx}px, ${sy}px)`;
    svgEl('circle', { r: 17, class: 'w-ship-bg' }, ship);
    svgEl('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'm-ship-icon' }, ship).textContent = '🚢';
    $('mStatus').textContent = '';
    $('mRetry').onclick = startMission;
    say(T('gMission'));
  }

  function tapBuoy(b, el) {
    const m = cur && cur.mission;
    if (!m || !m.lit || m.done) return;
    if (!b.ok) {
      el.classList.remove('bad'); void el.getBoundingClientRect(); el.classList.add('bad');
      $('mStatus').textContent = `⚠️ ${T('mDecoy')}`;
      say(T('mDecoy'));
      return;
    }
    if (b.i !== m.next) {
      if (b.i > m.next) { $('mStatus').textContent = `🤔 ${T('mOrder')}`; say(T('mOrder')); }
      return;
    }
    el.classList.add('done');
    m.next++;
    const [x, y] = IP(...b.c);
    $('mShip').style.transform = `translate(${x}px, ${y}px)`;
    $('mStatus').textContent = `⛴ ${T('mProgress', m.next, BUOYS.length)}`;
    if (m.next === BUOYS.length) {
      m.done = true;
      setTimeout(() => {
        if (!$('mShip')) return;
        const [wx, wy] = IP(...WOLMI);
        $('mShip').style.transform = `translate(${wx}px, ${wy}px)`;
        $('mNight').classList.add('dawn');
        $('mStep2').classList.add('ok');
        $('mStatus').textContent = `🎉 ${T('mSuccess')}`;
        giveStars('mission', RULES.mission, $('mStatus')); // 함대 261척
        say(T('gMissionDone'));
      }, 700);
    }
  }
  function endMission() {
    const old = $('mission'); if (old) old.remove();
    const svg = $('incheon'); if (svg) svg.classList.remove('missioning');
    if (cur) cur.mission = null;
  }

  function renderStep() {
    stopWatch();
    const { s, steps, step } = cur;
    const st = steps[step];
    const body = $('sheetBody');
    body.scrollTop = 0;
    let html = '';

    if (st.type === 'story') {
      html = `<div class="kicker">${esc(T('kStory'))}</div>
        <div class="facts"><span>📅 ${esc(L(s.date))}</span><span>📍 ${esc(L(s.place))}</span></div>
        ${s.image ? `<img class="story-img" src="${esc(s.image)}" alt="">` : ''}
        <p class="story-text">${esc(L(s.story))}</p>`;
    } else if (st.type === 'timeline') {
      html = `<div class="kicker">${esc(T('kTimeline'))}</div>
        <p class="tl-hint">🗺️ ${esc(T('tlHint'))}</p>
        <button id="tlPlay" class="btn btn-blue btn-sm" type="button">${esc(T('tlPlay'))}</button>
        <ol class="timeline" id="tlList">${s.timeline.map((t) => `<li><button type="button" aria-pressed="false"><b>${esc(L(t.date))}</b><span>${esc(L(t.text))}</span></button></li>`).join('')}</ol>`;
    } else if (st.type === 'ops') {
      const ops = window.INCHEON_OPS;
      html = `<div class="kicker">${esc(T('kOps'))}</div>
        <p class="tl-hint">🗺️ ${esc(T('opsHint'))}</p>
        <ol class="ops-list" id="opsList">${ops.map((op, k) => `
          <li><button type="button" aria-pressed="false" data-k="${k}">
            <span class="n" style="background:${opColor[op.id] || 'var(--co-red)'}">${k + 1}</span>
            <span class="t">${esc(L(op.name))}<small>${esc(L(op.date))}</small></span>
            <span class="ck" hidden>✓</span>
          </button></li>`).join('')}</ol>
        <p class="t-help" id="opsSeen"></p>
        <div id="opDetail"></div>`;
    } else if (st.type === 'find') {
      html = `<div class="kicker game-k">🎯 ${esc(T('kFind'))}</div>
        <p class="quiz-q">${esc(L(s.find.q))}</p>
        <p class="find-tap">${esc(T('findTap'))}</p>
        <p class="t-help" id="findLeft"></p>
        <div id="findFeedback"></div>`;
    } else if (st.type === 'mission') {
      html = `<div class="kicker game-k">🔦 ${esc(T('kMission'))}</div>
        <p class="mission-story">${esc(T('m1'))}</p>
        <ol class="mission-steps"><li id="mStep1">${esc(T('m2'))}</li><li id="mStep2">${esc(T('m3'))}</li></ol>
        <p class="mission-status" id="mStatus" role="status"></p>
        <button id="mRetry" class="btn btn-ghost btn-sm" type="button">${esc(T('mRetry'))}</button>`;
    } else if (st.type === 'video') {
      html = videoCardHtml(s);
    } else if (st.type === 'hero') {
      const h = st.h;
      html = `<div class="kicker">${esc(T('kHero'))}</div>
        <article class="hero-card">
          <span class="by">${esc(L(h.author))}</span>
          <h3>${esc(L(h.name))}</h3>
          <div class="role">${esc(L(h.role))}</div>
          <p>${esc(L(h.body))}</p>
          ${h.link ? `<a class="btn btn-blue" href="${esc(h.link)}" target="_blank" rel="noopener">${esc(T('openWork'))}</a>` : ''}
        </article>`;
    } else if (st.type === 'quiz') {
      html = renderQuiz(s);
    } else if (st.type === 'question') {
      html = renderQuestion(st.qid);
    } else if (st.type === 'done') {
      markDone(s.id);
      const ni = nextIndex();
      const nextName = previewMode ? '' : ni < N ? T('nextStop', L(STATIONS[ni].name)) : T('lastStop');
      const lessonBreak = !previewMode && CONFIG.lessonBreakAfter === s.id && ni < N;
      html = `<div class="done-card">
        <div class="stamp">${esc(T('stamp'))}</div>
        <h3>${esc(T('doneTitle', L(s.name)))}</h3>
        <p>${esc(nextName)}</p>
        ${lessonBreak ? `<div class="break-box">
          <h3>🔔 ${esc(T('breakTitle'))}</h3>
          <p>${esc(T('breakText'))}</p>
          <p class="code-value">${esc(makeCode(player))}</p>
          <p class="code-nick">${esc(player.nick)}</p>
        </div>` : ''}</div>`;
    }
    body.innerHTML = html;
    // 지도가 주인공인 카드(전쟁 흐름·세계 지도)에서는 휴대폰·태블릿 지도를 크게
    $('gameScreen').classList.toggle('map-focus', ['timeline', 'ops', 'find', 'mission'].includes(st.type) || (!!s.offMap && st.type === 'story'));
    if (st.type === 'timeline') bindTimeline();
    else { stopTimeline(); setWarPhase(null); }
    if (st.type === 'find') startFind(s); else endFind();
    if (st.type === 'mission') startMission(); else endMission();
    if (st.type === 'video') bindVideo();
    if (st.type === 'ops') bindOps();
    else if (s.inset === 'incheon') showOpFx(null);
    if (st.type === 'hero' && st.cid) unlockCard(st.cid);
    if (st.type === 'story') (s.cards || []).forEach(unlockCard);
    if (st.type === 'quiz') bindQuiz(s);
    if (st.type === 'question') bindQuestion(st.qid);
    if (['story', 'hero', 'quiz', 'question', 'mission', 'find'].includes(st.type)) annotate(body);

    $('dots').innerHTML = steps.map((x, k) => `<i class="${k === step ? 'on' : ''}${x.type === 'question' ? ' q' : ''}${x.type === 'find' || x.type === 'mission' ? ' g' : ''}"></i>`).join('');
    $('prevBtn').textContent = T('prev');
    $('prevBtn').disabled = step === 0;
    $('nextBtn').textContent = st.type === 'done' ? T('toMap') : T('next');
    // 🎬 꼭 볼 영상을 끝까지 봐야 [다음]이 열려요
    $('nextBtn').disabled = st.type === 'video' && !!mustWatch(s);
  }

  function markDone(id) {
    if (previewMode || player.done.includes(id)) return;
    player.done.push(id);
    cur.completed = true;
    newPiece = id; // 지도로 돌아가면 이 자리의 안개가 걷혀요
    save();
    reportProgress(`station ${player.done.length}`);
  }

  /* ---------------- 퀴즈 ---------------- */
  const quizStore = () => (previewMode ? (cur.previewQuiz = cur.previewQuiz || {}) : cur.retryQuiz || player.quiz);

  function renderQuiz(s) {
    const q = s.quiz;
    const picked = quizStore()[s.id];
    const btns = q.type === 'ox'
      ? `<div class="ox"><button type="button" data-v="true" aria-label="O">O</button><button type="button" data-v="false" aria-label="X">X</button></div>`
      : `<div class="choices">${q.options.map((o, k) => `<button type="button" data-v="${k}"><span class="k">${k + 1}</span>${esc(L(o))}</button>`).join('')}</div>`;
    return `<div class="kicker">${esc(T('kQuiz'))}</div>
      <div class="quiz${picked !== undefined ? ' answered' : ''}" id="quizBox">
        <p class="quiz-q">${esc(L(q.q))}</p>
        ${btns}
        <div id="quizFeedback"></div>
        ${picked === undefined ? `<p class="skip-hint">${esc(T('quizHint'))}</p>` : ''}
      </div>`;
  }

  function bindQuiz(s) {
    const box = $('quizBox');
    const q = s.quiz;
    const show = (val) => {
      const correctVal = String(q.answer);
      box.classList.add('answered');
      box.querySelectorAll('button').forEach((b) => {
        if (b.dataset.v === correctVal) b.classList.add('right');
        else if (b.dataset.v === String(val)) b.classList.add('wrong');
      });
      const good = String(val) === correctVal;
      $('quizFeedback').innerHTML = `<div class="feedback ${good ? 'good' : 'bad'}"><b>${esc(good ? T('right') : T('wrong'))}</b>${esc(L(q.explain))}</div>`;
      const hint = box.querySelector('.skip-hint');
      if (hint) hint.remove();
      annotate($('sheetBody'));
    };
    // 한 번 틀리면 한 번 더 기회! (처음에 맞히면 ⭐2, 두 번째에 맞히면 ⭐1)
    cur.qwrong = cur.qwrong || {};
    box.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      if (quizStore()[s.id] !== undefined) return;
      const v = q.type === 'ox' ? b.dataset.v === 'true' : Number(b.dataset.v);
      const correct = String(v) === String(q.answer);
      const firstWrong = cur.qwrong[s.id];
      if (!correct && firstWrong === undefined) {
        cur.qwrong[s.id] = v;
        b.classList.add('wrong'); b.disabled = true;
        $('quizFeedback').innerHTML = `<div class="feedback bad"><b>${esc(T('quizRetry'))}</b></div>`;
        say(T('gQuizRetry'));
        return;
      }
      quizStore()[s.id] = v;
      if (cur.retryQuiz && correct && !previewMode) player.quiz[s.id] = v; // 다시 도전해서 맞히면 기록도 '맞음'으로
      save();
      if (correct) giveStars(`quiz:${s.id}`, RULES.quiz[firstWrong === undefined ? 0 : 1], b);
      show(v);
    }));
    if (quizStore()[s.id] !== undefined) show(quizStore()[s.id]);
  }

  /* ---------------- 질문 카드 ---------------- */
  // 이 기기에 남은 모든 예상 답변 (방명록)
  function allAnswers(qid) {
    const out = [];
    Object.values(store.games).forEach((g) => {
      const a = g.answers && g.answers[qid];
      if (a && a.text) out.push({ nick: g.nick, text: a.text, time: a.time, mine: player && g.id === player.id });
    });
    return out.sort((a, b) => b.time - a.time);
  }

  function renderQuestion(qid) {
    const q = QUESTIONS[qid];
    const mine = !previewMode && player.answers[qid] ? player.answers[qid].text : '';
    return `<div class="kicker">${esc(T('kQuestion'))}</div>
      <article class="q-card">
        <div class="q-from">✉️ ${esc(T('askedBy', maskName(q.asker, q.askerRoman)))}</div>
        <p class="q-text">“${esc(L(q.text))}”</p>
        ${lang === 'en' ? '' : `<details class="q-en"><summary>${esc(T('showEn'))}</summary><p lang="en">${esc(q.en)}</p></details>`}
      </article>
      <p class="q-intro">${esc(T('qIntro'))}</p>
      <label class="guess-label" for="guess">${esc(T('myGuessLabel'))}</label>
      <textarea id="guess" class="guess" maxlength="400" rows="4" placeholder="${esc(T('guessPh'))}">${esc(mine)}</textarea>
      <div class="guess-row">
        <button id="saveGuess" class="btn btn-blue" type="button">${esc(T(mine ? 'editGuess' : 'saveGuess'))}</button>
        ${CONFIG.padletUrl ? `<button id="toPadlet" class="btn btn-go" type="button">${esc(T('openPadlet'))}</button>` : ''}
        <span id="guessMsg" class="guess-msg" role="status"></span>
      </div>
      <p class="skip-hint">${esc(T('skipGuess'))}</p>
      <h4 class="others-title">${esc(T('othersTitle'))}</h4>
      <ul id="others" class="others"></ul>`;
  }

  function renderOthers(qid) {
    const list = allAnswers(qid);
    $('others').innerHTML = list.length
      ? list.map((a) => `<li class="${a.mine ? 'mine' : ''}"><b>${esc(a.nick)}${a.mine ? ` <small>(${esc(T('you'))})</small>` : ''}</b><p>${esc(a.text)}</p></li>`).join('')
      : `<li class="empty">${esc(T('noOthers'))}</li>`;
  }

  // 적어 둔 답을 저장 (버튼을 안 눌러도 카드를 넘기거나 닫을 때 자동으로)
  function saveGuess(qid) {
    const box = $('guess');
    if (!box || previewMode) return false;
    const text = box.value.trim();
    const old = player.answers[qid] ? player.answers[qid].text : '';
    // 🧹 방명록·패들렛에 올라가는 글이라 욕설·비하·ㅋㅋ는 저장하지 않아요
    const bad = textProblem(text);
    if (bad) { if ($('guessMsg')) $('guessMsg').textContent = bad; box.classList.add('is-error'); return false; }
    box.classList.remove('is-error');
    if (!text || text === old) return !!text;
    player.answers[qid] = { text, time: Date.now() };
    save();
    giveStars(`q:${qid}`, RULES.question, $('saveGuess'));
    return true;
  }
  function flushGuess() {
    if (!cur) return;
    const st = cur.steps[cur.step];
    if (st && st.type === 'question') saveGuess(st.qid);
  }

  // 패들렛에 붙여 넣을 한 덩어리 글
  const qNumber = (qid) => Object.keys(QUESTIONS).indexOf(qid) + 1;
  const padletText = (qid, text) => `[Q${qNumber(qid)}] ${L(QUESTIONS[qid].text)}\n→ ${text}\n— ${player.nick}`;

  function bindQuestion(qid) {
    renderOthers(qid);
    const btn = $('saveGuess');
    if (previewMode) { btn.disabled = true; $('guess').disabled = true; if ($('toPadlet')) $('toPadlet').disabled = true; return; }
    btn.addEventListener('click', () => {
      if (!$('guess').value.trim()) { $('guessMsg').textContent = T('emptyGuess'); $('guess').focus(); return; }
      if (!saveGuess(qid)) { $('guess').focus(); return; }
      $('guessMsg').textContent = '✓ ' + T('saved');
      btn.textContent = T('editGuess');
      renderOthers(qid);
    });
    const pb = $('toPadlet');
    if (pb) pb.addEventListener('click', () => {
      const text = $('guess').value.trim();
      if (!text) { $('guessMsg').textContent = T('emptyGuess'); $('guess').focus(); return; }
      if (!saveGuess(qid)) { $('guess').focus(); return; }
      renderOthers(qid);
      // 복사를 먼저 시작하고 곧바로 새 창을 열어야 팝업이 막히지 않아요
      const copying = copyText(padletText(qid, text));
      const opened = openPadlet();
      copying.then((ok) => { if (opened) toast(ok ? T('padletPopup') : T('copyFail')); });
    });
  }

  // 패들렛을 새 창(팝업)으로 열기
  function openPadlet() {
    // 링크 모드는 새 창을 스크립트로 열 수 없어서, 바로 누를 수 있는 링크 버튼을 보여 줘요
    if (SANDBOX) {
      openInfo('✎', T('padletTitle'), `<p>${esc(T('padletLinkHelp'))}</p>
        <p><a class="btn btn-go" href="${esc(CONFIG.padletUrl)}" target="_blank" rel="noopener">${esc(T('gbBoard'))}</a></p>`);
      return false;
    }
    const w = window.open(CONFIG.padletUrl, 'mapTomorrowPadlet', 'popup=yes,width=1000,height=820');
    if (!w) {
      openInfo('✎', T('padletTitle'), `<p>${esc(T('popupBlocked'))}</p>
        <p><a class="btn btn-go" href="${esc(CONFIG.padletUrl)}" target="_blank" rel="noopener">${esc(T('gbBoard'))}</a></p>`);
      return false;
    }
    return true;
  }

  /* ---------------- 버튼 연결 ---------------- */
  $('nextBtn').addEventListener('click', () => {
    if (!cur) return;
    flushGuess();
    if (cur.step >= cur.steps.length - 1) { closeStation(); return; }
    cur.step++;
    renderStep();
  });
  $('prevBtn').addEventListener('click', () => { if (cur && cur.step > 0) { flushGuess(); cur.step--; renderStep(); } });
  $('sheetClose').addEventListener('click', () => { flushGuess(); closeStation(); });

  /* =====================================================================
     작은 창: 나의 여정 코드 / 방명록
     ===================================================================== */
  function openInfo(icon, title, html) {
    $('infoIcon').textContent = icon;
    $('infoTitle').textContent = title;
    $('infoBody').innerHTML = html;
    $('infoSheet').hidden = false;
    $('infoClose').focus();
  }
  $('infoClose').addEventListener('click', () => { $('infoSheet').hidden = true; });

  function showCode() {
    if (!player) return;
    openInfo('🔑', T('codeTitle'), `
      <div class="code-show">
        <p class="code-nick">${esc(player.nick)}</p>
        <p class="code-value">${esc(makeCode(player))}</p>
        <p>${esc(T('codeGuide'))}</p>
        <p class="t-help">${esc(T('codeNote'))}</p>
      </div>`);
  }

  function myAnswersText() {
    if (!player) return '';
    return Object.keys(QUESTIONS)
      .filter((qid) => player.answers[qid] && player.answers[qid].text)
      .map((qid) => padletText(qid, player.answers[qid].text))
      .join('\n\n');
  }

  function guestbookHtml(forTeacher) {
    const blocks = Object.keys(QUESTIONS).map((qid) => {
      const q = QUESTIONS[qid];
      const list = allAnswers(qid);
      return `<section class="gb-q">
        <h3>“${esc(L(q.text))}”</h3>
        <ul class="others">${list.length
          ? list.map((a) => `<li class="${a.mine ? 'mine' : ''}"><b>${esc(a.nick)}</b><p>${esc(a.text)}</p></li>`).join('')
          : `<li class="empty">${esc(T('noOthers'))}</li>`}</ul>
      </section>`;
    }).join('');
    const padlet = CONFIG.padletUrl ? `
      <section class="padlet-box">
        <h3>${esc(T('padletTitle'))}</h3>
        ${forTeacher ? '' : `<p class="t-help">${esc(T('padletHint'))}</p>`}
        <div class="t-buttons">
          ${forTeacher ? '' : `<button id="copyMine" class="btn btn-blue" type="button">${esc(T('gbMine'))}</button>`}
          <button id="openPadletBtn" class="btn btn-go" type="button">${esc(T('gbBoard'))}</button>
        </div>
        <textarea id="copyFallback" class="guess" rows="5" readonly hidden></textarea>
      </section>` : (forTeacher ? '' : `
      <div class="t-buttons"><button id="copyMine" class="btn btn-blue" type="button">${esc(T('gbMine'))}</button></div>
      <textarea id="copyFallback" class="guess" rows="5" readonly hidden></textarea>`);
    return `<p class="q-intro">${esc(T('gbIntro'))}</p>${padlet}
      <h3 class="device-title">${esc(T('deviceList'))}</h3>
      <p class="t-help">${esc(T('gbDevice'))}</p>${blocks}`;
  }

  function openGuestbook(forTeacher) {
    openInfo('✎', T('guestbookTitle'), guestbookHtml(forTeacher));
    const b = $('copyMine');
    if (b) b.addEventListener('click', () => {
      const text = myAnswersText();
      if (!text) { toast(T('noMine')); return; }
      const copying = copyText(text, $('copyFallback'));
      const opened = CONFIG.padletUrl ? openPadlet() : false;
      copying.then((ok) => toast(ok ? (opened ? T('padletPopup') : T('copied')) : T('copyFail')));
    });
    const p = $('openPadletBtn');
    if (p) p.addEventListener('click', openPadlet);
  }
  $('guestbookBtn').addEventListener('click', () => openGuestbook(previewMode));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!$('infoSheet').hidden) $('infoSheet').hidden = true;
    else if (!$('stationSheet').hidden) { flushGuess(); closeStation(); }
  });

  /* =====================================================================
     엔딩 — 내 예상 vs 참전용사의 진짜 답 (질문 하나씩)
     ===================================================================== */
  const QIDS = Object.keys(QUESTIONS);
  // 엔딩: 시작 → 질문 5개(진짜 답) → 더 알아보기 → 인증서 → 📝 소감 설문 (게임의 맨 마지막)
  const END_STEPS = ['intro', ...QIDS, 'more', 'finish', ...(CONFIG.feedbackForms ? ['survey'] : [])];
  let endStep = 0;
  const endVet = {}; // 질문별로 지금 보고 있는 참전용사 (답이 두 분일 때)

  function openEnding() {
    // 지도는 다 모았는데 아직 문을 안 열었으면 문부터 (선생님 미리 보기는 바로)
    if (!previewMode && player && doneCount(player) === N && !player.keyDone) { openDoor(); return; }
    endStep = 0;
    resetStationUI();
    showScreen('endingScreen');
    applyStaticText();
    renderEnding();
  }

  function youtubeId(url) {
    const m = String(url).match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : (/^[\w-]{11}$/.test(url) ? url : '');
  }

  function videoHtml(video) {
    const src = video ? L(video.src) : '';
    if (!src) {
      return `<div class="video-box video-soon"><span aria-hidden="true">🎬</span><b>${esc(T('videoSoon'))}</b><small>${esc(T('videoSoonSub'))}</small></div>`;
    }
    if (video.type === 'youtube') {
      const id = youtubeId(src);
      return `<div class="video-box"><iframe src="https://www.youtube-nocookie.com/embed/${esc(id)}?rel=0" title="video" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
        <a class="v-yt-link" href="https://www.youtube.com/watch?v=${esc(id)}" target="_blank" rel="noopener">${esc(T('onYoutube'))}</a>`;
    }
    return `<div class="video-box"><video src="${esc(src)}" controls preload="metadata" playsinline></video></div>`;
  }

  function saveEndGuess() {
    const box = $('endGuess');
    const qid = END_STEPS[endStep];
    if (!box || !QUESTIONS[qid]) return false;
    const text = box.value.trim();
    if (!text) return false;
    const bad = textProblem(text);
    if (bad) { toast(bad); box.classList.add('is-error'); return false; }
    player.answers[qid] = { text, time: Date.now() };
    save();
    return true;
  }

  /* =====================================================================
     🗺️ 평화의 지도 인증서 — 내가 완성한 지도 위에 작전 지점 도장 12개
     그림(PNG)으로 저장·복사해서 패들렛에 올려요. 지도 위 도장을 누르면 그곳 이름이 떠요.
     ===================================================================== */
  const CERT_W = 1080, CERT_H = 1350;
  const CM = { x: 40, y: 232, w: 596, h: 702, vx: 30, vy: 330, vw: 560, vh: 660 }; // 인증서 속 지도 칸
  const CK = CM.w / CM.vw;
  const certXY = (x, y) => [CM.x + (x - CM.vx) * CK, CM.y + (y - CM.vy) * CK];
  const CH_COLOR = { prologue: '#0047a0', incheon: '#cd2e3a', journey: '#ce1126', return: '#003893' };
  const certFont = (size, bold) => (lang === 'ko'
    ? `${size}px Jua, "Noto Sans KR", sans-serif`
    : `${bold ? 800 : 600} ${size}px "Baloo 2", Jua, "Noto Sans KR", sans-serif`);
  const bodyFont = (size, bold) => `${bold ? 700 : 400} ${size}px "Noto Sans KR", system-ui, sans-serif`;
  let certSel = -1;      // 누른 도장
  let certAnim = 0;      // 애니메이션 번호 (새로 그리면 앞의 것은 멈춤)

  function certData() {
    const cards = allCards();
    const hero = cards.find((c) => c.id === player.myHero && hasCard(c));
    const d = new Date();
    const date = lang === 'ko' ? `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
      : lang === 'es' ? `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
        : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const stars = starTotal(player);
    return {
      nick: player.nick, realName: (player.realName || '').trim(), school: (player.school || '').trim(),
      nation: player.nation === 'other' ? '' : player.nation, nationName: nationName(player),
      stars, rank: rankOf(stars), cards: cardCount(), cardsTotal: cards.length,
      gold: goldCount(), pieces: doneCount(player), pledge: (player.pledge || '').trim(), hero, date,
      perfect: STATIONS.map((s) => !previewMode && isDone(s.id) && stationReqs(s).every(Boolean))
    };
  }

  // 글을 칸 너비에 맞춰 여러 줄로 (한국어는 띄어쓰기 기준, 너무 긴 낱말은 글자 단위로)
  function wrapLines(ctx, text, maxW, maxLines) {
    const lines = [];
    let line = '';
    for (const word of String(text).split(/(?<=\s)/)) {
      if (ctx.measureText(line + word).width <= maxW) { line += word; continue; }
      if (line.trim()) { lines.push(line.trim()); line = ''; }
      if (ctx.measureText(word).width <= maxW) { line = word; continue; }
      for (const ch of word) {
        if (ctx.measureText(line + ch).width > maxW && line) { lines.push(line); line = ''; }
        line += ch;
      }
    }
    if (line.trim()) lines.push(line.trim());
    if (maxLines && lines.length > maxLines) {
      lines.length = maxLines;
      let last = lines[maxLines - 1];
      while (last && ctx.measureText(last + '…').width > maxW) last = last.slice(0, -1);
      lines[maxLines - 1] = last + '…';
    }
    return lines;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function starPath(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
  }
  // 국기 (윈도우에서는 국기 이모지가 안 보여서 직접 그려요)
  function drawFlag(ctx, flag, x, y, w, h) {
    ctx.save();
    roundRect(ctx, x, y, w, h, 3); ctx.clip();
    if (flag === 'co') {
      ctx.fillStyle = '#fcd116'; ctx.fillRect(x, y, w, h / 2);
      ctx.fillStyle = '#003893'; ctx.fillRect(x, y + h / 2, w, h / 4);
      ctx.fillStyle = '#ce1126'; ctx.fillRect(x, y + h * 0.75, w, h / 4);
    } else if (flag === 'kr') {
      ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, h);
      const cx = x + w / 2, cy = y + h / 2, r = h * 0.25;
      ctx.fillStyle = '#cd2e3a'; ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#0047a0'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI); ctx.fill();
      ctx.fillStyle = '#14224b';
      [[-1, -1], [1, 1], [1, -1], [-1, 1]].forEach(([sx, sy]) => ctx.fillRect(cx + sx * w * 0.33 - 2, cy + sy * h * 0.3 - 3, 4, 6));
    } else {
      for (let i = 0; i < 7; i++) { ctx.fillStyle = i % 2 ? '#fff' : '#b22234'; ctx.fillRect(x, y + (i * h) / 7, w, h / 7 + 0.5); }
      ctx.fillStyle = '#3c3b6e'; ctx.fillRect(x, y, w * 0.42, h * 0.54);
    }
    ctx.restore();
    ctx.strokeStyle = 'rgba(20,34,75,.25)'; ctx.lineWidth = 1; roundRect(ctx, x, y, w, h, 3); ctx.stroke();
  }
  const ease = (t) => { t = Math.min(1, Math.max(0, t)); const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

  // prog: 0 → 1 (도장이 하나씩 찍히는 애니메이션), sel: 강조할 도장 (저장할 그림에는 -1)
  function drawCert(ctx, D, prog, sel) {
    const W = CERT_W, H = CERT_H;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fffdf5'; ctx.fillRect(0, 0, W, H);
    // 위: 콜롬비아 국기 띠 / 아래: 태극 빨강·파랑 띠
    ctx.fillStyle = '#fcd116'; ctx.fillRect(0, 0, W, 20);
    ctx.fillStyle = '#003893'; ctx.fillRect(0, 20, W, 10);
    ctx.fillStyle = '#ce1126'; ctx.fillRect(0, 30, W, 10);
    ctx.fillStyle = '#cd2e3a'; ctx.fillRect(0, H - 20, W / 2, 20);
    ctx.fillStyle = '#0047a0'; ctx.fillRect(W / 2, H - 20, W / 2, 20);
    ctx.strokeStyle = '#e0b12a'; ctx.lineWidth = 5; roundRect(ctx, 16, 56, W - 32, H - 92, 26); ctx.stroke();
    ctx.strokeStyle = '#f3dc8a'; ctx.lineWidth = 2; roundRect(ctx, 26, 66, W - 52, H - 112, 20); ctx.stroke();

    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#4b5878'; ctx.font = `700 22px "Baloo 2", sans-serif`;
    ctx.fillText('M.A.P. to Tomorrow · Memory-Across-Peace', W / 2, 112);
    ctx.fillStyle = '#14224b'; ctx.font = certFont(lang === 'ko' ? 62 : 56, true);
    ctx.fillText(T('certTitle'), W / 2, 184);

    /* ---- 지도 ---- */
    ctx.save();
    roundRect(ctx, CM.x, CM.y, CM.w, CM.h, 22); ctx.clip();
    ctx.fillStyle = '#bfe0f2'; ctx.fillRect(CM.x, CM.y, CM.w, CM.h);
    ctx.strokeStyle = '#9fcde9'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let y = 360; y < 1000; y += 90) {
      for (let x = (y / 90) % 2 ? 40 : 90; x < 600; x += 130) {
        const [a, b] = certXY(x, y);
        ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo(a + 9, b - 7, a + 17, b); ctx.quadraticCurveTo(a + 26, b + 7, a + 34, b); ctx.stroke();
      }
    }
    ctx.beginPath();
    COAST.forEach((c, i) => { const [x, y] = certXY(...P(...c)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.closePath();
    ctx.fillStyle = '#fff3c4'; ctx.fill();
    ctx.strokeStyle = '#e3b93a'; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke();
    const [jx, jy] = certXY(...P(126.55, 33.38));
    ctx.beginPath(); ctx.ellipse(jx, jy, 30 * CK, 16 * CK, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 38도선 · 휴전선
    const y38 = certXY(0, P(0, 38)[1])[1];
    ctx.setLineDash([10, 8]); ctx.strokeStyle = 'rgba(20,34,75,.45)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(CM.x, y38); ctx.lineTo(CM.x + CM.w, y38); ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#c8102e'; ctx.lineWidth = 3;
    ctx.beginPath(); DMZ.forEach((c, i) => { const [x, y] = certXY(...P(...c)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
    ctx.font = bodyFont(17, true); ctx.fillStyle = 'rgba(20,34,75,.6)'; ctx.textAlign = 'right';
    ctx.fillText(T('line38'), CM.x + CM.w - 12, y38 - 8);
    ctx.textAlign = 'left'; ctx.font = certFont(24); ctx.fillStyle = 'rgba(20,80,130,.45)';
    ctx.fillText(T('seaW'), ...certXY(40, 660)); ctx.fillText(T('seaE'), ...certXY(470, 420));
    // 콜롬비아에서 온 뱃길
    const col = STATIONS.find((s) => s.offMap);
    if (col) {
      const [cx, cy] = certXY(col.map.x, col.map.y);
      ctx.setLineDash([3, 9]); ctx.strokeStyle = '#003893'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(CM.x + CM.w + 10, CM.y + CM.h + 10); ctx.quadraticCurveTo(cx + 40, cy + 70, cx + 16, cy + 18); ctx.stroke();
      ctx.setLineDash([]);
    }
    // 나침반
    const [nx, ny] = [CM.x + CM.w - 40, CM.y + 46];
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(nx, ny, 24, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ce1126'; ctx.beginPath(); ctx.moveTo(nx, ny - 18); ctx.lineTo(nx + 7, ny); ctx.lineTo(nx - 7, ny); ctx.fill();
    ctx.fillStyle = '#14224b'; ctx.beginPath(); ctx.moveTo(nx, ny + 18); ctx.lineTo(nx + 7, ny); ctx.lineTo(nx - 7, ny); ctx.fill();
    ctx.font = `800 15px "Baloo 2", sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText('N', nx, ny - 2);

    // 여정 길 + 도장
    const shown = STATIONS.map((s, i) => Math.max(0, Math.min(1, (prog - 0.08 - i * 0.065) / 0.14)));
    const count = shown.filter((v) => v > 0).length;
    const pts = STATIONS.map((s) => { const [x, y] = certXY(s.map.x, s.map.y); return { x, y }; });
    const trace = (upto) => {
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < upto; i++) {
        const a = pts[i - 1], b = pts[i];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        const bend = Math.min(40 * CK, len * 0.18) * (i % 2 ? 1 : -1);
        ctx.quadraticCurveTo(mx - (dy / len) * bend, my + (dx / len) * bend, b.x, b.y);
      }
    };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    trace(N); ctx.setLineDash([2, 13]); ctx.strokeStyle = '#b8c2d6'; ctx.lineWidth = 5; ctx.stroke(); ctx.setLineDash([]);
    if (count > 1) { trace(count); ctx.strokeStyle = '#ce1126'; ctx.lineWidth = 5; ctx.stroke(); }
    STATIONS.forEach((s, i) => {
      const k = ease(shown[i]);
      if (k <= 0) return;
      const { x, y } = pts[i];
      const r = 19 * k * (i === sel ? 1.25 : 1);
      const gold = D.perfect[i];
      ctx.save();
      ctx.shadowColor = 'rgba(20,34,75,.3)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
      ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI * 2); ctx.fillStyle = gold ? '#b8860b' : '#fff'; ctx.fill();
      ctx.restore();
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      if (gold) { const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r); g.addColorStop(0, '#fff1a8'); g.addColorStop(0.5, '#f5c542'); g.addColorStop(1, '#d99a0b'); ctx.fillStyle = g; } else ctx.fillStyle = CH_COLOR[chapterOf(s)];
      ctx.fill();
      ctx.fillStyle = gold ? '#3a2a00' : '#fff'; ctx.font = `800 ${Math.round(20 * k)}px "Baloo 2", sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(i + 1), x, y + 1);
      ctx.textBaseline = 'alphabetic';
      if (i === sel) { ctx.strokeStyle = '#14224b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r + 7, 0, Math.PI * 2); ctx.stroke(); }
    });
    // 누른 도장의 이름 말풍선 (화면에서만 — 저장하는 그림에는 안 들어가요)
    if (sel >= 0 && sel < N) {
      const s = STATIONS[sel], { x, y } = pts[sel];
      ctx.font = bodyFont(22, true);
      const text = `${sel + 1}. ${L(s.name)}`, sub = L(s.date);
      const w = Math.min(CM.w - 20, Math.max(ctx.measureText(text).width, (ctx.font = bodyFont(18), ctx.measureText(sub).width)) + 28);
      const bx = Math.min(Math.max(x - w / 2, CM.x + 10), CM.x + CM.w - w - 10);
      const by = y - 30 - 72 < CM.y + 8 ? y + 32 : y - 30 - 72;
      ctx.fillStyle = 'rgba(20,34,75,.92)'; roundRect(ctx, bx, by, w, 72, 14); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.font = bodyFont(22, true); ctx.fillText(text, bx + 14, by + 32, w - 28);
      ctx.font = bodyFont(18); ctx.fillStyle = '#fcd116'; ctx.fillText(sub, bx + 14, by + 58, w - 28);
    }
    ctx.restore();
    ctx.strokeStyle = '#14224b'; ctx.lineWidth = 3; roundRect(ctx, CM.x, CM.y, CM.w, CM.h, 22); ctx.stroke();
    // 지도 아래 설명
    ctx.textAlign = 'left'; ctx.font = bodyFont(18); ctx.fillStyle = '#4b5878';
    starPath(ctx, CM.x + 12, CM.y + CM.h + 26, 10); ctx.fillStyle = '#f5c542'; ctx.fill();
    ctx.fillStyle = '#4b5878'; ctx.fillText(T('certGoldStamp'), CM.x + 30, CM.y + CM.h + 33, CM.w - 30);

    /* ---- 오른쪽: 이름 · 칭호 · 기록 · 나의 영웅 ---- */
    const RX = 668, RW = W - 40 - RX;
    let ry = 262;
    ctx.textAlign = 'left'; ctx.fillStyle = '#4b5878'; ctx.font = bodyFont(20, true);
    ctx.fillText(T('certNameLabel'), RX, ry);
    // 이름 (아직 안 적었으면 닉네임) — 칸에 맞게 글자 크기를 줄여요
    const who = D.realName || D.nick;
    let ns = 60; ctx.font = certFont(ns, true);
    while (ctx.measureText(who).width > RW && ns > 30) { ns -= 4; ctx.font = certFont(ns, true); }
    ry += ns + 4; ctx.fillStyle = '#003893'; ctx.fillText(who, RX, ry);
    // 학교
    ry += 10;
    ctx.fillStyle = '#14224b'; ctx.font = bodyFont(22, true);
    const sl = wrapLines(ctx, D.school ? `🏫 ${D.school}` : '🏫 ─', RW, 2);
    sl.forEach((l) => { ry += 30; ctx.fillText(l, RX, ry); });
    // 국적 (국기 + 이름)
    ry += 12;
    let fx = RX;
    if (D.nation) { drawFlag(ctx, D.nation, RX, ry, 39, 26); fx += 50; }
    ctx.fillStyle = '#14224b'; ctx.font = bodyFont(22, true);
    ctx.fillText(D.nationName || '🌏 ─', fx, ry + 21, RW - (fx - RX));
    ry += 26 + 14;
    // 칭호
    ctx.font = bodyFont(19, true);
    const rl = wrapLines(ctx, `「${D.rank}」`, RW - 28, 2);
    ctx.fillStyle = '#fff6cf'; roundRect(ctx, RX, ry, RW, rl.length * 27 + 18, 14); ctx.fill();
    ctx.fillStyle = '#8a6400'; rl.forEach((l, k) => ctx.fillText(l, RX + 14, ry + 31 + k * 27));
    ry += rl.length * 27 + 18 + 14;
    // 기록 네 칸
    const stats = [
      ['star', T('certStars'), `${D.stars.toLocaleString(lang)}`, `/ ${RULES.total.toLocaleString(lang)}`],
      ['🎴', T('certCards'), `${D.cards}`, `/ ${D.cardsTotal}`],
      ['✨', T('certGold'), `${D.gold}`, `/ ${D.cardsTotal}`],
      ['🧩', T('certPieces'), `${D.pieces}`, `/ ${N}`]
    ];
    const bw = (RW - 10) / 2, bh = 86;
    stats.forEach(([icon, label, big, small], k) => {
      const bx = RX + (k % 2) * (bw + 10), by = ry + Math.floor(k / 2) * (bh + 10);
      ctx.fillStyle = '#eaf4fb'; roundRect(ctx, bx, by, bw, bh, 14); ctx.fill();
      if (icon === 'star') { starPath(ctx, bx + 22, by + 25, 12); ctx.fillStyle = '#f5c542'; ctx.fill(); ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 1.5; ctx.stroke(); }
      else { ctx.font = '20px "Segoe UI Emoji", "Apple Color Emoji", sans-serif'; ctx.fillStyle = '#14224b'; ctx.fillText(icon, bx + 11, by + 33); }
      ctx.fillStyle = '#4b5878'; ctx.font = bodyFont(15, true); ctx.fillText(label, bx + 40, by + 31, bw - 48);
      ctx.fillStyle = '#14224b'; ctx.font = `800 32px "Baloo 2", sans-serif`; ctx.fillText(big, bx + 12, by + 72);
      const bwid = ctx.measureText(big).width;
      ctx.fillStyle = '#4b5878'; ctx.font = `700 18px "Baloo 2", sans-serif`; ctx.fillText(small, bx + 18 + bwid, by + 72);
    });
    ry += bh * 2 + 10 + 24;
    // 나의 영웅
    ctx.fillStyle = '#4b5878'; ctx.font = bodyFont(20, true); ctx.fillText(T('certMyHero'), RX, ry);
    ry += 12;
    const hh = CM.y + CM.h - ry;
    const hero = D.hero;
    const gold = hero && isGold(hero);
    ctx.fillStyle = gold ? '#fff8dc' : '#fff'; roundRect(ctx, RX, ry, RW, hh, 18); ctx.fill();
    ctx.strokeStyle = gold ? '#e0b12a' : hero ? { co: '#fcd116', kr: '#0047a0', us: '#3c3b6e' }[hero.flag] || '#0047a0' : '#d9e2ef';
    ctx.lineWidth = 4; roundRect(ctx, RX, ry, RW, hh, 18); ctx.stroke();
    if (hero) {
      drawFlag(ctx, hero.flag, RX + 18, ry + 20, 48, 32);
      if (gold) { ctx.fillStyle = '#f5c542'; roundRect(ctx, RX + RW - 118, ry + 20, 100, 30, 15); ctx.fill(); ctx.fillStyle = '#3a2a00'; ctx.font = bodyFont(15, true); ctx.textAlign = 'center'; ctx.fillText(T('goldLabel'), RX + RW - 68, ry + 41, 92); ctx.textAlign = 'left'; }
      ctx.fillStyle = '#14224b'; ctx.font = certFont(34, true);
      const nl = wrapLines(ctx, L(hero.name), RW - 36, 2);
      nl.forEach((l, k) => ctx.fillText(l, RX + 18, ry + 96 + k * 40));
      let hy = ry + 90 + nl.length * 40;
      ctx.fillStyle = '#ce1126'; ctx.font = bodyFont(19, true);
      wrapLines(ctx, L(hero.role), RW - 36, 2).forEach((l) => { ctx.fillText(l, RX + 18, hy); hy += 27; });
      // 업적 한 줄 (칸이 남는 만큼)
      const deed = L((hero.deeds || [])[0]);
      const room = Math.floor((ry + hh - 16 - hy) / 27);
      if (deed && room > 0) {
        hy += 8; ctx.fillStyle = '#14224b'; ctx.font = bodyFont(18);
        wrapLines(ctx, deed, RW - 36, room).forEach((l) => { ctx.fillText(l, RX + 18, hy); hy += 27; });
      }
    } else {
      ctx.fillStyle = '#b8c2d6'; ctx.font = bodyFont(20); ctx.textAlign = 'center';
      ctx.fillText('—', RX + RW / 2, ry + hh / 2 + 8); ctx.textAlign = 'left';
    }

    /* ---- 아래: 나의 평화 다짐 ---- */
    const PY = 990;
    ctx.fillStyle = '#fff'; roundRect(ctx, 40, PY, W - 80, 192, 22); ctx.fill();
    ctx.strokeStyle = '#ce1126'; ctx.lineWidth = 3; ctx.setLineDash([12, 8]); roundRect(ctx, 40, PY, W - 80, 192, 22); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#ce1126'; ctx.font = bodyFont(20, true);
    const lab = `🕊️ ${T('certPledge')}`;
    const lw = ctx.measureText(lab).width + 32;
    roundRect(ctx, 70, PY - 20, lw, 40, 20); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillText(lab, 86, PY + 7);
    ctx.textAlign = 'center';
    if (D.pledge) {
      ctx.fillStyle = '#14224b'; ctx.font = certFont(lang === 'ko' ? 38 : 36);
      const pl = wrapLines(ctx, D.pledge, W - 160, 2);
      pl.forEach((l, k) => ctx.fillText(l, W / 2, PY + (pl.length === 1 ? 108 : 86) + k * 50));
    } else {
      ctx.strokeStyle = '#d9e2ef'; ctx.lineWidth = 2;
      [90, 140].forEach((dy) => { ctx.beginPath(); ctx.moveTo(90, PY + dy); ctx.lineTo(W - 90, PY + dy); ctx.stroke(); });
    }
    // 참전용사의 말 + 날짜 + 만든 곳
    ctx.fillStyle = '#ce1126'; ctx.font = certFont(28);
    ctx.fillText(`${T('finishQuote')}  ${T('finishQuoteBy').replace(/^—\s*/, '— ')}`, W / 2, PY + 240, W - 100);
    ctx.fillStyle = '#4b5878'; ctx.font = bodyFont(18);
    ctx.fillText(`${D.date}  ·  ${L(CONFIG.madeBy)}`, W / 2, H - 50, W - 100);
    ctx.textAlign = 'left';
  }

  // 화면에 인증서 그리기 (도장이 하나씩 쾅쾅 찍혀요)
  function paintCert(animate) {
    const cv = $('certCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const D = certData();
    const id = ++certAnim;
    const still = !animate || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (still) { drawCert(ctx, D, 1, certSel); return; }
    const t0 = performance.now(), dur = 2300;
    const tick = (now) => {
      if (id !== certAnim || !document.body.contains(cv)) return;
      const p = Math.min(1, (now - t0) / dur);
      drawCert(ctx, D, p, certSel);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setTimeout(() => { if (id === certAnim && document.body.contains(cv)) drawCert(ctx, D, 1, certSel); }, dur + 400); // 화면이 멈춰 있어도 끝 모습은 꼭 그리기
  }
  function certBlob() {
    return new Promise((res) => {
      const c = document.createElement('canvas');
      c.width = CERT_W; c.height = CERT_H;
      drawCert(c.getContext('2d'), certData(), 1, -1);
      c.toBlob(res, 'image/png');
    });
  }
  // 파일 이름도 '이름_학교_국적' — 패들렛에 올리면 이 이름이 그대로 보여요
  const certFileName = () => `${[player.realName, player.school, nationName(player)].map((x) => (x || '').trim()).filter(Boolean).join('_') || player.nick}_peace-map.png`
    .replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, '');
  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
  async function certFonts() {
    if (!document.fonts || !document.fonts.load) return;
    const text = [T('certTitle'), player.nick, player.pledge || '', player.realName || '', player.school || '', nationName(player), schoolEx(), T('certPledge'), T('finishQuote'), L(CONFIG.madeBy), T('certMyHero'), T('certNameLabel'),
      T('certStars'), T('certCards'), T('certGold'), T('certPieces'), T('certGoldStamp'), rankOf(starTotal(player)), T('seaW'), T('seaE'), T('line38'),
      ...allCards().map((c) => L(c.name) + L(c.role)), ...STATIONS.map((s) => L(s.name) + L(s.date)), '0123456789/,.—「」'].join('');
    const fonts = ['40px Jua', '800 40px "Baloo 2"', '600 40px "Baloo 2"', '700 40px "Baloo 2"', '400 20px "Noto Sans KR"', '700 20px "Noto Sans KR"'];
    try { await Promise.race([Promise.all(fonts.map((f) => document.fonts.load(f, text))), new Promise((r) => setTimeout(r, 3000))]); } catch (e) { /* 글꼴이 없으면 기본 글꼴로 */ }
  }

  // 국적: 고르기만 하면 돼서 모두 같은 모양으로 적혀요 (그 밖의 나라는 직접 쓰기)
  const NATIONS = [
    ['kr', { ko: '대한민국', es: 'Corea del Sur', en: 'Republic of Korea' }],
    ['co', { ko: '콜롬비아', es: 'Colombia', en: 'Colombia' }],
    ['other', { ko: '그 밖의 나라 (직접 쓰기)', es: 'Otro país (escríbelo)', en: 'Other country (type it)' }]
  ];
  const nationName = (p) => (p.nation === 'other' ? (p.nationOther || '').trim() : p.nation ? L(NATIONS.find((n) => n[0] === p.nation)[1]) : '');
  const certInfoOk = (p) => (p.realName || '').trim().length >= 2 && (p.school || '').trim().length >= 2 && nationName(p).length >= 2 && (p.pledge || '').trim().length >= 2;
  const SCHOOLS = CONFIG.schools || [];
  const schoolEx = () => (SCHOOLS.find((s) => s.lang === lang) || {}).name || ''; // 회색 예시 (없으면 일반 예시)
  // 패들렛 글 제목: 이름 / 학교 / 국적
  const certTitleLine = () => [player.realName, player.school, nationName(player)].map((x) => (x || '').trim()).join(' / ');

  function certHtml() {
    const owned = allCards().filter(hasCard);
    if (!player.myHero && owned.length) player.myHero = (owned.find(isGold) || owned[0]).id;
    // 한국어 화면이면 대한민국을 미리 골라 둬요. 스페인어·영어 화면은 누가 쓸지 몰라서 직접 고르거나,
    // 학교 버튼을 누르면 그 학교의 국적이 함께 채워져요.
    if (!player.nation && lang === 'ko') player.nation = 'kr';
    const canShare = !SANDBOX && !!(navigator.canShare && window.File); // 링크 모드에서는 공유 창이 막혀 있어요
    const canCopy = !!(navigator.clipboard && navigator.clipboard.write && window.ClipboardItem);
    const ex = schoolEx();
    return `<div class="cert-map">
        <h2 class="end-h2">🗺️ ${esc(T('certTitle'))}</h2>
        <p class="end-lead">${esc(T('certLead', player.nick))}</p>
        <div class="cert-form">
          <label for="certName" class="cert-step">① 🙋 ${esc(T('certRealName'))}</label>
          <input id="certName" type="text" maxlength="20" value="${esc(player.realName || '')}" placeholder="${esc(T('certRealNamePh'))}" autocomplete="off" spellcheck="false">
          <label for="certSchool" class="cert-step">② 🏫 ${esc(T('certSchool'))}</label>
          <div class="cert-school">
            <input id="certSchool" type="text" maxlength="60" value="${esc(player.school || '')}" placeholder="${esc(ex ? T('certExample', ex) : T('certSchoolPh'))}" autocomplete="off" spellcheck="false">
            ${SCHOOLS.map((sc, k) => `<button type="button" class="chip-fill" data-school="${k}">↳ ${esc(sc.name)}</button>`).join('')}
          </div>
          <label for="certNation" class="cert-step">③ 🌏 ${esc(T('certNation'))}</label>
          <div class="cert-nation">
            <select id="certNation">
              <option value=""${player.nation ? '' : ' selected'} disabled>${esc(T('certNationPick'))}</option>
              ${NATIONS.map(([id, name]) => `<option value="${id}"${player.nation === id ? ' selected' : ''}>${esc(L(name))}</option>`).join('')}
            </select>
            <input id="certNationOther" type="text" maxlength="20" value="${esc(player.nationOther || '')}" placeholder="${esc(T('certNationOtherPh'))}" autocomplete="off"${player.nation === 'other' ? '' : ' hidden'}>
          </div>
          <label for="certHero" class="cert-step">④ 🎴 ${esc(T('certMyHero'))}</label>
          <select id="certHero">${owned.map((c) => `<option value="${esc(c.id)}"${c.id === player.myHero ? ' selected' : ''}>${isGold(c) ? '✨ ' : ''}${esc(L(c.name))}</option>`).join('')}</select>
          <label for="certPledge" class="cert-step">⑤ 🕊️ ${esc(T('certPledge'))}</label>
          <input id="certPledge" type="text" maxlength="50" value="${esc(player.pledge || '')}" placeholder="${esc(T('certPledgePh'))}" autocomplete="off">
          <p class="cert-privacy">🔒 ${esc(T('certPrivacy'))}</p>
        </div>
        <div class="cert-stage">
          <canvas id="certCanvas" width="${CERT_W}" height="${CERT_H}" role="img" aria-label="${esc(T('certTitle'))}"></canvas>
          <p class="cert-tap" id="certInfo" aria-live="polite">👆 ${esc(T('certTap'))}</p>
        </div>
        <p class="cert-lock" id="certLock" role="status">✍️ ${esc(T('certNeedPledge'))}</p>
        <div class="cert-actions">
          <button id="certSave" class="btn btn-go cert-need" type="button">📸 ${esc(T('certSave'))}</button>
          ${canCopy ? `<button id="certCopy" class="btn btn-blue cert-need" type="button">📋 ${esc(T('certCopy'))}</button>` : ''}
          ${canShare ? `<button id="certShare" class="btn btn-ghost cert-need" type="button" hidden>📤 ${esc(T('certShare'))}</button>` : ''}
          ${CONFIG.padletUrl ? `<button id="certPadlet" class="btn btn-ghost cert-need" type="button">${esc(T('gbBoard'))}</button>` : ''}
        </div>
        <div class="cert-titleline">
          <span>${esc(T('certPadletTitle'))}</span>
          <b id="certTitleLine"></b>
          ${navigator.clipboard ? `<button type="button" class="btn btn-sm btn-ghost cert-need" id="certTitleCopy">📋 ${esc(T('certTitleCopy'))}</button>` : ''}
        </div>
        <p class="t-help">${esc(T('certHow'))}</p>
      </div>`;
  }
  function bindCert() {
    const cv = $('certCanvas');
    certSel = -1;
    certFonts().then(() => paintCert(true));
    // 지도 위 도장 누르기
    cv.addEventListener('click', (e) => {
      const r = cv.getBoundingClientRect();
      const x = (e.clientX - r.left) * (CERT_W / r.width), y = (e.clientY - r.top) * (CERT_H / r.height);
      let best = -1, bd = 34;
      STATIONS.forEach((s, i) => { const [sx, sy] = certXY(s.map.x, s.map.y); const d = Math.hypot(sx - x, sy - y); if (d < bd) { bd = d; best = i; } });
      certSel = best === certSel ? -1 : best;
      const s = STATIONS[certSel];
      $('certInfo').textContent = s ? `${certSel + 1}. ${L(s.name)} · ${L(s.date)}${certData().perfect[certSel] ? ` · ✨ ${T('certPerfect')}` : ''}` : `👆 ${T('certTap')}`;
      paintCert(false);
    });
    // 이름·학교·국적·평화 다짐을 모두 적어야 저장·복사 버튼이 열려요 (다짐 = 여정의 마지막 한 걸음)
    const read = () => {
      player.realName = $('certName').value.slice(0, 20);
      player.school = $('certSchool').value.slice(0, 60);
      player.nation = $('certNation').value;
      player.nationOther = $('certNationOther').value.slice(0, 20);
      player.pledge = $('certPledge').value.slice(0, 50);
    };
    const lockCert = () => {
      read();
      // 🧹 인증서는 패들렛에 올라가요: 욕설·비하·ㅋㅋ 같은 말이 있으면 저장이 잠겨요
      const bad = ['certName', 'certSchool', 'certNationOther', 'certPledge'].map((id) => [id, textProblem($(id).value)]).filter(([, p]) => p);
      ['certName', 'certSchool', 'certNationOther', 'certPledge'].forEach((id) => $(id).classList.toggle('is-error', bad.some(([b]) => b === id)));
      const ok = certInfoOk(player) && !bad.length;
      document.querySelectorAll('.cert-need').forEach((b) => { b.disabled = !ok; });
      $('certLock').hidden = ok;
      $('certLock').textContent = `✍️ ${bad.length ? bad[0][1] : T('certNeedPledge')}`;
      $('certNationOther').hidden = player.nation !== 'other';
      $('certTitleLine').textContent = certTitleLine();
      // 아직 안 적은 칸을 알려 줘요
      const miss = [['certName', player.realName], ['certSchool', player.school], ['certNation', nationName(player)], ['certPledge', player.pledge]]
        .filter(([, v]) => (v || '').trim().length < 2).map(([id]) => id);
      ['certName', 'certSchool', 'certNation', 'certPledge'].forEach((id) => $(id).classList.toggle('need', miss.includes(id)));
    };
    lockCert();
    const first = ['certName', 'certSchool', 'certPledge'].find((id) => !$(id).value.trim());
    if (first) setTimeout(() => { if ($(first)) $(first).focus({ preventScroll: true }); }, 300); // (그새 다음 화면으로 넘어갔으면 건너뛰기)
    let typing;
    const onEdit = () => {
      lockCert();
      clearTimeout(typing);
      typing = setTimeout(() => { save(); paintCert(false); }, 150);
    };
    ['certName', 'certSchool', 'certNationOther', 'certPledge'].forEach((id) => $(id).addEventListener('input', onEdit));
    $('certNation').addEventListener('change', () => { onEdit(); if (player.nation === 'other') $('certNationOther').focus(); });
    // 학교 버튼: 학교 이름 + 그 학교의 국적을 함께 채워요
    document.querySelectorAll('.chip-fill[data-school]').forEach((b) => b.addEventListener('click', () => {
      const sc = SCHOOLS[+b.dataset.school];
      $('certSchool').value = sc.name;
      if (sc.nation) $('certNation').value = sc.nation;
      onEdit();
    }));
    $('certHero').addEventListener('change', () => { player.myHero = $('certHero').value; save(); paintCert(false); });
    const flush = () => { clearTimeout(typing); read(); save(); };
    if ($('certTitleCopy')) $('certTitleCopy').addEventListener('click', () => {
      navigator.clipboard.writeText(certTitleLine()).then(() => toast(T('certTitleCopied')), () => toast(T('copyFail')));
    });
    // 링크 모드: 저장 확인 창(downloads)으로 받고, 안 되면 그림을 크게 띄워 길게 눌러 저장하게
    const showCertImage = (blob) => {
      const url = URL.createObjectURL(blob);
      openInfo('📸', T('certTitle'), `<p class="t-help">${esc(T('certLongPress'))}</p>
        <img class="cert-full" src="${url}" alt="${esc(T('certTitle'))}">`);
    };
    $('certSave').addEventListener('click', async () => {
      flush();
      const blob = await certBlob();
      if (!blob) { toast(T('copyFail')); return; }
      if (SANDBOX) {
        const dl = window.claude && window.claude.use ? await window.claude.use('downloads').catch(() => null) : null;
        if (dl) {
          try { await dl.save({ filename: certFileName(), data: blob }); toast(T('certSaved')); reportProgress('certificate'); return; }
          catch (e) { if (e && e.code === 'declined') return; }
        }
        showCertImage(blob);
        return;
      }
      downloadBlob(blob, certFileName());
      toast(T('certSaved'));
      reportProgress('certificate');
      // 휴대폰·태블릿: 사진 앱에 저장하거나 패들렛 앱으로 바로 보낼 수 있게
      const file = new File([blob], certFileName(), { type: 'image/png' });
      if ($('certShare') && navigator.canShare({ files: [file] })) $('certShare').hidden = false;
    });
    if ($('certShare')) {
      // 공유할 수 있는 기기면 처음부터 보여 줘요
      certBlob().then((blob) => { if (blob && navigator.canShare({ files: [new File([blob], certFileName(), { type: 'image/png' })] })) $('certShare').hidden = false; });
      $('certShare').addEventListener('click', async () => {
        flush();
        const blob = await certBlob();
        try { await navigator.share({ files: [new File([blob], certFileName(), { type: 'image/png' })], title: T('certTitle') }); } catch (e) { /* 취소 */ }
      });
    }
    const copyImg = async () => {
      flush();
      try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': certBlob() })]); return true; } catch (e) { return false; }
    };
    if ($('certCopy')) $('certCopy').addEventListener('click', async () => {
      if (await copyImg()) { toast(T('certCopied')); return; }
      // 그림 복사가 막힌 곳(링크 모드 등)이면 그림을 띄워서 길게 눌러 복사·저장하게
      if (SANDBOX) showCertImage(await certBlob()); else toast(T('copyFail'));
    });
    if ($('certPadlet')) $('certPadlet').addEventListener('click', () => {
      const copying = $('certCopy') ? copyImg() : Promise.resolve(false);
      openPadlet();
      copying.then((ok) => toast(ok ? T('certCopied') : T('certPadletHint')));
    });
  }

  function renderEnding() {
    const step = END_STEPS[endStep];
    const body = $('endingBody');
    const quizTotal = STATIONS.filter((s) => s.quiz).length;
    const quizRight = STATIONS.filter((s) => s.quiz && player.quiz[s.id] !== undefined && String(player.quiz[s.id]) === String(s.quiz.answer)).length;
    const guessCount = QIDS.filter((q) => player.answers[q] && player.answers[q].text).length;
    let html = '';

    if (step === 'intro') {
      html = `<div class="end-hero">
        <span class="end-flags" aria-hidden="true"><i class="f-y"></i><i class="f-b"></i><i class="f-r"></i></span>
        <h1>${esc(T('endTitle'))}</h1>
        <p class="end-lead">${esc(T('endLead'))}</p>
        <div class="facts"><span>✓ ${esc(T('endStatQuiz', quizRight, quizTotal))}</span><span>✎ ${esc(T('endStatGuess', guessCount, QIDS.length))}</span></div>
        <p class="t-help">⏱ ${esc(T('endTip'))}</p>
      </div>`;
    } else if (QUESTIONS[step]) {
      const q = QUESTIONS[step];
      const n = QIDS.indexOf(step) + 1;
      const mine = player.answers[step] && player.answers[step].text;
      const vi = Math.min(endVet[step] || 0, q.answers.length - 1);
      const a = q.answers[vi];
      const vet = window.VETERANS[a.veteran] || { name: a.veteran, role: '' };
      const react = (player.reacts || {})[step];
      html = `<header class="end-q-head">
          <span class="eyebrow">${esc(T('qLabel', n, QIDS.length))}</span>
          <h2>“${esc(L(q.text))}”</h2>
          <div class="q-from">✉️ ${esc(T('askedBy', maskName(q.asker, q.askerRoman)))}</div>
        </header>
        <div class="compare">
          <section class="cmp cmp-mine">
            <h3>✎ ${esc(T('myGuessTitle'))}</h3>
            ${mine
              ? `<p class="mine-text">${esc(mine)}</p><p class="mine-by">— ${esc(player.nick)}</p>`
              : `<p class="t-help">${esc(T('noGuessYet'))}</p>
                 <textarea id="endGuess" class="guess" rows="3" maxlength="400" placeholder="${esc(T('guessPh'))}"></textarea>
                 <button id="endSave" class="btn btn-blue btn-sm" type="button">${esc(T('saveHere'))}</button>`}
          </section>
          <section class="cmp cmp-real">
            <h3>🎖️ ${esc(T('realTitle'))}</h3>
            ${q.answers.length > 1 ? `<div class="vet-tabs" role="tablist">${q.answers.map((x, k) => {
              const v = window.VETERANS[x.veteran];
              return `<button type="button" role="tab" aria-selected="${k === vi}" data-k="${k}">${esc(v ? L(v.name) : x.veteran)}</button>`;
            }).join('')}</div>` : ''}
            <div class="vet-line"><b>${esc(L(vet.name))}</b> <span>${esc(L(vet.role))}</span></div>
            ${videoHtml(a.video)}
            <div class="summary">
              <span class="summary-label">${esc(T('summaryLabel'))}</span>
              <p>${esc(L(a.summary))}</p>
              <small>${esc(T('summaryNote'))}</small>
            </div>
          </section>
        </div>
        <div class="reacts">
          <span>${esc(T('reactQ'))}</span>
          ${T('reacts').map(([k, label]) => `<button type="button" data-r="${k}" aria-pressed="${react === k}">${esc(label)}</button>`).join('')}
        </div>`;
    } else if (step === 'more') {
      html = `<h2 class="end-h2">${esc(T('moreTitle'))}</h2>
        <p class="end-lead">${esc(T('moreLead'))}</p>
        <div class="link-cards">${(window.LINKS || []).map((l) => `
          <a class="link-card" href="${esc(l.url)}" target="_blank" rel="noopener">
            <b>${esc(L(l.name))} ↗</b><span>${esc(L(l.desc))}</span>
          </a>`).join('')}</div>
        ${longVideos().length ? `<h3 class="end-h3">🎬 ${esc(T('longTitle'))}</h3>
          <ul class="works">${longVideos().map((v) => `<li><a href="https://www.youtube.com/watch?v=${esc(v.yt)}" target="_blank" rel="noopener">${esc(L(v.title))} ↗</a> <small>${esc(v.len || '')}</small></li>`).join('')}</ul>` : ''}
        ${(window.GROUP_WORKS || []).length ? `<h3 class="end-h3">${esc(T('worksTitle'))}</h3>
          <ul class="works">${window.GROUP_WORKS.map((w) => `<li><a href="${esc(w.url)}" target="_blank" rel="noopener">${esc(L(w.name))} ↗</a></li>`).join('')}</ul>` : ''}
        ${CONFIG.padletUrl ? `<a class="btn btn-ghost" href="${esc(CONFIG.padletUrl)}" target="_blank" rel="noopener">${esc(T('padletTitle'))} ↗</a>` : ''}`;
    } else if (step === 'finish') {
      html = certHtml();
    } else if (step === 'survey') {
      // 📝 마지막 한 걸음: 게임 안에서 바로 쓰는 소감 설문 (화면 언어에 맞는 설문지)
      const fb = (CONFIG.feedbackForms || {})[lang] || (CONFIG.feedbackForms || {}).ko;
      html = `<div class="survey">
          <h2 class="end-h2">📝 ${esc(T('surveyTitle'))}</h2>
          <p class="end-lead">${esc(T('surveyLead'))}</p>
          ${SANDBOX
            ? `<a class="btn btn-go feedback-btn" href="${esc(fb)}" target="_blank" rel="noopener">📝 ${esc(T('feedbackBtn'))} ↗</a>`
            : `<div class="survey-frame"><iframe src="${esc(fb)}?embedded=true" title="${esc(T('surveyTitle'))}" loading="lazy">…</iframe></div>
               <p class="t-help">${esc(T('surveyHelp'))} <a href="${esc(fb)}" target="_blank" rel="noopener">${esc(T('surveyOpen'))} ↗</a></p>`}
          <p class="survey-thanks">🕊️ ${esc(T('surveyThanks'))}</p>
        </div>
        <div class="t-buttons end-buttons">
          ${previewMode ? '' : `<button id="endCode" class="btn btn-blue" type="button">${esc(T('showCodeBtn'))}</button>`}
          <button id="endMap" class="btn btn-ghost" type="button">${esc(T('toMapBtn'))}</button>
          <button id="endHome" class="btn btn-ghost" type="button">${esc(T('toStartBtn'))}</button>
        </div>`;
    }

    body.innerHTML = html;
    $('endingScreen').querySelector('.ending-scroll').scrollTop = 0;

    // 답장을 보내 준 참전용사 카드
    if (QUESTIONS[step]) QUESTIONS[step].answers.forEach((x) => { if (VET_CARD[x.veteran]) unlockCard(VET_CARD[x.veteran]); });

    // 버튼 연결
    body.querySelectorAll('.vet-tabs button').forEach((b) => b.addEventListener('click', () => { saveEndGuess(); endVet[step] = +b.dataset.k; renderEnding(); }));
    body.querySelectorAll('.reacts button').forEach((b) => b.addEventListener('click', () => {
      player.reacts = player.reacts || {};
      player.reacts[step] = b.dataset.r;
      save();
      body.querySelectorAll('.reacts button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }));
    if ($('endSave')) $('endSave').addEventListener('click', () => { if (saveEndGuess()) { toast(T('saved')); renderEnding(); } else $('endGuess').focus(); });
    if ($('certCanvas')) bindCert();
    if ($('endCode')) $('endCode').addEventListener('click', showCode);
    if ($('endMap')) $('endMap').addEventListener('click', () => (previewMode ? showTeacher() : enterGame()));
    if ($('endHome')) $('endHome').addEventListener('click', () => (previewMode ? showTeacher() : showStart()));

    $('endDots').innerHTML = END_STEPS.map((x, k) => `<i class="${k === endStep ? 'on' : ''}${QUESTIONS[x] ? ' q' : ''}"></i>`).join('');
    $('endPrev').textContent = endStep === 0 ? T('toMapBtn') : T('prev');
    $('endNext').textContent = step === 'intro' ? T('endStart') : step === 'finish' ? T('surveyNext') : T('next');
    $('endNext').hidden = endStep === END_STEPS.length - 1; // 맨 마지막 화면에서는 [다음]이 없어요
  }

  $('endNext').addEventListener('click', () => {
    saveEndGuess();
    if (endStep < END_STEPS.length - 1) { endStep++; renderEnding(); }
  });
  $('endPrev').addEventListener('click', () => {
    saveEndGuess();
    if (endStep === 0) { previewMode ? showTeacher() : enterGame(); return; }
    endStep--; renderEnding();
  });

  /* =====================================================================
     선생님 화면
     ===================================================================== */
  function loadRoster() { try { return JSON.parse(localStorage.getItem(ROSTER_KEY)) || []; } catch (e) { return []; } }
  function saveRoster(r) { try { localStorage.setItem(ROSTER_KEY, JSON.stringify(r)); } catch (e) { /* 무시 */ } }

  function rosterRows() {
    return loadRoster().map((r, idx) => {
      const p = parseCode(r.code);
      if (!p) return null;
      const answered = p.quiz.filter((x) => x).length;
      const right = p.quiz.filter((x) => x === 1).length;
      const marks = p.quiz.map((x, i) => (STATIONS[i].quiz ? (x === 1 ? 'O' : x === 2 ? 'X' : '-') : ' ')).join('');
      return { ...r, idx, k: p.k, right, answered, marks };
    }).filter(Boolean);
  }

  function renderRoster() {
    const rows = rosterRows();
    const H = T('rosterHead');
    $('rosterTable').innerHTML = rows.length ? `
      <table class="roster">
        <thead><tr>${H.map((h) => `<th>${esc(h)}</th>`).join('')}<th></th></tr></thead>
        <tbody>${rows.map((r, i) => `<tr>
          <td>${esc(r.nick || '—')}</td><td class="num">${r.k} / ${N}</td><td class="num">${r.right} / ${r.answered}</td>
          <td class="marks">${esc(r.marks)}</td><td class="mono">${esc(r.code)}</td><td>${esc(fmtDate(r.added))}</td>
          <td><button class="btn btn-ghost btn-sm" type="button" data-i="${r.idx}">${esc(T('del'))}</button></td></tr>`).join('')}
        </tbody></table>` : `<p class="t-help">${esc(T('rosterEmpty'))}</p>`;
    $('rosterTable').querySelectorAll('button[data-i]').forEach((b) => b.addEventListener('click', () => {
      const r = loadRoster(); r.splice(+b.dataset.i, 1); saveRoster(r); renderRoster();
    }));
  }

  function showTeacher() {
    previewMode = false;
    player = null;
    resetStationUI();
    showScreen('teacherScreen');
    applyStaticText();
    renderRoster();
    $('rosterNick').placeholder = T('rosterNickOpt');
    $('rosterCode').placeholder = T('rosterCodePh');
    $('savedCount').textContent = T('savedCount', Object.keys(store.games).length);
    $('confirmBox').hidden = true;
    $('previewList').innerHTML = STATIONS.map((s, i) => `<button class="btn btn-ghost btn-sm" type="button" data-i="${i}">${i + 1}. ${esc(L(s.name))}</button>`).join('')
      + `<button class="btn btn-go btn-sm" type="button" data-i="ending">${esc(T('endingPreview'))}</button>`;
    $('previewList').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => startPreview(b.dataset.i)));
  }

  function startPreview(i) {
    previewMode = true;
    player = { id: '__preview', nick: 'preview', done: [], quiz: {}, answers: {}, reacts: {} };
    if (i === 'ending') { openEnding(); return; }
    enterGame();
    openStation(+i);
  }

  $('rosterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // 닉네임은 적어도 되고 안 적어도 돼요. 코드는 여러 개를 한꺼번에 붙여 넣어도 돼요 (띄어쓰기·줄바꿈·쉼표로 구분)
    const nick = $('rosterNick').value.trim();
    // 코드 글자(2-9, I·O 뺀 A-Z) 3+3개 묶음을 모두 찾아요 — 줄바꿈이 사라진 채 붙여 넣어져도 괜찮게
    const tokens = ($('rosterCode').value.toUpperCase().match(/[2-9A-HJ-NP-Z]{3}-?[2-9A-HJ-NP-Z]{3}/g) || []).map((t) => t.replace(/-/g, ''));
    const good = tokens.filter((t) => parseCode(t));
    const bad = tokens.filter((t) => !parseCode(t));
    if (!good.length) { $('rosterError').textContent = T('badCode'); return; }
    const r = loadRoster();
    good.forEach((clean) => r.push({ nick: good.length === 1 ? nick : '', code: clean.slice(0, 3) + '-' + clean.slice(3), added: Date.now() }));
    saveRoster(r);
    $('rosterError').textContent = bad.length ? T('rosterBad', bad.join(', ')) : '';
    toast(T('rosterAdded', good.length));
    $('rosterNick').value = ''; $('rosterCode').value = '';
    $('rosterNick').focus();
    renderRoster();
  });

  $('rosterCopy').addEventListener('click', async () => {
    const rows = rosterRows();
    const H = T('rosterHead');
    const tsv = [['#', ...H].join('\t'), ...rows.map((r, i) => [i + 1, r.nick, `${r.k}/${N}`, `${r.right}/${r.answered}`, r.marks, r.code, new Date(r.added).toLocaleString()].join('\t'))].join('\n');
    toast((await copyText(tsv)) ? T('rosterCopied') : T('copyFail'));
  });

  function askConfirm(question, onYes) {
    const box = $('confirmBox');
    box.innerHTML = `<p>${esc(question)}</p><div class="t-buttons"><button class="btn btn-ghost" type="button" id="cfNo">${esc(T('cancel'))}</button><button class="btn btn-danger" type="button" id="cfYes">${esc(T('yesDelete'))}</button></div>`;
    box.hidden = false;
    box.scrollIntoView({ block: 'nearest' });
    $('cfNo').addEventListener('click', () => { box.hidden = true; });
    $('cfYes').addEventListener('click', () => { box.hidden = true; onYes(); });
  }

  $('rosterClear').addEventListener('click', () => askConfirm(T('rosterClearQ'), () => { saveRoster([]); renderRoster(); }));
  $('clearDevice').addEventListener('click', () => askConfirm(T('clearQ'), () => {
    store.games = {}; save(); toast(T('cleared')); showTeacher();
  }));

  function allGuestbookText() {
    return Object.keys(QUESTIONS).map((qid) => {
      const list = allAnswers(qid);
      return `Q. ${L(QUESTIONS[qid].text)}\n` + (list.length ? list.map((a) => `- ${a.nick}: ${a.text}`).join('\n') : '-');
    }).join('\n\n');
  }
  $('gbOpenT').addEventListener('click', () => openGuestbook(true));
  $('gbCopyAll').addEventListener('click', async () => toast((await copyText(allGuestbookText())) ? T('copied') : T('copyFail')));
  $('gbDownload').addEventListener('click', () => {
    const blob = new Blob(['﻿' + allGuestbookText()], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `MAP_방명록_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $('pwNew').addEventListener('input', () => {
    const v = $('pwNew').value.trim();
    $('pwHashOut').textContent = v ? T('pwHashOut', teacherHash(v)) : '';
  });
  $('teacherBack').addEventListener('click', showStart);

  /* ---------------- 시작 ---------------- */
  // 영웅 카드 사진을 미리 받아 두기 (카드를 얻는 순간 사진이 바로 보이도록)
  (window.HERO_CARDS || []).forEach((c) => { if (c.img) { const im = new Image(); im.referrerPolicy = 'no-referrer'; im.src = c.img; } });
  applyStaticText();
  showStart();
})();
