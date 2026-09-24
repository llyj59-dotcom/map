/* 🧹 바른말 거르개 — 닉네임·인증서·방명록에 욕설·비하·장난스러운 말이 들어가지 않게
   참전용사를 기억하는 게임이라, 닉네임을 대충 짓거나 장난스럽게 짓는 것도 막아요.
   ★ 막을 말을 더 넣으려면 아래 목록에 따옴표로 추가하세요. (띄어쓰기·특수문자·숫자 섞기는 자동으로 걸러요: '시 발', 'sh1t' …)

   check(text, 'nick') → 닉네임 규칙 전부  |  check(text, 'text') → 문장(다짐·이름·학교·방명록)용: 욕설·비하·장난 표현만
   돌려주는 값: '' (괜찮아요) 또는 이유 — 'short' · 'chars' · 'jamo' · 'repeat' · 'bad' */
window.WordFilter = (function () {
  // 어디에 끼어 있어도 막는 말 (한국어)
  const KO = [
    '시발', '씨발', '씨빨', '씨바', '시바', '쉬발', '쉬바', '시팔', '씨팔', '십팔', '씹', '싀발', '시벌', '씨벌',
    '병신', '븅신', '빙신', '병싄', '좆', '존나', '졸라', '존내', '좃', '개새', '개색', '개세끼', '개시키', '개같', '개소리', '개빡',
    '새끼', '섀끼', '색히', '색기', '믜친', '닥쳐', '꺼져', '지랄', '찌랄', '엿먹', '엠창', '느금', '느개비',
    '니애미', '니애비', '니미', '애미', '애비', '패드립', '찐따', '애자', '병맛', '등신', '멍청', '바보', '호구', '돼지', '뚱땡', '못생',
    '한남', '한녀', '김치녀', '된장녀', '맘충', '급식충', '한남충', '틀딱', '짱깨', '쪽바리', '깜둥', '흑형', '일베', '운지',
    '똥', '오줌', '방귀', '방구', '섹스', '섹시', '야동', '변태', '자위', '빠구리',
    '나치', '히틀러'
  ];
  // 닉네임에서만 막는 말 — 문장에서는 멀쩡한 말에 섞여 나올 수 있어서 (예: 기억하'고자', 영향을 '미친', 지켜'보지', 전쟁 이야기의 '죽음')
  const KO_NICK = ['미친', '미췬', '고자', '보지', '자지', '성기',
    '죽어', '죽일', '죽여', '뒤져', '디져', '뒈져', '자살', '살인', '테러', '학살', '전쟁광', '총살', '폭탄'];

  // 어디에 끼어 있어도 막는 말 (영어·스페인어, 악센트는 떼고 비교)
  const LATIN = [
    'fuck', 'fuk', 'fck', 'phuck', 'shit', 'bitch', 'btch', 'bastard', 'dick', 'pussy', 'cunt', 'porn', 'sexy', 'nude', 'boob',
    'penis', 'vagina', 'whore', 'slut', 'nigg', 'retard', 'faggot', 'idiot', 'stupid', 'dumb', 'moron', 'hitler', 'wtf', 'stfu',
    'mierda', 'idiota', 'pendej', 'cabron', 'carajo', 'verga', 'marica', 'estupid', 'imbecil', 'joder',
    'gonorrea', 'malparid', 'hijueput', 'huevon', 'guevon', 'zorra', 'mamon', 'chimba', 'tonto', 'tonta', 'bobo', 'boba'
  ];
  // 닉네임에서는 어디에 있어도, 문장에서는 낱말로 딱 떨어질 때만 막는 말
  //   (문장 속 멀쩡한 말: 'disputa'·'computadora'(puta), 'vínculo'·'película'(culo), 'grape'(rape), 'closer'(loser), 'Mongolia'(mongol))
  const LATIN_SOFT = ['puta', 'puto', 'culo', 'perra', 'rape', 'loser', 'mongol', 'nazi'];
  // 낱말 하나로 딱 떨어질 때만 막는 짧은 말 (class, skill 같은 말이 걸리지 않게)
  const LATIN_WORD = ['ass', 'gay', 'hoe', 'hp', 'sex', 'poop', 'pee', 'fat', 'ugly', 'hate', 'cono', 'marico', 'kkk'];
  // 낱말이 이렇게 시작하면 막아요 (peacock·skill 은 괜찮게, killer 는 막게)
  const PREFIX = ['cock'];
  // 닉네임에서만: 이렇게 시작하는 낱말 / 딱 이 낱말 ('negro'는 스페인어로 '검은색'이라 문장에서는 허용, 'die'는 Diego가 걸리지 않게 낱말로만)
  const NICK_PREFIX = ['kill', 'murder', 'suicid', 'bomb', 'matar', 'muert', 'muere', 'negro'];
  const NICK_WORD = ['die', 'dead', 'death'];
  // 장난스러운 웃음·유행어 (닉네임)
  const LAUGH = ['lol', 'lmao', 'lmfao', 'rofl', 'xd', 'jaja', 'jeje', 'jiji', 'haha', 'hehe', 'hihi', 'kkk', 'kek', 'omg',
    '크크', '킄', '킥킥', '헤헤', '히히', '하하', '호호', '후후', '흐흐', '낄낄', '깔깔', 'ㅋ', 'ㅎ'];
  // 욕을 뜻하는 숫자 (18 = 욕, 69 = 성적인 뜻)
  const BAD_NUM = /18|69|444/;
  // 손가락 욕 등 모양 글자
  const GESTURE = /[ㅗ凸🖕]/u;

  const LEET = { 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', '@': 'a', $: 's' };
  const deaccent = (s) => s.replace(/[À-ɏ]/g, (c) => c.normalize('NFD')[0]); // 한글은 그대로 두고 라틴 악센트만
  const hasAny = (s, list) => list.some((w) => w && s.includes(w));

  function forms(text) {
    const low = deaccent(String(text).normalize('NFKC').toLowerCase());
    const compact = low.replace(/[\s._\-·~,!?'"()[\]{}<>*^+=/\\|:;]+/g, '');   // 띄어쓰기·기호 빼기: '시 발' → '시발'
    const noDigit = compact.replace(/[0-9]/g, '');                               // '시1발' → '시발'
    const leet = compact.replace(/[0-9@$]/g, (c) => LEET[c] || '');               // 'sh1t' → 'shit'
    const words = low.split(/[^a-z가-힣]+/).filter(Boolean);            // 낱말 단위 (짧은 영어 욕)
    return { low, compact, noDigit, leet, words };
  }

  function isBad(text, nickMode) {
    const f = forms(text);
    const ko = nickMode ? KO.concat(KO_NICK) : KO;
    const latin = nickMode ? LATIN.concat(LATIN_SOFT) : LATIN;
    if (GESTURE.test(text)) return true;
    if ([f.compact, f.noDigit].some((s) => hasAny(s, ko))) return true;
    if ([f.compact, f.noDigit, f.leet].some((s) => hasAny(s, latin))) return true;
    const wordBad = (w) => LATIN_WORD.includes(w) || LATIN_SOFT.includes(w) || PREFIX.some((p) => w.startsWith(p))
      || (nickMode && (NICK_WORD.includes(w) || NICK_PREFIX.some((p) => w.startsWith(p))));
    if (f.words.some(wordBad)) return true;
    if (nickMode && wordBad(f.leet)) return true;
    return false;
  }

  function check(text, mode) {
    const t = String(text || '').trim();
    if (!t) return '';
    const nick = mode === 'nick';
    if (nick) {
      // 글자(한글·라틴 문자)와 숫자, 띄어쓰기·점·밑줄·하이픈만 — 이모지·특수문자 안 돼요
      if (!/^[\p{Script=Hangul}\p{Script=Latin}0-9 ._-]+$/u.test(t)) return GESTURE.test(t) ? 'bad' : 'chars';
      // 자음·모음만 따로 (ㅋ, ㅎ, ㅗ, ㅅㅂ …)
      if (/[ㄱ-ㆎᄀ-ᇿ]/.test(t)) return GESTURE.test(t) ? 'bad' : 'jamo';
      const letters = t.replace(/[^\p{L}]/gu, '');
      if (Array.from(letters).length < 2) return 'short';
      if (isBad(t, true) || BAD_NUM.test(t.replace(/\s/g, ''))) return 'bad';
      const c = forms(t).compact;
      // 같은 글자 3번 이상 (ㅋㅋㅋ, 하하하, aaa, 111) · 두 글자 묶음 3번 이상 (jajaja, 크크크크)
      if (/(.)\1\1/u.test(c) || /(..)\1\1/u.test(c)) return 'repeat';
      if (hasAny(c, LAUGH)) return 'repeat';
      return '';
    }
    // 문장: 욕설·비하·손가락 욕, 그리고 ㅋㅋ·ㅎㅎ 같은 장난 표현
    if (isBad(t, false)) return 'bad';
    if (/[ㅋㅎ]{2,}|[ㅠㅜ]{3,}/.test(t)) return 'repeat';
    return '';
  }

  return { check };
})();
