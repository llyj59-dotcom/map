/* =====================================================================
   M.A.P. to Tomorrow — 콘텐츠 데이터 (선생님이 고치는 파일은 여기 하나!)
   ---------------------------------------------------------------------
   · 모든 글은 { ko: '한국어', es: 'Español' } 형태로 씁니다.
     스페인어를 아직 못 채웠으면 es를 비워 두세요 → 한국어가 대신 나옵니다.
   · ★TODO 표시 = 선생님이 사실 확인 / 실제 자료로 바꿔 넣을 곳
   · 작전 지점 순서 = STATIONS 배열 순서 (위에서 아래로 여행)
   ===================================================================== */

window.MAP_CONFIG = {
  // 만든 곳 (엔딩·교사 화면 아래쪽에 작게 표시)
  madeBy: { ko: '인천신검단초등학교 6학년 · 국가보훈부 유엔참전국 글로벌 아카데미', es: 'Escuela Primaria Singeomdan, 6.º grado (Incheon, Corea) · Academia Global de Países Aliados de la ONU' },

  // 서버·로그인 없음. 모든 기록은 그 기기(브라우저)에만 저장되고, 인터넷으로 보내지 않아요.
  //  · 다른 기기에서 이어 할 때 / 선생님께 결과를 알릴 때 → 게임 속 "나의 여정 코드" 6글자
  //  · 예상 답변 글 → 같은 기기의 방명록에 쌓이고, 패들렛을 연결하면 게임 안에서 바로 패들렛에 붙여 넣기

  // ★ 우리 반 패들렛 주소 — 넣으면 [방명록] 버튼이 패들렛을 새 창(팝업)으로 열어요
  //   예: 'https://padlet.com/선생님아이디/map-to-tomorrow-abc123xyz'
  //   패들렛 설정: 공유 → "링크가 있는 사람" + "작성 가능"으로 해야 학생이 로그인 없이 올릴 수 있어요.
  padletUrl: 'https://padlet.com/llyj591/m-a-p-to-tomorrow-wall-of-memory-muro-de-la-memoria-s023v76jfwfwi72kttr8', // Wall of Memory · Muro de la memoria

  // 🏫 인증서 학교 칸 아래의 [↳ 학교 이름] 버튼 — 누르면 학교 이름과 국적이 한 번에 채워져요.
  //   어느 언어 화면에서든 두 학교가 모두 보여요 (스페인어 화면을 한국 친구가 쓸 수도 있으니까요).
  //   회색 예시 글씨는 화면 언어에 맞는 학교로 (한국어 → 신검단초, 스페인어 → 파트너교)
  schools: [
    { name: '인천신검단초등학교', nation: 'kr', lang: 'ko' },
    // 콜롬비아 발레두파르(Valledupar) 파트너교 — 계획서 영문 이름: La Esperanza Technical Educational Institution
    { name: 'Institución Educativa Técnica La Esperanza', nation: 'co', lang: 'es' }
  ],

  // 1차시를 끝낼 작전 지점 id — 이 작전 지점을 통과하면 "1차시는 여기까지!"와 코드를 크게 보여 줘요 ('' = 안 나눔)
  lessonBreakAfter: 'hill400',

  // 📡 진행 상황 자동 모으기 (선택) — 선생님의 구글 설문지로 조용히 보내요. Apps Script·서버 없이 설문지 응답(시트)으로 쌓여요.
  //   보내는 것: 닉네임 · 여정 코드 · 진행(몇 곳) · 별 · 카드 · 언어 · 어떤 순간인지(시작/작전 지점 통과/문 열기/인증서)
  //   보내지 않는 것: 본명·학교(인증서 칸), 방명록 글
  //   action: 설문지의 formResponse 주소, entries: 질문마다의 entry 번호 ('' 이면 꺼져 있어요)
  //   설문지: "M.A.P. to Tomorrow 진행 기록 (자동)" — 학교 구글 드라이브 (dolce52@icedu.kr), 응답자: 링크가 있는 모든 사용자
  //   ⚠️ 설문지의 질문을 지우거나 순서·종류를 바꾸면 연결이 끊길 수 있어요 (질문 이름만 바꾸는 건 괜찮아요)
  progressForm: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSepivn5rQ-lAAmALK-2oXQQ8gscaWRFJLgltkVhg_ZT9Nhizw/formResponse',
    entries: {
      nick: 'entry.37173682', code: 'entry.1222906636', progress: 'entry.1293781880', stars: 'entry.2135368922',
      cards: 'entry.1374160699', lang: 'entry.460236806', event: 'entry.593056163'
    }
  },

  // 📝 게임 소감 설문 (언어별) — 엔딩 마지막 화면의 [게임 소감 남기기] 버튼이 화면 언어에 맞는 설문을 열어요
  feedbackForms: {
    ko: 'https://docs.google.com/forms/d/e/1FAIpQLScCn_sulfl4RpF0Q3FHluMYmq5Gab0CGvcW5hjX5C0NfOUvEQ/viewform',
    en: 'https://docs.google.com/forms/d/e/1FAIpQLSdqDC0clEXVFKRTzcbqUS0cxCewVMQEgS3aq0Udo6qswe2xfA/viewform',
    es: 'https://docs.google.com/forms/d/e/1FAIpQLScPZ09qMAHcjEiXKQFLLnveEv2gU9XqydKjwN1P38KL5w7Fzg/viewform'
  },

  // 🎬 꼭 볼 영상: true면 작전 지점마다 표시된 짧은 영상(req) 하나를 끝까지 봐야 [다음]으로 넘어가요.
  //   빨리 감기로 건너뛰면 본 시간에 들어가지 않아요. 유튜브가 막힌 곳에서는 자동으로 건너뛰어요.
  //   선생님이 큰 화면으로 같이 볼 때는 false로 바꾸세요.
  requireVideos: true,

  // 선생님 모드 비밀번호를 뒤섞은 값 (지금 비밀번호: admin)
  // 바꾸려면: 선생님 모드 → 맨 아래 "비밀번호 바꾸기 값 만들기"에서 새 값을 만들어 여기에 붙여 넣으세요.
  teacherPasswordHash: '845wqw',

  nicknameMaxLength: 8,
  // 닉네임에 들어가면 시작할 수 없는 말 (필요하면 더 추가)
  bannedWords: ['시발', '씨발', 'ㅅㅂ', '병신', 'ㅂㅅ', '개새', '좆', '존나', '꺼져', '닥쳐', 'fuck', 'shit', 'puta', 'mierda', 'idiota'],

  // 질문을 보낸 학생 이름 보호: false면 '민○연'처럼 가운데 글자를 가립니다 (공개용 권장)
  showStudentNames: false
};

/* ---------------------------------------------------------------------
   작전 지점 (전투지·장소)
   map: 지도 위 위치 (SVG 좌표 — 화면에 보이는 범위: 가로 30~590 / 세로 330~1000). 숫자만 바꾸면 이동해요.
        참고: 서울 ≈ (240, 543), 인천 ≈ (208, 552), 부산 ≈ (403, 790), 38도선 = 세로 500
   label: 이름표 방향 'left' | 'right' | 'top' | 'bottom'
   chapter: 'prologue' = 전쟁 배경(파란 점선) / 'journey' = 콜롬비아대대의 여정(빨간 길)
   heroes: 위인전 카드 (학생 작품) — 여러 개 가능
   quiz: type 'ox' → answer: true/false  |  type 'choice' → answer: 정답 번호(0부터)
   questions: 이 작전 지점에서 나오는 질문 카드 id (아래 QUESTIONS 참고)
   --------------------------------------------------------------------- */
window.STATIONS = [
  {
    id: 'war', chapter: 'prologue',
    short: { ko: '6·25 전쟁', es: 'La guerra' },
    // "지도에서 찾아라!" 미션: 길·작전 지점 표시가 사라진 지도에서 직접 눌러 찾기
    //   target: [경도, 위도] + tol(허용 거리, 지도 단위) 또는 lat: 위도(그 위도 선 근처면 정답)
    //   hide: 미션 동안 숨길 힌트 ('line38' 38도선, 'dmz' 휴전선)
    find: {
      lat: 38, tol: 30, hide: ['line38', 'dmz'],
      q: { ko: '북한군이 넘어온 38도선은 어디일까요? 지도에서 그 선이 지나가는 곳을 눌러 보세요!', es: '¿Por dónde pasa el paralelo 38, la línea que cruzó el ejército norcoreano? Ubícala y marca ese punto en el mapa.' },
      hint: { ko: '힌트: 한반도의 허리쯤, 서울보다 조금 위예요.', es: 'Pista: atraviesa la península más o menos por la mitad, un poco al norte de Seúl.' },
      explain: { ko: '38도선은 1945년 광복 뒤 한반도를 남과 북으로 나눈 선이에요. 1950년 6월 25일 새벽, 북한군이 이 선을 넘어 쳐들어왔어요.', es: 'Tras la liberación del dominio japonés en 1945, el paralelo 38 dividió la península en norte y sur. En la madrugada del 25 de junio de 1950, el ejército norcoreano lo cruzó.' }
    },
    map: { x: 395, y: 500 }, label: 'right',
    name: { ko: '6·25 전쟁은 어떤 전쟁?', es: '¿Qué fue la Guerra de Corea?' },
    date: { ko: '1950. 6. 25. ~ 1953. 7. 27.', es: '25 jun. 1950 – 27 jul. 1953' },
    place: { ko: '한반도 전체', es: 'Toda la península de Corea' },
    story: {
      ko: '1950년 6월 25일 새벽, 북한군이 38도선을 넘어 남쪽으로 쳐들어왔어요. 3년 넘게 이어진 이 전쟁에서 수많은 사람이 가족과 집을 잃었어요. 이때 세계 여러 나라가 유엔의 이름으로 대한민국을 도우러 왔답니다.',
      es: 'En la madrugada del 25 de junio de 1950, el ejército de Corea del Norte cruzó el paralelo 38 e invadió el Sur. El conflicto se prolongó por más de tres años y dejó a innumerables personas sin familia y sin hogar. Frente a la invasión, numerosos países acudieron en apoyo de Corea del Sur bajo la bandera de las Naciones Unidas.'
    },
    // 전쟁 흐름 (이 작전 지점에만 있는 특별 카드) — 하나씩 누르면 지도 위 전선이 움직여요
    // front: 지도에 그릴 전선 'start' | 'nakdong' | 'north' | 'retreat' | 'dmz' | 'armistice'
    timeline: [
      { front: 'start', date: { ko: '1950. 6. 25.', es: '25 jun. 1950' }, text: { ko: '새벽, 북한군이 38도선을 넘어 기습 남침했어요.', es: 'Al amanecer, el ejército norcoreano cruza el paralelo 38 en un ataque sorpresa hacia el Sur.' } },
      { front: 'nakdong', date: { ko: '1950. 8.', es: 'ago. 1950' }, text: { ko: '국군과 유엔군은 낙동강까지 밀려 마지막 방어선을 지켰어요.', es: 'Las fuerzas surcoreanas y de la ONU, replegadas hasta el río Nakdong, resisten en su última línea de defensa.' } },
      { front: 'north', date: { ko: '1950. 9. ~ 11.', es: 'sep. – nov. 1950' }, text: { ko: '인천상륙작전 성공! 서울을 되찾고 북쪽 끝까지 올라갔어요.', es: 'El Desembarco de Incheon cambia el rumbo: se recupera Seúl y se avanza hasta el extremo norte.' } },
      { front: 'retreat', date: { ko: '1950. 10. ~ 1951. 1.', es: 'oct. 1950 – ene. 1951' }, text: { ko: '중국군이 끼어들어 다시 후퇴했어요. (1·4 후퇴)', es: 'La intervención china obliga a una nueva retirada (la “retirada del 4 de enero”).' } },
      { front: 'dmz', date: { ko: '1951 ~ 1953', es: '1951 – 1953' }, text: { ko: '38도선 근처 산(고지)에서 치열하게 싸웠어요. 콜롬비아대대가 싸운 때예요!', es: 'Guerra de posiciones: feroces combates por las colinas cercanas al paralelo 38. En esta etapa luchó el Batallón Colombia.' } },
      { front: 'armistice', date: { ko: '1953. 7. 27.', es: '27 jul. 1953' }, text: { ko: '판문점에서 정전협정을 맺고, 지금의 휴전선이 생겼어요.', es: 'Se firma el armisticio en Panmunjom y se traza la actual línea de demarcación.' } }
    ],
    videos: [
      { yt: '_zojHBvJe4w', title: { ko: '6·25 전쟁 이야기', es: 'Historia de la Guerra de Corea' }, by: '국가보훈부', len: '3:21', req: true },
      { yt: 'G9asrGB6lsM', title: { ko: '역사만화로 보는 6·25 전쟁', es: 'La Guerra de Corea en historieta' }, by: '공부왕찐천재', len: '2:22' }
    ],
    heroes: [],
    quiz: {
      type: 'ox',
      q: { ko: '6·25 전쟁 때 대한민국을 도우러 온 나라는 미국 한 나라뿐이었다.', es: 'Estados Unidos fue el único país que acudió en apoyo de Corea del Sur durante la guerra.' },
      answer: false,
      explain: { ko: '아니에요! 전투 부대를 보낸 16개 나라와 의료 지원을 한 6개 나라, 모두 22개 나라가 도왔어요. 콜롬비아도 그중 하나예요.', es: 'Falso. Participaron 22 países: 16 enviaron tropas de combate y 6 aportaron apoyo médico. Colombia fue uno de ellos.' }
    },
    questions: []
  },

  {
    id: 'incheon', chapter: 'incheon',
    short: { ko: '인천상륙작전', es: 'Incheon' },
    map: { x: 180, y: 572 }, label: 'left',
    name: { ko: '인천상륙작전', es: 'Desembarco de Incheon' },
    date: { ko: '1950. 9. 15.', es: '15 sep. 1950' },
    place: { ko: '인천 월미도·팔미도', es: 'Wolmido y Palmido, Incheon' },
    story: {
      ko: '밀물과 썰물의 차이가 아주 큰 인천은 배가 들어오기 어려운 곳이었어요. 그래서 "성공할 확률이 5000분의 1"이라는 말이 나올 만큼 모두가 걱정한 작전이었지요. 하지만 팔미도 등대에 불을 밝히고, 새벽에 월미도부터 상륙하면서 작전은 성공했어요. 덕분에 9월 28일 서울을 되찾았답니다.',
      es: 'En Incheon la diferencia entre marea alta y marea baja es enorme, lo que hacía muy difícil el acceso de los barcos. Tanto preocupaba la Operación Chromite que se llegó a decir que tenía "1 posibilidad entre 5.000" de éxito. Sin embargo, se encendió el faro de Palmido y, al amanecer, las tropas desembarcaron primero en Wolmido. La operación anfibia fue un éxito y permitió recuperar Seúl el 28 de septiembre.'
    },
    // 아이들이 캔바에 찾아 둔 영상 (group = 찾은 모둠)
    // req: 꼭 끝까지 봐야 [다음]으로 넘어가는 영상 (작전 지점마다 짧은 것 하나) · 나머지는 골라 보기
    videos: [
      { yt: '6Z0s7IM4cDE', title: { ko: 'AI로 재현한 인천상륙작전', es: 'El Desembarco de Incheon recreado con IA' }, by: '국방부 M프렌즈', group: 1, len: '1:09', req: true },
      { yt: 'TWv1WJhboyw', title: { ko: '등대 불빛 하나에 달린 작전 (팔미도 등대)', es: 'Una operación que dependía de la luz de un faro (Palmido)' }, by: '인사이드 스토리', group: 1, len: '0:50' },
      { yt: '9xTEvB2wlYM', title: { ko: '"팔미도 등대 점등 작전" 참전용사 인터뷰', es: 'Entrevista a un veterano: la operación del faro de Palmido' }, by: 'LG헬로비전', group: 5, len: '2:34' },
      { yt: 'GRJJ0R9tcHI', title: { ko: '작전명 X-Ray, 숨겨진 영웅들', es: 'Operación X-Ray: los héroes anónimos' }, by: '짧군', group: '1·2', len: '1:00' },
      { yt: '9cdx2UlKTq8', title: { ko: '비밀 첩보 작전 X-RAY', es: 'X-RAY, la operación secreta de inteligencia' }, by: '채널A', group: 3, len: '4:08' },
      { yt: 'dMX8XiqYp1w', title: { ko: '전세 역전의 발판, 부평 지구 전투', es: 'La batalla de Bupyeong, clave para cambiar el rumbo de la guerra' }, by: 'LG헬로비전', group: 2, len: '1:53' }
    ],
    // 이 작전 지점을 열면 인천 확대 지도로 바뀌고, 아이들이 조사한 5대 작전(INCHEON_OPS)이 핀으로 나와요
    inset: 'incheon',
    mission: 'lighthouse', // 팔미도 등대 미니게임: 등대를 켜고 부표를 차례로 눌러 함대를 월미도까지 안내
    heroes: [],
    quiz: {
      type: 'choice',
      q: { ko: '인천상륙작전에서 가장 먼저 상륙한 곳은 어디일까요?', es: '¿Cuál fue el primer punto de desembarco en la operación de Incheon?' },
      options: [
        { ko: '월미도', es: 'Wolmido' },
        { ko: '강화도', es: 'Ganghwado' },
        { ko: '제주도', es: 'Jejudo' },
        { ko: '울릉도', es: 'Ulleungdo' }
      ],
      answer: 0,
      explain: { ko: '정답은 월미도! 1950년 9월 15일 새벽 6시 30분, 월미도부터 상륙이 시작됐어요.', es: 'Correcto: Wolmido. El desembarco comenzó allí el 15 de septiembre de 1950, a las 6:30 de la mañana.' }
    },
    questions: []
  },

  {
    id: 'colombia', chapter: 'journey',
    short: { ko: '콜롬비아 출발', es: 'Salida' },
    map: { x: 540, y: 930 }, label: 'top', offMap: true,
    name: { ko: '콜롬비아의 결심', es: 'La decisión de Colombia' },
    date: { ko: '1950 ~ 1951', es: '1950 – 1951' },
    place: { ko: '지구 반대편, 콜롬비아', es: 'Colombia, al otro lado del mundo' },
    story: {
      ko: '콜롬비아는 한국에서 지구 반대편에 있는 나라예요. 말도, 음식도, 풍습도 달랐지만 콜롬비아는 라틴아메리카에서 유일하게 싸우는 군대(전투 병력)를 보냈어요. 육군 "콜롬비아대대"와 해군 배(프리깃함) 3척이 먼 바다를 건너왔답니다.',
      es: 'Colombia está en el otro extremo del planeta respecto a Corea. El idioma, la comida y las costumbres no tenían nada en común; aun así, fue el único país de América Latina que envió tropas de combate. Cruzaron el océano el "Batallón Colombia" del Ejército y tres fragatas de la Armada.'
    },
    // lang: 'es' = 스페인어 화면에서만 보여요 / 'ko' = 한국어 화면에서만
    videos: [
      { yt: '4VKiVFjt_PU', title: { ko: '한국전 참전 콜롬비아 용사들, 사진 첫 공개', es: 'Fotos inéditas de los combatientes colombianos en Corea' }, by: 'KBS News', len: '1:51', req: true },
      { yt: 'ekqoDYEQ-GQ', title: { ko: '콜롬비아 참전용사 4058명 (KBS 다큐, 영어 자막)', es: 'Los 4.058 veteranos colombianos (documental de KBS, subt. en inglés)' }, by: 'KBS', len: '47:51', group: 5, long: true, cc: ['en'] }, // 사람이 만든 영어 자막이 있어요
      { yt: '3u02L_RFV74', title: { ko: '(스페인어) 한국전쟁 속 콜롬비아대대', es: 'El Batallón Colombia en la Guerra de Corea' }, by: 'Exfors Histori', len: '9:30', lang: 'es' }
    ],
    heroes: [
      {
        card: 'alvarez', // 영웅 카드 번호 (아래 HERO_CARDS). 이 카드를 보면 도감에 모여요
        author: { ko: '참전용사 인터뷰에서', es: 'Tomado de una entrevista con el veterano' },
        name: { ko: '하이메 알바레스 님', es: 'Jaime Álvarez' },
        role: { ko: '콜롬비아 해군 참전용사 · 92세', es: 'Veterano de la Armada de Colombia · 92 años' },
        body: {
          ko: '콜롬비아 해군으로 한국 바다를 지켰어요. "한국이 어떤 나라인지 잘 몰랐지만, 누군가 한국을 침략해 생각을 강요하려 한다는 것은 알았어요. 그래서 자유를 지키러 갔어요."',
          es: 'Custodió las aguas coreanas como marino de la Armada colombiana. "No sabía mucho de Corea, pero sí que alguien quería invadirla e imponerle sus ideas. Por eso fui a defender la libertad."'
        },
        link: ''
      }
      // ★TODO 학생 위인전을 더 넣으려면 위 { ... } 묶음을 복사해 쉼표(,) 뒤에 붙이세요
    ],
    quiz: {
      type: 'choice',
      q: { ko: '6·25 전쟁 때 라틴아메리카에서 유일하게 전투 병력을 보낸 나라는?', es: '¿Cuál fue el único país latinoamericano que envió tropas de combate a la Guerra de Corea?' },
      options: [
        { ko: '브라질', es: 'Brasil' },
        { ko: '콜롬비아', es: 'Colombia' },
        { ko: '멕시코', es: 'México' },
        { ko: '아르헨티나', es: 'Argentina' }
      ],
      answer: 1,
      explain: { ko: '바로 콜롬비아! 그래서 한국과 콜롬비아는 "피를 나눈 형제 나라"라고 불려요.', es: 'Colombia. Por eso a Corea y Colombia se les llama "naciones hermanas de sangre".' }
    },
    questions: ['q1']
  },

  {
    id: 'busan', chapter: 'journey',
    short: { ko: '부산 도착', es: 'Busan' },
    map: { x: 404, y: 790 }, label: 'right',
    name: { ko: '부산항 도착', es: 'Llegada a Busan' },
    date: { ko: '1951. 6. 15.', es: '15 jun. 1951' },
    place: { ko: '부산항', es: 'Puerto de Busan' },
    story: {
      ko: '1951년 5월 21일, 콜롬비아대대 1,083명은 콜롬비아의 부에나벤투라 항구에서 미군 수송선에 올랐어요. 약 25일 동안 태평양을 건너 6월 15일 부산항에 도착해 성대한 환영을 받았어요. 콜롬비아대대는 미군 제24사단에 속해 중부 전선으로 올라갔어요. 전쟁 동안 콜롬비아는 육군과 해군을 합쳐 약 5,100명을 보냈어요.',
      es: 'El 21 de mayo de 1951, los 1.083 hombres del Batallón Colombia zarparon de Buenaventura a bordo de un buque de transporte estadounidense. Tras unos 25 días de travesía por el Pacífico, desembarcaron en Busan el 15 de junio, donde fueron recibidos con honores. El batallón quedó adscrito a la 24.ª División de Infantería de EE. UU. y avanzó hacia el frente central. A lo largo de la guerra, Colombia envió en total unos 5.100 efectivos del Ejército y la Armada.'
    },
    // 출처: 국가보훈부(출항 1951.5.21., 부산 도착 6.15., 참전 연인원 5,100명 · 전사 213 · 부상 448 · 포로 28),
    //       미 육군 특수전 역사 기사(1,083명, 수송선 Aiken Victory). 미 제24사단 → 1952년 1월부터 미 제7사단
    heroes: [
      {
        card: 'polania',
        author: { ko: '1모둠 친구들이 조사한 영웅', es: 'Héroe investigado por el Grupo 1 (Incheon)' },
        name: { ko: '하이메 폴라니아 푸요 대대장', es: 'Comandante Jaime Polanía Puyo' },
        role: { ko: '콜롬비아 보병대대의 첫 대대장', es: 'Primer comandante del Batallón Colombia' },
        body: {
          ko: '콜롬비아 보병대대의 첫 대대장으로, 1,000여 명의 용사들을 이끌고 한국 땅에 첫발을 내디딘 영웅이에요.',
          es: 'Primer comandante del batallón de infantería colombiano, estuvo al mando de más de 1.000 hombres cuando pisaron suelo coreano por primera vez.'
        },
        link: 'https://www.canva.com/design/DAHT6E1N4Fc/qUVAedjz1E1_4GMGCx81hQ/view'
      }
    ],
    find: {
      target: [129.04, 35.1], tol: 45,
      q: { ko: '콜롬비아대대가 도착한 부산항은 어디일까요? 지도에서 눌러 보세요!', es: 'Localiza en el mapa el puerto de Busan, donde desembarcó el Batallón Colombia.' },
      hint: { ko: '힌트: 한반도 오른쪽 아래 끝, 바다와 만나는 곳이에요.', es: 'Pista: está en el extremo sureste de la península, sobre la costa.' },
      explain: { ko: '부산은 한반도 남동쪽 끝의 큰 항구예요. 전쟁 중에도 끝까지 지켜 낸 곳이라, 유엔군이 한국으로 들어오는 문이 되었어요.', es: 'Busan es el gran puerto del sureste. Como nunca cayó en manos enemigas durante la guerra, se convirtió en la puerta de entrada de las fuerzas de la ONU.' }
    },
    quiz: {
      type: 'choice',
      q: { ko: '콜롬비아대대는 태평양을 며칠쯤 건너서 한국에 왔을까요?', es: '¿Aproximadamente cuánto duró la travesía del Batallón Colombia por el Pacífico?' },
      options: [
        { ko: '3일', es: '3 días' },
        { ko: '약 25일', es: 'Unos 25 días' },
        { ko: '약 100일', es: 'Unos 100 días' },
        { ko: '1년', es: '1 año' }
      ],
      answer: 1,
      explain: { ko: '5월 21일에 출발해 6월 15일에 도착했으니 약 25일! 비행기로 하루면 오는 지금과 달리, 그때는 배로 한 달 가까이 걸렸어요.', es: 'Zarparon el 21 de mayo y llegaron el 15 de junio: unos 25 días. Hoy el viaje en avión toma alrededor de un día; entonces, casi un mes en barco.' }
    },
    questions: []
  },

  {
    id: 'heukun', chapter: 'journey',
    short: { ko: '흑운토령', es: 'Heukuntoryeong' },
    cards: ['battalion'], // 이 작전 지점에 들어오면 받는 영웅 카드 (첫 전투 → 콜롬비아대대 카드)
    map: { x: 345, y: 448 }, label: 'right',
    name: { ko: '흑운토령 전투', es: 'Batalla de Heukuntoryeong' },
    date: { ko: '1951. 8. 6.', es: '6 ago. 1951' },
    place: { ko: '강원도 중부 전선 (금성 남쪽, 851고지)', es: 'Frente central, Gangwon (al sur de Kumsong, colina 851)' }, // 국가보훈부: Hill 851, 첫 전투. 정확한 군·면 위치는 확인 못 함
    story: {
      ko: '1951년 8월 6일, 콜롬비아대대의 첫 전투가 벌어졌어요. 처음 보는 높은 산과 낯선 날씨 속에서, 콜롬비아 군인들은 적이 차지한 851고지를 향해 용감하게 올라갔어요.',
      es: 'El 6 de agosto de 1951, el Batallón Colombia recibió su bautismo de fuego. En un terreno de montañas escarpadas y bajo un clima que no conocían, los soldados avanzaron con determinación hacia la colina 851, en poder del enemigo.'
    },
    videos: [
      { yt: 'Rr8VX6djY38', title: { ko: '"혈맹 콜롬비아군, 영원히 기억하겠습니다" (국방뉴스)', es: '"Aliados de sangre: recordaremos siempre a las tropas colombianas"' }, by: '국방뉴스', len: '1:42', req: true }
    ],
    heroes: [],
    quiz: {
      type: 'ox',
      q: { ko: '흑운토령 전투는 콜롬비아대대가 한국에서 치른 첫 전투였다.', es: 'Heukuntoryeong fue el primer combate del Batallón Colombia en Corea.' },
      answer: true,
      explain: { ko: '맞아요! 1951년 8월 6일, 부산에 도착한 지 두 달도 안 되어 치른 첫 전투였어요.', es: 'Verdadero. Fue su primer combate, el 6 de agosto de 1951, menos de dos meses después de su llegada a Busan.' }
    },
    questions: []
  },

  {
    id: 'geumseong', chapter: 'journey',
    short: { ko: '금성', es: 'Kumsong' },
    map: { x: 290, y: 430 }, label: 'top',
    name: { ko: '금성 진격전', es: 'Ofensiva de Kumsong' },
    date: { ko: '1951. 10.', es: 'oct. 1951' },
    place: { ko: '강원도 금성 일대 (지금은 휴전선 북쪽)', es: 'Zona de Kumsong (hoy al norte de la línea de demarcación)' },
    story: {
      ko: '1951년 10월, 콜롬비아대대는 미군 제24사단과 함께 "노매드 작전"에 나섰어요. 금성 쪽으로 밀고 올라가 570고지 등 적의 고지들을 차지하며 큰 공을 세웠어요.',
      es: 'En octubre de 1951, el Batallón Colombia participó junto a la 24.ª División de Infantería de EE. UU. en la Operación Nomad. Avanzó hacia Kumsong y conquistó posiciones enemigas como la colina 570, una acción muy destacada.'
    },
    // 출처: 국가보훈부 영문 누리집 — Hill 570 (1951.10.13.), Operation Nomad
    heroes: [],
    quiz: {
      type: 'choice',
      q: { ko: '콜롬비아대대는 주로 어느 나라 부대와 함께 싸웠을까요?', es: '¿Junto a las fuerzas de qué país combatió principalmente el Batallón Colombia?' },
      options: [
        { ko: '영국', es: 'Reino Unido' },
        { ko: '프랑스', es: 'Francia' },
        { ko: '튀르키예', es: 'Turquía' },
        { ko: '미국', es: 'Estados Unidos' }
      ],
      answer: 3,
      explain: { ko: '정답은 미국! 콜롬비아대대는 미군 사단에 소속되어 함께 싸웠어요.', es: 'Estados Unidos. El batallón estaba integrado en una división de infantería estadounidense y combatía con ella.' }
    },
    questions: []
  },

  {
    id: 'hill400', chapter: 'journey',
    short: { ko: '400고지', es: 'Colina 400' },
    map: { x: 300, y: 482 }, label: 'bottom',
    name: { ko: '400고지 전투', es: 'Batalla de la colina 400' },
    date: { ko: '1952. 6. 21.', es: '21 jun. 1952' },
    place: { ko: '강원도 김화 일대 (중부 전선)', es: 'Zona de Gimhwa, Gangwon (frente central)' },
    story: {
      ko: '1952년 6월 21일, 미군 제7사단에 속해 있던 콜롬비아대대는 김화 부근 400고지의 적 진지를 기습했어요. 재빠른 공격으로 적 진지를 무너뜨렸지만, 콜롬비아 용사 2명이 목숨을 잃고 15명이 다쳤어요.',
      es: 'El 21 de junio de 1952, el Batallón Colombia, entonces adscrito a la 7.ª División de Infantería de EE. UU., lanzó un asalto sorpresa contra las posiciones enemigas de la colina 400, cerca de Gimhwa. La rapidez del ataque permitió destruirlas, pero 2 soldados colombianos murieron y 15 resultaron heridos.'
    },
    // 출처: 국가보훈부 영문 누리집 — Hill 400 (1952. 6. 21.) 기습, 콜롬비아군 전사 2 · 부상 15
    heroes: [],
    quiz: {
      type: 'ox',
      q: { ko: '"400고지"의 400은 그 산의 높이(약 400m)를 뜻한다.', es: 'En "colina 400", el número indica la altura aproximada del terreno: unos 400 m.' },
      answer: true,
      explain: { ko: '맞아요! 고지 이름에 붙은 숫자는 지도에 적힌 그 산의 높이(m)예요. 그래서 400고지, 180고지처럼 불러요.', es: 'Verdadero. Las colinas se identificaban por la altura en metros marcada en el mapa; de ahí nombres como colina 400 o colina 180.' }
    },
    questions: []
  },

  {
    id: 'hill180', chapter: 'journey',
    short: { ko: '180고지', es: 'Colina 180' },
    map: { x: 222, y: 466 }, label: 'left',
    name: { ko: '180고지 전투', es: 'Batalla de la colina 180' },
    date: { ko: '1953. 3. 10.', es: '10 mar. 1953' },
    place: { ko: '경기도 연천 일대', es: 'Yeoncheon, Gyeonggi' },
    story: {
      ko: '1953년 3월 10일 새벽, 콜롬비아대대는 "바르불라 작전"으로 연천의 180고지를 기습했어요. 짧은 시간에 적 진지를 공격하고 돌아온 이 작전은 콜롬비아대대의 용맹을 널리 알렸어요. 그리고 2주 뒤, 가장 힘든 불모고지 전투가 기다리고 있었어요.',
      es: 'En la madrugada del 10 de marzo de 1953, el Batallón Colombia lanzó un golpe sorpresa contra la colina 180, en Yeoncheon: la Operación Bárbula. Fue una incursión relámpago —atacar la posición enemiga y replegarse— que dio fama al valor del batallón. Dos semanas después le esperaba su batalla más dura: Old Baldy.'
    },
    // 출처: 국가보훈부 영문 누리집 — Hill 180 (1953. 3. 10.), 미 육군 특수전 역사 기사(Operation Barbula)
    heroes: [],
    quiz: {
      type: 'choice',
      q: { ko: '콜롬비아대대가 180고지를 기습한 작전의 이름은?', es: '¿Cómo se llamó la incursión del Batallón Colombia contra la colina 180?' },
      options: [
        { ko: '바르불라 작전', es: 'Operación Bárbula' },
        { ko: '노매드 작전', es: 'Operación Nomad' },
        { ko: 'X-RAY 작전', es: 'Operación X-RAY' },
        { ko: '크로마이트 작전', es: 'Operación Chromite' }
      ],
      answer: 0,
      explain: { ko: '정답은 바르불라 작전! 노매드 작전은 금성 진격전, X-RAY는 영흥도 첩보 작전, 크로마이트는 인천상륙작전의 작전 이름이에요.', es: 'Operación Bárbula. Nomad fue la ofensiva hacia Kumsong; X-RAY, la misión de inteligencia en Yeongheungdo, y Chromite, el nombre en clave del Desembarco de Incheon.' }
    },
    questions: []
  },

  {
    id: 'oldbaldy', chapter: 'journey',
    short: { ko: '불모고지', es: 'Old Baldy' },
    map: { x: 262, y: 472 }, label: 'right',
    name: { ko: '불모고지 전투', es: 'Batalla de Old Baldy' },
    date: { ko: '1953. 3. 23. ~ 24.', es: '23–24 mar. 1953' },
    place: { ko: '경기도 연천 일대', es: 'Yeoncheon, Gyeonggi' },
    story: {
      ko: '"불모고지"는 폭탄을 너무 많이 맞아 풀 한 포기 남지 않은 산이라는 뜻이에요. 콜롬비아대대에게 가장 힘들고 슬픈 전투였어요. 많은 군인이 다치거나 목숨을 잃었지만, 끝까지 동료를 지키며 싸웠어요.',
      es: '"Old Baldy" significa "colina calva": los bombardeos fueron tan intensos que no quedó en pie ni una planta. Fue la batalla más dura y dolorosa para el Batallón Colombia. Muchos soldados resultaron heridos o perdieron la vida, pero combatieron hasta el final sin abandonar a sus compañeros.'
    },
    videos: [
      { yt: 'sQspC5vg2G8', title: { ko: '(스페인어) 참호의 악마들', es: 'Los Demonios de las Trincheras' }, by: 'El Gran Historium', len: '14:03', lang: 'es', long: true }
    ],
    // ★TODO 교사: 사상자 수 등 확인 후 보완
    heroes: [],
    quiz: {
      type: 'choice',
      q: { ko: '"불모고지"라는 이름은 무슨 뜻일까요?', es: '¿Qué significa el nombre "Old Baldy" (en coreano, "colina estéril")?' },
      options: [
        { ko: '눈이 많이 오는 산', es: 'Un monte cubierto de nieve' },
        { ko: '풀 한 포기 없는 민둥산', es: 'Un monte pelado, sin vegetación' },
        { ko: '보물이 묻힌 산', es: 'Un monte donde se enterró un tesoro' },
        { ko: '새가 많이 사는 산', es: 'Un monte habitado por muchas aves' }
      ],
      answer: 1,
      explain: { ko: '맞아요. 얼마나 치열한 싸움이었는지 이름만 들어도 알 수 있어요.', es: 'Exacto. El solo nombre revela la intensidad de los combates que se libraron allí.' }
    },
    questions: ['q2']
  },

  {
    id: 'armistice', chapter: 'journey',
    short: { ko: '판문점', es: 'Panmunjom' },
    map: { x: 180, y: 505 }, label: 'left',
    name: { ko: '판문점 정전협정', es: 'Armisticio de Panmunjom' },
    date: { ko: '1953. 7. 27.', es: '27 jul. 1953' },
    place: { ko: '판문점', es: 'Panmunjom' },
    find: {
      target: [126.68, 37.96], tol: 38,
      q: { ko: '정전협정을 맺은 판문점은 어디일까요? 휴전선을 따라가며 찾아 눌러 보세요!', es: 'Recorre la línea de demarcación y ubica Panmunjom, el lugar donde se firmó el armisticio.' },
      hint: { ko: '힌트: 휴전선의 서쪽(왼쪽) 끝 가까이, 서울에서 북쪽으로 조금 올라간 곳이에요.', es: 'Pista: cerca del extremo occidental (izquierdo) de la línea, un poco al norte de Seúl.' },
      explain: { ko: '판문점은 휴전선 위에 있는 마을이에요. 1953년 7월 27일 이곳에서 정전협정을 맺었고, 지금도 남과 북이 만나는 곳이에요.', es: 'Panmunjom es una aldea situada sobre la línea de demarcación. Allí se firmó el armisticio el 27 de julio de 1953, y todavía hoy es el punto de encuentro entre el Norte y el Sur.' }
    },
    story: {
      ko: '3년 1개월 동안의 싸움 끝에, 판문점에서 정전협정을 맺고 총소리가 멈췄어요. 전쟁이 완전히 끝난 "종전"이 아니라 잠시 멈춘 "정전"이라서, 지금도 휴전선이 남아 있어요.',
      es: 'Tras 3 años y 1 mes de guerra, la firma del armisticio en Panmunjom silenció las armas. Pero no fue el fin formal de la guerra, sino un cese de los combates; por eso la línea de demarcación sigue dividiendo la península.'
    },
    heroes: [],
    quiz: {
      type: 'ox',
      q: { ko: '정전협정은 전쟁을 완전히 끝낸 약속이다.', es: 'El armisticio fue un acuerdo que puso fin definitivo a la guerra.' },
      answer: false,
      explain: { ko: '아니에요. "정전"은 싸움을 멈춘 것이에요. 그래서 평화를 지키는 노력이 계속 필요해요.', es: 'Falso. El armisticio solo suspendió los combates; técnicamente, la guerra no ha terminado. Por eso mantener la paz exige un esfuerzo constante.' }
    },
    questions: ['q3']
  },

  {
    id: 'westsea', chapter: 'return',
    short: { ko: '서해 해군', es: 'Armada' },
    map: { x: 88, y: 455 }, label: 'right', // 서해 초도(황해도 앞바다) 부근
    name: { ko: '서해를 지킨 콜롬비아 해군', es: 'La Armada colombiana en el Mar Amarillo' },
    date: { ko: '1951 ~ 1955', es: '1951 – 1955' },
    place: { ko: '서해 (초도~석도 일대) · 동해', es: 'Mar Amarillo y Mar del Este' },
    story: {
      ko: '1951년 5월, 콜롬비아 해군의 첫 배 알미란테 파디야호가 한국에 왔어요. 5월 14일부터 서해의 초도와 석도 사이 바다를 돌며 북한군이 바다로 오가는 길을 막았고, 동해에서는 함포로 지상군을 도왔어요. 콜롬비아 해군은 전쟁이 멈춘 뒤에도 1955년까지 한국 바다를 지켰어요.',
      es: 'En mayo de 1951 llegó a Corea la fragata Almirante Padilla, el primer buque de la Armada colombiana en llegar. Desde el 14 de mayo patrulló el Mar Amarillo entre las islas Cho-do y Sok-do para cortar las rutas marítimas norcoreanas, y en el Mar del Este dio apoyo de artillería naval a las tropas en tierra. La Armada colombiana siguió custodiando las aguas coreanas incluso después del armisticio, hasta 1955.'
    },
    // 출처: 국가보훈부 영문 누리집(파디야호 1951.5.14.부터 서해 초도~석도 순찰, 동해 함포 지원, 1955년 10월 철수)
    // ※ 모둠 글의 '강화도·인천 앞바다'는 공식 기록에서 확인되지 않아 '서해'로 바꿨어요
    heroes: [
      {
        author: { ko: '5모둠 친구들이 쓴 이야기', es: 'Relato escrito por el Grupo 5 (Incheon)' },
        name: { ko: '강화도를 지킨 콜롬비아 해군', es: 'La Armada que protegió Ganghwa' },
        role: { ko: '서해 방어 작전', es: 'Defensa del Mar Amarillo' },
        body: {
          ko: '콜롬비아 해군은 서해안 바다를 철통같이 지켜 냈어요. 콜롬비아 용사들의 희생을 기리기 위해, 지금 인천 경명공원에는 참전기념비가 있어요.',
          es: 'La Armada colombiana defendió sin descanso las aguas del Mar Amarillo. En homenaje al sacrificio de los combatientes colombianos, hoy se levanta un monumento en el parque Gyeongmyeong de Incheon.'
        },
        link: 'https://canva.link/c5g6hginkh0p586'
      },
      {
        card: 'padilla',
        author: { ko: '1모둠 친구들이 조사한 영웅', es: 'Héroes investigados por el Grupo 1 (Incheon)' },
        name: { ko: '파디야호 함장과 승조원들', es: 'El comandante y la tripulación del Almirante Padilla' },
        role: { ko: '콜롬비아 해군', es: 'Armada de Colombia' },
        body: {
          ko: '서해 바다를 돌며 북한군이 바다로 오가는 길을 막고, 유엔군의 바닷길을 지켜 낸 콜롬비아 해군 영웅들이에요.',
          es: 'Marinos colombianos que patrullaron el Mar Amarillo, cerraron las rutas marítimas norcoreanas y aseguraron las líneas de navegación de las fuerzas de la ONU.'
        },
        link: 'https://www.canva.com/design/DAHT6E1N4Fc/qUVAedjz1E1_4GMGCx81hQ/view'
      },
      {
        author: { ko: '4모둠 친구들이 조사한 이야기', es: 'Relato investigado por el Grupo 4 (Incheon)' },
        name: { ko: '서해와 동해를 지킨 호위함', es: 'Fragatas en el Mar Amarillo y el Mar del Este' },
        role: { ko: '해상 봉쇄 작전', es: 'Bloqueo naval' },
        body: {
          ko: '콜롬비아 해군은 호위함을 보내 서해와 동해의 바다를 막는 작전에 참여했어요. 적의 보급선을 끊고, 해안을 포격하고, 유엔군의 상륙을 도우며 바다를 안전하게 지켰어요.',
          es: 'La Armada colombiana envió fragatas a las operaciones de bloqueo en el Mar Amarillo y el Mar del Este: cortaron las líneas de suministros enemigas, bombardearon la costa y apoyaron los desembarcos de la ONU.'
        },
        link: 'https://canva.link/ac622kddxmupdrr'
      }
    ],
    quiz: {
      type: 'choice',
      q: { ko: '콜롬비아가 한국에 보낸 첫 번째 군함의 이름은?', es: '¿Cuál fue el primer buque de guerra que Colombia envió a Corea?' },
      options: [
        { ko: '알미란테 파디야호', es: 'Almirante Padilla' },
        { ko: '타이타닉호', es: 'Titanic' },
        { ko: '거북선', es: 'Barco tortuga (geobukseon)' },
        { ko: '메이플라워호', es: 'Mayflower' }
      ],
      answer: 0,
      explain: { ko: '정답! 콜롬비아 해군은 알미란테 파디야호, 카피탄 토노호, 알미란테 브리온호 3척을 보냈어요.', es: 'Correcto. La Armada colombiana envió en total tres fragatas: la Almirante Padilla, la Capitán Tono y la Almirante Brión.' }
    },
    questions: []
  },

  {
    id: 'memorial', chapter: 'return',
    short: { ko: '기념비', es: 'Monumento' },
    map: { x: 232, y: 548 }, label: 'bottom',
    name: { ko: '콜롬비아군 참전기념비', es: 'Monumento a los combatientes colombianos' },
    date: { ko: '1975. 9. 24. 세움 → 2018. 7. 25. 이전', es: 'Erigido el 24 sep. 1975 → trasladado el 25 jul. 2018' },
    place: { ko: '인천 경명공원', es: 'Parque Gyeongmyeong, Incheon' },
    story: {
      ko: '인천 경명공원에 콜롬비아군 참전기념비가 있어요. 칼을 든 군인과 무릎 꿇고 기도하는 여인의 조각, 그리고 배의 돛을 닮은 하얀 벽이 있어요. 비석에는 한국어와 스페인어로 611명의 희생을 기억하는 글이 새겨져 있어요. 해마다 이곳에서 추모식이 열려요.',
      es: 'En el parque Gyeongmyeong de Incheon se alza el monumento a los combatientes colombianos: la escultura de un soldado con una espada, una mujer arrodillada en oración y un muro blanco que evoca la vela de un barco. Su inscripción, en coreano y en español, honra el sacrificio de 611 combatientes. Cada año se celebra allí una ceremonia conmemorativa.'
    },
    videos: [
      { yt: 'TQIYpORL2Pc', title: { ko: '고지전은 우리에게 맡겨라! 콜롬비아군 참전기념비', es: '"Déjennos la guerra de colinas": el monumento colombiano de Incheon' }, by: '꼬끼오 History', len: '5:31', req: true },
      { yt: 'f_zao2_kxSs', title: { ko: '70년 만의 만남, 콜롬비아 참전용사 초청 행사', es: 'Reencuentro 70 años después: veteranos colombianos de visita en Corea' }, by: 'TV나라사랑', len: '3:30' },
      { yt: 'Bze-QbeThmg', title: { ko: '"할아버지가 목숨 바친 나라가 궁금했어요"', es: '"Quería conocer el país por el que mi abuelo dio la vida"' }, by: '연합뉴스TV', len: '1:28' }
    ],
    // ★TODO 학생들이 답사 때 찍은 기념비 사진을 img/ 폴더에 넣고 image: 'img/memorial.jpg' 추가
    heroes: [],
    quiz: {
      type: 'choice',
      q: { ko: '기념비에 새겨진 숫자 611은 무엇을 뜻할까요?', es: '¿Qué representa el número 611 inscrito en el monumento?' },
      options: [
        { ko: '콜롬비아까지의 거리', es: 'La distancia hasta Colombia' },
        { ko: '기념비를 만든 날', es: 'La fecha en que se construyó' },
        { ko: '전쟁에서 목숨을 잃거나 다친 콜롬비아 군인 수', es: 'Los soldados colombianos muertos o heridos en la guerra' },
        { ko: '콜롬비아 배의 번호', es: 'El número de un buque colombiano' }
      ],
      answer: 2,
      explain: { ko: '기념비에는 "611명의 고귀한 생명이 피를 흘렸다"고 새겨져 있어요. 전쟁에서 목숨을 잃거나 다친 콜롬비아 군인들을 기억하는 숫자예요. (전사자·부상자 수는 자료마다 조금씩 달라요)', es: 'La inscripción dice que "611 nobles vidas derramaron su sangre": es la cifra con la que se recuerda a los soldados colombianos muertos o heridos. (Las cifras de bajas varían ligeramente según la fuente).' }
    },
    questions: ['q4', 'q5']
  }
];

/* ---------------------------------------------------------------------
   인천 5대 작전 — 아이들이 캔바 모둠 사이트에서 조사한 내용 (② 인천상륙작전 작전 지점의 인천 확대 지도)
   pin: [경도, 위도]  |  groups: 조사한 모둠 번호  |  heroes: 모둠이 찾은 영웅 (영웅 카드 도감에 모여요)
   flag: 'kr' 한국(기본) / 'us' 미국 / 'co' 콜롬비아
   ※ 여러 모둠의 글을 한 카드로 모았어요. 고칠 곳이 있으면 여기서 바로 고치면 돼요.
   --------------------------------------------------------------------- */
/* 🎬 스페인어·영어 화면 전용 영상 (말이 그 언어인 영상만 — 2026.9 재생·퍼가기 가능 확인)
   한국어 영상은 한국어 화면에서만 보여요. 자동 생성 한국어 자막뿐이라 스페인어·영어 화면에는 맞지 않아서요.
   ※ 옛 전쟁 기록 영상이 섞여 있을 수 있어요. 수업 전에 선생님이 한 번 훑어봐 주세요. */
window.LANG_VIDEOS = {
  es: {
    war: [
      { yt: 'lWEnII1bIOQ', title: { es: '¿Cómo empezó la Guerra de Corea?' }, by: 'BBC News Mundo', len: '6:32', req: true },
      { yt: '1wve7tGKI78', title: { es: 'Corea del Norte y del Sur: ¿por qué se dividieron? (animación)' }, by: 'TikTak Draw', len: '8:04' }
    ],
    incheon: [
      { yt: 'yNgIj_JywTU', title: { es: 'La batalla de Incheon: resumen' }, by: 'unProfesor', len: '5:01', req: true }
    ],
    colombia: [
      { yt: 'mOS0ah05vkk', title: { es: 'La partida del Batallón Colombia hacia Corea (archivo, 1951)' }, by: 'Señal Memoria (RTVC)', len: '3:51', req: true },
      { yt: 'koCwQIB7Xq8', title: { es: '70 años de la participación de Colombia en la Guerra de Corea' }, by: 'MinDefensa Colombia', len: '7:53' }
    ],
    heukun: [
      { yt: '6U_F06qe9HI', title: { es: 'Sobrevivientes de la Guerra de Corea cuentan sus vivencias' }, by: 'Fuerzas Militares de Colombia', len: '6:08' }
    ],
    oldbaldy: [
      { yt: 'W_QtdqnFJJ8', title: { es: 'La batalla de Monte Calvo (Old Baldy)' }, by: 'Exfors Histori', len: '8:04' }
    ],
    westsea: [
      { yt: '5WXL2ACR0xQ', title: { es: 'La Guerra de Corea en la memoria de los marinos de la Armada' }, by: 'Fuerzas Militares de Colombia', len: '3:37', req: true },
      { yt: '4HtNxdIdRFM', title: { es: 'La fragata ARC Almirante Padilla (archivo)' }, by: 'Señal Memoria (RTVC)', len: '6:32' }
    ],
    memorial: [
      { yt: 'd7e8DSk0Wf0', title: { es: 'Los veteranos colombianos de la Guerra de Corea' }, by: 'BBC News Mundo', len: '2:56', req: true },
      { yt: 'b-HHP1iNE0o', title: { es: 'Homenaje a los veteranos de Corea' }, by: 'Fuerzas Militares de Colombia', len: '5:26' }
    ]
  },
  en: {
    war: [
      { yt: 'yxaegqvl4aE', title: { en: 'The Korean War (1950–53)' }, by: 'Simple History', len: '4:31', req: true },
      { yt: 'bhvJdQiHZuQ', title: { en: 'The Korean War never ended – but how did it start?' }, by: 'BBC World Service', len: '6:38' }
    ],
    incheon: [
      { yt: '-o7iJWUlheA', title: { en: 'The Incheon Landing of the Korean War' }, by: 'Pritzker Military Museum & Library', len: '2:03', req: true },
      { yt: 'PnS2VY4rGQg', title: { en: 'Battle study: the Battle of Incheon (map)' }, by: 'Marine Corps Association', len: '3:30' }
    ],
    colombia: [
      { yt: 'vrBXq1CKdKI', title: { en: 'Colombians in the Korean War' }, by: 'KBS WORLD TV', len: '1:58', req: true }
    ],
    oldbaldy: [
      { yt: '2JOmbaARel4', title: { en: "Colombia's forgotten Korean War heroes (short documentary)" }, by: 'LatinLora', len: '5:09', req: true }
    ],
    armistice: [
      { yt: 'Uzu-TbV7Hnc', title: { en: 'The Korean War Armistice – July 27, 1953' }, by: 'Pritzker Military Museum & Library', len: '2:29', req: true }
    ],
    memorial: [
      { yt: 'B4_7IVFFFzg', title: { en: 'Event for Colombian Korean War veterans' }, by: 'KBS News', len: '1:42', req: true },
      { yt: 'YCFQ8n9HHos', title: { en: 'Remembering the sacrifice of Colombian Korean War veterans' }, by: 'KOREAZ', len: '2:55' }
    ]
  }
};

window.INCHEON_OPS = [
  {
    id: 'xray',
    pin: [126.47, 37.25], short: { ko: 'X-RAY 첩보 작전', es: 'Operación X-RAY' },
    name: { ko: '영흥도 X-RAY 첩보 작전', es: 'Operación de inteligencia X-RAY en Yeongheungdo' },
    date: { ko: '1950. 8. 중순 ~ 9. 14.', es: 'mediados de ago. – 14 sep. 1950' },
    // 출처: 부대 편성 8월 16~17일, 부산 출발 8.18., 영흥도 도착 8.24., 작전 종료 9.14.
    text: {
      ko: '인천상륙작전 전인 1950년 8월 24일, 함명수 소령 등 해군 첩보대원 17명이 적들 몰래 영흥도로 들어갔어요. 영흥도 주민들의 도움을 받아 인천 바다의 깊이와 갯벌, 바다 밑에 숨겨진 폭탄, 적의 대포와 군사가 어디 있는지 알아내 유엔군에 알렸어요. 영화 《인천상륙작전》의 이야기가 된 실화예요.',
      es: 'El 24 de agosto de 1950, antes del desembarco, el mayor Ham Myeong-su y otros agentes de inteligencia naval —17 en total— se infiltraron en la isla Yeongheungdo. Con ayuda de los isleños, reunieron datos sobre la profundidad del mar, las marismas, las minas ocultas y la ubicación de la artillería y las tropas enemigas, y los transmitieron al Comando de las Naciones Unidas. Esta historia real inspiró la película "Operation Chromite".'
    },
    heroes: [
      { card: 'hammyeongsu', name: { ko: '함명수 소령', es: 'Mayor Ham Myeong-su' }, text: { ko: 'X-RAY 작전을 이끌고 인천항으로 가는 안전한 길을 찾아낸 해군 첩보부대 지휘관', es: 'Jefe de la unidad de inteligencia naval que dirigió la operación X-RAY y halló una ruta segura hacia el puerto de Incheon.' } },
      { card: 'imhong', name: { ko: '임병래 중위 · 홍시욱 하사', es: 'Teniente Im Byeong-rae y sargento Hong Si-uk' }, text: { ko: '1950년 9월 14일 적에게 둘러싸이자, 상륙작전의 비밀을 지키기 위해 끝까지 싸우다 목숨을 바친 호국 영웅', es: 'Cercados por el enemigo el 14 de septiembre de 1950, combatieron hasta el final y dieron la vida para no revelar el secreto del desembarco.' } }
    ],
    groups: [1, 2, 3, 4, 5]
  },
  {
    id: 'palmido',
    pin: [126.511, 37.358], short: { ko: '등대 점등 작전', es: 'Faro de Palmido' },
    name: { ko: '팔미도 등대 점등 작전', es: 'Operación del faro de Palmido' },
    date: { ko: '1950. 9. 14. 밤 ~ 9. 15. 새벽', es: 'Noche del 14 al madrugada del 15 sep. 1950' },
    // 출처: 국방일보 — 점등 명령은 0시 30분, 실제로는 조금 늦게 켜졌어요(기록마다 0시 50분~1시 50분). 모둠 글의 '0시 12분'은 고쳤어요.
    text: {
      ko: '배들이 인천으로 들어오려면 캄캄한 밤바다를 밝혀 줄 팔미도 등대(1903년, 우리나라 최초의 근대식 등대)가 꼭 필요했어요. 미 해군 클라크 대위와 켈로부대 최규봉 대장, 한국군 장교들이 팔미도에 들어가 등대를 되찾고, 적이 빼돌린 부품을 찾아 고쳤어요. 9월 15일 자정을 넘긴 새벽, 등대에 불이 켜지자 261척의 유엔군 함대가 좁고 위험한 바닷길을 따라 인천으로 들어왔어요.',
      es: 'Para que la flota pudiera entrar de noche en Incheon, era indispensable el faro de Palmido (1903, el primer faro moderno de Corea). El teniente Clark, de la Armada de EE. UU., Choi Gyu-bong, jefe de un grupo de la unidad KLO, y oficiales surcoreanos retomaron la isla, localizaron las piezas que el enemigo había sustraído y repararon el faro. Pasada la medianoche del 15 de septiembre se encendió la luz, y 261 buques de la ONU avanzaron por el estrecho y peligroso canal hacia Incheon.'
    },
    // ※ 모둠이 조사한 '안형석 등대원'은 믿을 만한 기록에서 찾을 수 없어 뺐어요
    heroes: [
      { card: 'choigyubong', name: { ko: '최규봉 (켈로부대 대장)', es: 'Choi Gyu-bong (jefe de grupo KLO)' }, text: { ko: '클라크 대위와 함께 팔미도에 들어가 등대를 되찾고 불을 밝힌 켈로부대(KLO) 고트대 대장', es: 'Jefe del grupo Goat de la unidad KLO; junto al teniente Clark, retomó el faro de Palmido y lo encendió.' } },
      { card: 'clark', name: { ko: '유진 클라크 대위', es: 'Teniente Eugene Clark' }, text: { ko: '상륙 2주 전부터 섬에 숨어 인천 바다를 살피고, 팔미도 등대에 불을 밝힌 미 해군 장교', es: 'Oficial de la Armada de EE. UU. que, oculto en las islas desde dos semanas antes, vigiló el mar de Incheon y encendió el faro de Palmido.' } }
    ],
    groups: [1, 3, 4, 5]
  },
  {
    id: 'wolmido',
    pin: [126.597, 37.475], short: { ko: '월미도 상륙', es: 'Wolmido' },
    name: { ko: '월미도 상륙 전투', es: 'Desembarco en Wolmido' },
    date: { ko: '1950. 9. 15. 새벽 6시 30분', es: '15 sep. 1950, 6:30' },
    text: {
      ko: '월미도는 인천항을 지키는 섬이라, 먼저 차지해야 큰 부대가 안전하게 들어올 수 있었어요. 인천은 밀물과 썰물의 차이가 최대 10m나 되어 모두가 반대했지만, 밀물이 차오르는 9월 15일 새벽 6시 30분쯤, 미 해병대가 월미도에 먼저 상륙해 북한군의 진지를 무너뜨렸어요.',
      es: 'Wolmido custodiaba la entrada al puerto de Incheon: había que tomarla primero para que el grueso de las tropas pudiera entrar con seguridad. La marea de Incheon varía hasta 10 metros y casi todos se oponían al plan, pero hacia las 6:30 del 15 de septiembre, con la marea subiendo, los marines de EE. UU. desembarcaron en Wolmido y desarticularon las posiciones norcoreanas.'
    },
    heroes: [
      { card: 'macarthur', name: { ko: '더글러스 맥아더 장군', es: 'General Douglas MacArthur' }, text: { ko: '"성공 확률 5000분의 1"이라는 말이 나올 만큼 어려운 인천상륙작전을 계획하고 이끈 유엔군 사령관', es: 'Comandante de las fuerzas de la ONU que planeó y dirigió un desembarco tan arriesgado que se hablaba de "1 posibilidad entre 5.000".' } },
      { card: 'sonwonil', name: { ko: '손원일 제독', es: 'Almirante Sohn Won-il' }, text: { ko: '독립운동가 손정도 목사의 아들로, 해군을 만들고 인천상륙작전 함대를 이끈 "대한민국 해군의 아버지"', es: 'Hijo del pastor independentista Son Jeong-do, fundó la Armada surcoreana y comandó su flota en Incheon: es "el padre de la Armada de Corea".' } }
    ],
    groups: [1, 3, 4, 5]
  },
  {
    id: 'port',
    pin: [126.625, 37.458], short: { ko: '인천항 본대 상륙', es: 'Puerto de Incheon' },
    name: { ko: '인천항 본대 상륙', es: 'Desembarco principal en el puerto de Incheon' },
    date: { ko: '1950. 9. 15. 오후 5시 30분', es: '15 sep. 1950, 17:30' },
    text: {
      ko: '그날 오후 5시 30분쯤, 두 번째 밀물에 맞춰 미 해병대가 레드비치와 블루비치로 상륙했어요. 높은 방파제를 사다리로 넘어 시내로 들어갔고, 밤에는 한국 해병대도 뒤따라 상륙했어요. 약 7만 5천 명의 병력과 261척의 배가 함께한 이 작전 덕분에, 13일 뒤인 9월 28일 서울을 되찾았어요. 콜롬비아는 9개월 뒤인 1951년 6월, 지상군을 보내 유엔군과 함께 싸웠어요.',
      es: 'Esa misma tarde, hacia las 17:30, aprovechando la segunda marea alta, los marines de EE. UU. desembarcaron en Red Beach y Blue Beach. Escalaron con escaleras los altos malecones y avanzaron hacia la ciudad; por la noche los siguió la Infantería de Marina surcoreana. Con unos 75.000 efectivos y 261 buques, la operación permitió recuperar Seúl 13 días después, el 28 de septiembre. Nueve meses más tarde, en junio de 1951, Colombia desplegó sus tropas terrestres junto a las fuerzas de la ONU.'
    },
    heroes: [],
    groups: [1, 3, 4]
  },
  {
    id: 'bupyeong',
    pin: [126.725, 37.495], short: { ko: '부평 전투', es: 'Bupyeong' },
    name: { ko: '부평·경인축선 탈환전 & 서해 해상 봉쇄', es: 'Batalla de Bupyeong y bloqueo del Mar Amarillo' },
    date: { ko: '1950. 9. 16. ~', es: 'desde el 16 sep. 1950' },
    text: {
      ko: '인천을 되찾은 뒤, 9월 17일 미 해병대를 비롯한 연합군이 부평 원통이고개에서 북한군 탱크 부대를 물리치고 서울로 가는 길을 열었어요. 지금도 부평아트센터에 이를 기리는 부평전투 승전기념비가 있어요. 바다에서는 유엔군이 서해를 막아 북한군의 이동과 보급을 끊었고, 뒤에 온 콜롬비아 해군도 서해 바다를 지켰어요.',
      es: 'Tras recuperar Incheon, el 17 de septiembre las fuerzas aliadas, encabezadas por los marines de EE. UU., derrotaron a una unidad de tanques norcoreana en el paso de Wontong (Bupyeong) y abrieron la ruta hacia Seúl. Un monumento a esa victoria se levanta hoy en el Bupyeong Art Center. En el mar, la ONU impuso un bloqueo en el Mar Amarillo para frenar los movimientos y suministros norcoreanos; más tarde, la Armada colombiana también patrulló esas aguas.'
    },
    // 출처: 인천투데이 — 원통이고개 전투(9.17.), 부평전투 승전기념비(2008년 부평아트센터). '한·미 해병대'는 확인되지 않아 '미 해병대를 비롯한 연합군'으로 고쳤어요
    heroes: [
      { card: 'kimdongseok', name: { ko: '김동석 (육군 정보장교)', es: 'Kim Dong-seok (oficial de inteligencia)' }, text: { ko: '인천에서 서울로 가는 길의 적 정보를 모아 서울을 되찾는 데 도운 정보장교 (훗날 대령)', es: 'Oficial de inteligencia que reunió datos sobre el enemigo en la ruta Incheon–Seúl y contribuyó a recuperar la capital (luego coronel).' } }
    ],
    groups: [1, 2, 3, 4, 5]
  }
];

/* ---------------------------------------------------------------------
   🎴 영웅 카드 도감 — 작전 지점에서 영웅을 만나면 카드가 모여요
   flag: 'co' 콜롬비아 / 'kr' 대한민국 / 'us' 유엔군(미국)
   deeds: 카드를 누르면 보이는 업적 (3~4줄)  |  groups: 이 영웅을 조사한 모둠
   ※ 주석에 ★확인 이 붙은 줄은 선생님이 한 번 더 확인해 주세요 (아이들 화면에는 안 보여요)
   --------------------------------------------------------------------- */
window.HERO_CARDS = [
  // ── 콜롬비아 ──
  {
    id: 'battalion', flag: 'co', unit: true,
    name: { ko: '콜롬비아대대', es: 'Batallón Colombia' },
    role: { ko: '라틴아메리카 유일의 전투 부대', es: 'La única unidad de combate latinoamericana' },
    years: '1951 – 1954',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/%EC%BD%9C%EB%A1%AC%EB%B9%84%EC%95%84_%287445437980%29.jpg/330px-%EC%BD%9C%EB%A1%AC%EB%B9%84%EC%95%84_%287445437980%29.jpg',
    credit: '대한민국 국군 (Flickr), CC BY-SA 2.0, Wikimedia Commons',
    deeds: [
      { ko: '라틴아메리카에서 유일하게 싸우는 군대를 보낸 나라, 콜롬비아의 보병 부대예요.', es: 'Batallón de infantería de Colombia, el único país latinoamericano que envió tropas de combate.' },
      { ko: '미군 제24사단, 뒤에는 미군 제7사단에 속해 중부 전선에서 싸웠어요.', es: 'Combatió en el frente central, adscrito primero a la 24.ª y luego a la 7.ª División de Infantería de EE. UU.' },
      { ko: '흑운토령(1951.8.), 금성(1951.10.), 400고지(1952.6.), 180고지·불모고지(1953.3.)에서 용감하게 싸웠어요.', es: 'Se distinguió en Heukuntoryeong (ago. 1951), Kumsong (oct. 1951), la colina 400 (jun. 1952), la colina 180 y Old Baldy (mar. 1953).' },
      { ko: '전쟁 동안 육군과 해군 약 5,100명이 왔고, 그중 많은 용사가 다치거나 목숨을 잃었어요.', es: 'En total sirvieron unos 5.100 efectivos del Ejército y la Armada; muchos resultaron heridos o perdieron la vida.' }
    ],
    // 출처: 국가보훈부(참전 5,100명 · 전사 213 · 부상 448 · 포로 28, 주요 전투), 전쟁기념관
    groups: [2, 4]
  },
  {
    id: 'polania', flag: 'co',
    name: { ko: '하이메 폴라니아 푸요 중령', es: 'Teniente coronel Jaime Polanía Puyo' },
    role: { ko: '콜롬비아대대 첫 대대장', es: 'Primer comandante del Batallón Colombia' },
    years: '1951',
    // 사진: 자유롭게 쓸 수 있는 사진을 찾지 못했어요 (선생님이 허락받은 사진을 img 에 넣을 수 있어요)
    deeds: [
      { ko: '1951년 5월 21일, 대대원 1,083명을 이끌고 콜롬비아 부에나벤투라 항구를 떠났어요.', es: 'El 21 de mayo de 1951 zarpó de Buenaventura al mando de los 1.083 hombres del batallón.' },
      { ko: '6월 15일 부산에 도착해 미군 제24사단과 함께 중부 전선으로 나아갔어요.', es: 'Desembarcó en Busan el 15 de junio y marchó al frente central con la 24.ª División de Infantería de EE. UU.' },
      { ko: '첫 전투인 흑운토령 전투와 금성 진격전(노매드 작전)에서 대대를 이끌었어요.', es: 'Comandó el batallón en su primer combate, Heukuntoryeong, y en la ofensiva de Kumsong (Operación Nomad).' }
    ],
    // 출처: 국가보훈부(중령 하이메 폴라니아 푸요, 노매드 작전 지휘)
    groups: [1]
  },
  {
    id: 'padilla', flag: 'co', unit: true,
    name: { ko: '알미란테 파디야호', es: 'Fragata ARC Almirante Padilla' },
    role: { ko: '콜롬비아 해군의 첫 참전 군함 (프리깃함)', es: 'Primer buque de guerra colombiano en Corea (fragata)' },
    years: '1951 –',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/ARC_Almirante_Padilla_%28CM_51%29.jpg/330px-ARC_Almirante_Padilla_%28CM_51%29.jpg',
    credit: 'Colombian Navy via NavSource, 퍼블릭 도메인, Wikimedia Commons',
    deeds: [
      { ko: '1950년 11월 콜롬비아를 떠나 1951년 5월 한국 바다에 온, 콜롬비아의 첫 번째 참전 군함이에요.', es: 'Zarpó de Colombia en noviembre de 1950 y llegó a aguas coreanas en mayo de 1951: fue el primer buque de guerra colombiano en el conflicto.' },
      { ko: '1951년 5월 14일부터 서해의 초도와 석도 사이를 돌며 적의 바닷길을 막았어요.', es: 'Desde el 14 de mayo de 1951 patrulló el Mar Amarillo entre Cho-do y Sok-do para cerrar las rutas marítimas enemigas.' },
      { ko: '동해에서는 함포로 지상군을 도왔어요. 뒤이어 카피탄 토노호, 알미란테 브리온호까지 3척이 왔어요.', es: 'En el Mar del Este apoyó con su artillería a las tropas en tierra. Luego llegaron la Capitán Tono y la Almirante Brión: tres fragatas en total.' }
    ],
    // 출처: 국가보훈부 영문 누리집, 미 육군 특수전 역사 기사
    groups: [1, 4, 5]
  },
  {
    id: 'alvarez', flag: 'co',
    name: { ko: '하이메 알바레스', es: 'Jaime Álvarez' },
    role: { ko: '콜롬비아 해군 참전용사', es: 'Veterano de la Armada de Colombia' },
    years: '',
    // 사진: 본인 허락을 받기 전이라 넣지 않았어요 (허락받으면 img: 'img/heroes/파일이름.jpg' 추가)
    deeds: [
      { ko: '콜롬비아 해군 군함을 타고 한국 바다를 지켰어요. 영상에서 "알미란테 파디야호에서 복무했다"고 이야기해 주셨어요.', es: 'Defendió las aguas coreanas a bordo de un buque de la Armada colombiana. En su video contó que sirvió en la Almirante Padilla.' },
      { ko: '서해와 동해, 남해를 돌며 한반도 둘레의 바다를 순찰했어요.', es: 'Patrulló los mares que rodean la península: el Mar Amarillo, el Mar del Este y las aguas del sur.' },
      { ko: '92세에 6학년 친구들의 질문에 영상으로 답장을 보내 주셨어요. "전쟁 속의 형제, 평화 속의 형제."', es: 'A los 92 años respondió en video a las preguntas de estudiantes coreanos de 6.º grado: "Hermanos en la guerra, hermanos en la paz."' }
    ],
    // 출처: 참전용사 본인의 답장 영상
    groups: []
  },
  {
    id: 'suarez', flag: 'co',
    name: { ko: '호르헤 수아레스', es: 'Jorge Suárez' },
    role: { ko: '콜롬비아 참전용사', es: 'Veterano colombiano' },
    years: '',
    // 사진: 본인 허락을 받기 전이라 넣지 않았어요
    deeds: [
      { ko: '한국전쟁에 참전해 전우들과 함께 싸웠어요.', es: 'Combatió en la Guerra de Corea junto a sus compañeros de armas.' },
      { ko: '"가장 힘들었던 순간은 전우들이 쓰러지는 것을 볼 때였어요"라고 이야기해 주셨어요.', es: 'Lo recuerda así: "Lo más difícil fue ver caer a los compañeros".' },
      { ko: '6학년 친구들에게 "지금 가진 평화를 잘 지키세요"라는 메시지를 보내 주셨어요.', es: 'A los estudiantes coreanos de 6.º grado les dejó un mensaje: "Cuiden la paz que tienen".' }
    ],
    // 출처: 참전용사 본인의 답장 영상
    groups: []
  },
  // ── 대한민국 ──
  {
    id: 'sonwonil', flag: 'kr',
    name: { ko: '손원일 제독', es: 'Almirante Sohn Won-il' },
    role: { ko: '대한민국 해군의 아버지', es: 'Padre de la Armada de la República de Corea' },
    years: '1909 – 1980',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/%EC%A0%9C5%EB%8C%80%EA%B5%AD%EB%B0%A9%EB%B6%80%EC%9E%A5%EA%B4%80%EC%86%90%EC%9B%90%EC%9D%BC.jpg/330px-%EC%A0%9C5%EB%8C%80%EA%B5%AD%EB%B0%A9%EB%B6%80%EC%9E%A5%EA%B4%80%EC%86%90%EC%9B%90%EC%9D%BC.jpg',
    credit: '국방부(1953), 국가기록원, 퍼블릭 도메인, Wikimedia Commons',
    deeds: [
      { ko: '독립운동가 손정도 목사의 아들이에요.', es: 'Hijo del pastor Son Jeong-do, activista del movimiento de independencia coreano.' },
      { ko: '광복 뒤인 1945년 11월 해군의 뿌리인 해방병단을 만들고, 첫 해군참모총장이 되었어요.', es: 'Tras la liberación, en noviembre de 1945, fundó el Haebang Byeongdan, cuerpo naval que dio origen a la Armada, y fue el primer jefe del Estado Mayor de la Armada.' },
      { ko: '인천상륙작전 때 한국군을 이끄는 가장 높은 지휘관으로 해군과 해병대를 이끌었어요.', es: 'En el Desembarco de Incheon fue el comandante surcoreano de mayor rango, al frente de la Armada y la Infantería de Marina.' },
      { ko: '1953년 국방부 장관이 되었어요.', es: 'En 1953 fue nombrado ministro de Defensa Nacional.' }
    ],
    // 출처: 한국민족문화대백과, 국방부
    groups: [1, 3]
  },
  {
    id: 'hammyeongsu', flag: 'kr',
    name: { ko: '함명수 소령', es: 'Mayor Ham Myeong-su' },
    role: { ko: '해군 첩보부대 지휘관 · X-RAY 작전', es: 'Jefe de inteligencia naval · Operación X-RAY' },
    years: '1928 – 2016',
    img: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Navy_%28ROKN%29_Vice_Admiral_Hahm_Myong-soo_%ED%95%B4%EA%B5%B0%EC%A4%91%EC%9E%A5_%ED%95%A8%EB%AA%85%EC%88%98_%28NH_104908_Korean_Chief_of_Naval_Operations_visits_Norfolk%2C_Virginia%29.jpg',
    credit: '미 해군 역사유산사령부 NH 104908 (1966년, 해군참모총장 시절), 퍼블릭 도메인',
    deeds: [
      { ko: '1950년 8월 24일, 자신을 포함한 해군 첩보대원 17명을 이끌고 영흥도에 몰래 들어갔어요.', es: 'El 24 de agosto de 1950 se infiltró en Yeongheungdo al frente de un equipo de 17 agentes de inteligencia naval, él incluido.' },
      { ko: '인천 바다의 깊이와 갯벌, 적의 진지를 조사해 유엔군에 알렸어요.', es: 'Reconoció la profundidad del mar, las marismas y las posiciones enemigas, y lo reportó a las fuerzas de la ONU.' },
      { ko: '이 정보 덕분에 인천상륙작전의 길이 열렸어요. 뒷날 제7대 해군참모총장(1964~1966)이 되었어요.', es: 'Esa información allanó el camino al desembarco. Más tarde fue el 7.º jefe del Estado Mayor de la Armada (1964–1966).' }
    ],
    // 출처: 한국민족문화대백과·위키백과(X-RAY 작전), 이데일리
    groups: [1, 2, 3, 5]
  },
  {
    id: 'imhong', flag: 'kr',
    name: { ko: '임병래 중위 · 홍시욱 하사', es: 'Teniente Im Byeong-rae y sargento Hong Si-uk' },
    role: { ko: 'X-RAY 작전 대원', es: 'Integrantes de la Operación X-RAY' },
    years: '1950. 9. 14.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/5/57/%EC%9E%84%EB%B3%91%EB%9E%98.jpg',
    credit: '임병래 중위 사진 · 전쟁기념관, Wikimedia Commons (홍시욱 하사 사진은 찾지 못했어요)',
    deeds: [
      { ko: 'X-RAY 작전 대원으로 영흥도에서 인천상륙작전에 필요한 정보를 모았어요.', es: 'Como integrantes de X-RAY, reunieron en Yeongheungdo información clave para el Desembarco de Incheon.' },
      { ko: '1950년 9월 14일 적에게 둘러싸이자, 작전의 비밀을 지키려고 끝까지 싸우다 목숨을 바쳤어요.', es: 'El 14 de septiembre de 1950, cercados por el enemigo, combatieron hasta el final y dieron la vida para no revelar el secreto de la operación.' },
      { ko: '나라에서 을지무공훈장을, 미국에서 은성무공훈장을 주어 용기를 기렸어요.', es: 'Corea les otorgó la Orden al Mérito Militar Eulji, y EE. UU., la Estrella de Plata, en honor a su valor.' },
      { ko: '2014년 9월 "이달의 6·25전쟁영웅"으로 뽑혔어요. 임병래는 당시 소위였는데, 세상을 떠난 뒤 중위로 올려졌어요.', es: 'En septiembre de 2014 fueron nombrados "Héroes de la Guerra de Corea del mes". Im era subteniente y recibió el ascenso póstumo a teniente.' }
    ],
    // 출처: 국가보훈처 보도자료(2014. 9. 이달의 6·25전쟁영웅), 위키백과
    groups: [1, 3]
  },
  {
    id: 'choigyubong', flag: 'kr',
    name: { ko: '최규봉 대장', es: 'Choi Gyu-bong' },
    role: { ko: '켈로부대(KLO) 고트대 대장', es: 'Jefe del grupo Goat de la unidad KLO' },
    years: '1926 – 2016',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/%EC%9D%B8%EC%B2%9C_%ED%8C%94%EB%AF%B8%EB%8F%84_%EB%93%B1%EB%8C%80.jpg/330px-%EC%9D%B8%EC%B2%9C_%ED%8C%94%EB%AF%B8%EB%8F%84_%EB%93%B1%EB%8C%80.jpg',
    credit: '인물 사진 대신 팔미도 등대 · 국가유산청, 공공누리 제1유형',
    deeds: [
      { ko: '적진 뒤에서 정보를 모으는 켈로부대의 고트대를 이끈 대장이었어요.', es: 'Dirigía el grupo Goat de la unidad KLO, que recopilaba información tras las líneas enemigas.' },
      { ko: '1950년 9월 14일, 클라크 대위·한국군 장교들과 함께 팔미도에 들어가 등대를 되찾았어요.', es: 'El 14 de septiembre de 1950 desembarcó en Palmido con el teniente Clark y oficiales surcoreanos, y retomaron el faro.' },
      { ko: '9월 15일 자정을 넘긴 새벽, 등대에 불을 밝혀 261척 함대의 길을 열었어요.', es: 'Pasada la medianoche del 15 de septiembre encendió el faro y abrió paso a una flota de 261 buques.' }
    ],
    // 출처: 국방일보(2016. 7. 7.) — 점등 명령 0시 30분, 실제 점등은 조금 늦음
    groups: [1]
  },
  {
    id: 'kimdongseok', flag: 'kr',
    name: { ko: '김동석', es: 'Kim Dong-seok' },
    role: { ko: '육군 정보장교 (훗날 대령)', es: 'Oficial de inteligencia del Ejército (luego coronel)' },
    years: '1923 – 2009',
    // 사진: 자유롭게 쓸 수 있는 사진을 찾지 못했어요
    deeds: [
      { ko: '1950년 9월, 미8군과 함께 일한 한국군 정보장교였어요.', es: 'En septiembre de 1950 era oficial de inteligencia surcoreano y colaboraba con el 8.º Ejército de EE. UU.' },
      { ko: '인천에서 서울로 가는 길의 적 정보를 모아 맥아더 사령부에 전했어요.', es: 'Recopiló información sobre el enemigo en la ruta Incheon–Seúl y la hizo llegar al cuartel general de MacArthur.' },
      { ko: '그 정보가 서울을 되찾고 북쪽으로 나아가는 작전에 쓰였어요. 2016년 9월 "이달의 6·25전쟁영웅"으로 뽑혔어요.', es: 'Sus informes se usaron para recuperar Seúl y avanzar hacia el norte. En septiembre de 2016 fue nombrado "Héroe de la Guerra de Corea del mes".' }
    ],
    // 출처: 국가보훈처 보도자료(2016. 9. 이달의 6·25전쟁영웅 김동석 대령)
    groups: [1, 3]
  },
  // ── 유엔군 ──
  {
    id: 'macarthur', flag: 'us',
    name: { ko: '더글러스 맥아더 장군', es: 'General Douglas MacArthur' },
    role: { ko: '유엔군 총사령관', es: 'Comandante en jefe del Comando de las Naciones Unidas' },
    years: '1880 – 1964',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Douglas_MacArthur_Inchon_Invasion.jpg/330px-Douglas_MacArthur_Inchon_Invasion.jpg',
    credit: '인천상륙작전 때의 맥아더 · 미 해군 역사유산사령부, 퍼블릭 도메인',
    deeds: [
      { ko: '모두가 어렵다고 반대한 인천상륙작전을 계획하고 이끌었어요.', es: 'Planeó y dirigió el Desembarco de Incheon pese a que casi todos lo consideraban inviable.' },
      { ko: '"성공 확률 5000분의 1"이라는 말이 나올 만큼 어려운 작전이었지만 성공시켰어요.', es: 'Se decía que tenía "1 posibilidad entre 5.000" de éxito, y aun así la operación triunfó.' },
      { ko: '작전 13일 만인 9월 28일, 서울을 되찾는 길을 열었어요.', es: 'Abrió el camino para recuperar Seúl el 28 de septiembre, apenas 13 días después.' }
    ],
    groups: [1, 2, 3, 4]
  },
  {
    id: 'clark', flag: 'us',
    name: { ko: '유진 클라크 대위', es: 'Teniente Eugene Clark' },
    role: { ko: '미 해군 정보장교', es: 'Oficial de inteligencia de la Armada de EE. UU.' },
    years: '1911 – 1998',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/%EC%9D%B8%EC%B2%9C_%ED%8C%94%EB%AF%B8%EB%8F%84_%EB%93%B1%EB%8C%80.jpg/330px-%EC%9D%B8%EC%B2%9C_%ED%8C%94%EB%AF%B8%EB%8F%84_%EB%93%B1%EB%8C%80.jpg',
    credit: '인물 사진 대신 팔미도 등대 · 국가유산청, 공공누리 제1유형',
    deeds: [
      { ko: '1950년 9월 1일 덕적도에 먼저 내린 뒤 영흥도로 옮겨, 2주 동안 인천 바다를 몰래 살폈어요.', es: 'El 1 de septiembre de 1950 desembarcó en Deokjeokdo y luego se trasladó a Yeongheungdo, desde donde vigiló en secreto el mar de Incheon durante dos semanas.' },
      { ko: '한국인 대원들과 함께 팔미도 등대를 되찾았어요.', es: 'Junto a sus compañeros coreanos, retomó el faro de Palmido.' },
      { ko: '9월 15일 자정을 넘긴 새벽 등대에 불을 켜 함대를 안내했고, 은성무공훈장을 받았어요.', es: 'Pasada la medianoche del 15 de septiembre encendió el faro para guiar a la flota; fue condecorado con la Estrella de Plata.' }
    ],
    // 출처: 국방일보, 위키백과(Eugene F. Clark)
    groups: [3, 5]
  }
];

/* ---------------------------------------------------------------------
   📖 어려운 낱말 풀이 — 카드 글에 이 낱말이 나오면 점선 밑줄 + 아래에 번호 주석이 붙어요
   [낱말, 풀이]  (긴 낱말을 먼저 찾아요. 필요하면 자유롭게 추가하세요)
   --------------------------------------------------------------------- */
window.GLOSSARY = {
  ko: [
    ['정전협정', '싸움을 잠시 멈추기로 한 약속이에요. 전쟁이 완전히 끝난 것(종전)은 아니에요.'],
    ['휴전선', '정전협정으로 싸움을 멈춘 자리에 그은 남과 북의 경계선이에요.'],
    ['38도선', '1945년 광복 뒤 한반도를 남과 북으로 나눈, 위도 38도를 따라 그은 선이에요.'],
    ['남침', '북쪽에서 남쪽으로 쳐들어오는 것이에요.'],
    ['유엔군', '유엔의 결정에 따라 대한민국을 도우러 온 여러 나라의 군대예요.'],
    ['유엔', '세계의 평화를 지키려고 여러 나라가 모여 만든 국제기구(국제연합)예요.'],
    ['상륙작전', '배를 타고 바다에서 적이 있는 땅으로 올라가 공격하는 작전이에요.'],
    ['상륙', '배에서 내려 바다에서 육지로 올라오는 것이에요.'],
    ['첩보', '적의 비밀 정보를 몰래 알아내는 일이에요.'],
    ['켈로부대', '6·25 전쟁 때 적의 뒤쪽에서 몰래 정보를 모은 한국인 첩보부대(KLO)예요.'],
    ['함대', '여러 척의 군함이 한데 모인 무리예요.'],
    ['프리깃함', '다른 배를 지키고 바다를 순찰하는 중간 크기의 군함이에요. 호위함이라고도 해요.'],
    ['호위함', '다른 배를 곁에서 지켜 주는 군함이에요.'],
    ['수송선', '군인과 물자를 실어 나르는 배예요.'],
    ['봉쇄', '적이 드나들지 못하도록 길을 막는 것이에요.'],
    ['보급', '군인에게 필요한 음식·무기·옷 등을 보내 주는 것이에요.'],
    ['고지', '싸울 때 서로 차지하려고 다투는 높은 산이나 언덕이에요. "400고지"는 높이가 약 400m인 곳이에요.'],
    ['대대장', '대대를 이끄는 지휘관이에요.'],
    ['대대', '수백 명에서 천 명쯤의 군인으로 이루어진 군대 단위예요.'],
    ['사단', '1만 명이 넘는 군인으로 이루어진 큰 군대 단위예요.'],
    ['해병대', '바다와 땅 모두에서 싸울 수 있도록 훈련된 군대예요.'],
    ['참전용사', '전쟁에 나가 싸운 사람이에요.'],
    ['참모총장', '육군·해군·공군 가운데 한 군 전체를 이끄는 가장 높은 군인이에요.'],
    ['제독', '해군의 높은 장군을 부르는 말이에요.'],
    ['을지무공훈장', '전쟁에서 큰 공을 세운 사람에게 대한민국이 주는 무공훈장 가운데 두 번째로 높은 훈장이에요.'],
    ['은성무공훈장', '전쟁에서 용감하게 싸운 사람에게 미국이 주는 훈장이에요.'],
    ['무공훈장', '전쟁에서 큰 공을 세운 사람에게 나라가 주는 훈장이에요.'],
    ['해방병단', '1945년 광복 뒤 손원일이 만든 바다를 지키는 부대로, 대한민국 해군의 뿌리예요.'],
    ['정보장교', '적의 움직임과 비밀 정보를 모으고 분석하는 일을 맡은 군인이에요.'],
    ['노매드 작전', '1951년 10월 유엔군이 금성 쪽으로 밀고 올라간 작전의 이름이에요.'],
    ['승조원', '배에 타서 일하는 사람이에요.'],
    ['전선', '싸움이 벌어지는 맨 앞쪽의 줄이에요.'],
    ['진지', '군대가 싸우려고 자리 잡고 방어 시설을 만든 곳이에요.'],
    ['진격', '앞으로 나아가며 공격하는 것이에요.'],
    ['후퇴', '싸움에서 뒤로 물러나는 것이에요.'],
    ['탈환', '빼앗겼던 것을 되찾는 것이에요.'],
    ['갯벌', '바닷물이 빠지면 드러나는 넓은 진흙 땅이에요.'],
    ['밀물', '바닷물이 육지 쪽으로 밀려 들어오는 것이에요. 반대는 썰물이에요.'],
    ['광복', '1945년 일본의 지배에서 벗어나 나라를 되찾은 일이에요.'],
    ['전우', '함께 싸운 동료 군인이에요.'],
    ['관용', '나와 다른 사람을 너그럽게 받아들이는 마음이에요.'],
    ['부표', '물 위에 띄워 배가 다니는 길이나 위험한 곳을 알려 주는 표시예요.'],
    ['기념비', '어떤 일이나 사람을 오래 기억하려고 세운 비석이에요.']
  ],
  es: [
    ['armisticio', 'Acuerdo entre los bandos para suspender los combates. A diferencia de un tratado de paz, no pone fin formal a la guerra.'],
    ['línea de demarcación', 'Frontera trazada en 1953 donde se detuvieron los combates; todavía separa a las dos Coreas. A su alrededor se extiende la Zona Desmilitarizada (DMZ).'],
    ['paralelo 38', 'Línea de latitud 38° N con la que se dividió la península en norte y sur tras 1945.'],
    ['liberación', 'En Corea, el fin del dominio colonial japonés en 1945.'],
    ['retirada del 4 de enero', 'Repliegue de las fuerzas surcoreanas y de la ONU ante la ofensiva china; el 4 de enero de 1951 Seúl fue evacuada de nuevo.'],
    ['guerra de posiciones', 'Fase (1951–1953) en la que el frente apenas se movía y los ejércitos luchaban por colinas y trincheras.'],
    ['Comando de las Naciones Unidas', 'Mando militar unificado que dirigió a las fuerzas enviadas por los países de la ONU en apoyo de Corea del Sur.'],
    ['ONU', 'Organización de las Naciones Unidas, creada en 1945 para mantener la paz y la seguridad internacionales.'],
    ['Operación Chromite', 'Nombre en clave del Desembarco de Incheon (septiembre de 1950).'],
    ['operación anfibia', 'Ataque en el que tropas transportadas por mar desembarcan en una costa controlada por el enemigo.'],
    ['nombre en clave', 'Nombre secreto que se asigna a una operación militar para no revelar su objetivo.'],
    ['Operación Nomad', 'Ofensiva de la ONU de octubre de 1951 para avanzar hacia Kumsong.'],
    ['inteligencia', 'En el ámbito militar, obtención y análisis de información sobre el enemigo.'],
    ['KLO', 'Unidad de inteligencia integrada por coreanos que operaba tras las líneas enemigas.'],
    ['bautismo de fuego', 'Primer combate en el que participa un soldado o una unidad.'],
    ['frente central', 'Sector de la línea de combate situado en el centro de la península.'],
    ['División de Infantería', 'Gran unidad del ejército, de más de diez mil soldados, que agrupa a varios regimientos y batallones.'],
    ['batallón', 'Unidad militar de varios cientos a unos mil soldados, al mando de un teniente coronel o mayor.'],
    ['adscrito', 'Asignado a una unidad mayor para combatir bajo su mando.'],
    ['efectivos', 'Miembros de una fuerza militar; se usa para contar tropas.'],
    ['colina', 'Altura estratégica que los bandos se disputaban. Su número (colina 400) indica la altura en metros.'],
    ['flota', 'Conjunto de buques de guerra que operan juntos.'],
    ['fragata', 'Buque de guerra de tamaño medio dedicado a escoltar a otros barcos y patrullar el mar.'],
    ['artillería naval', 'Cañones instalados en buques de guerra, capaces de atacar objetivos en tierra.'],
    ['bloqueo', 'Operación para impedir que el enemigo use rutas marítimas o terrestres.'],
    ['suministros', 'Víveres, munición, combustible y equipo que un ejército necesita para operar.'],
    ['Infantería de Marina', 'Tropas de la armada entrenadas para combatir tanto en el mar como en tierra.'],
    ['marines', 'Miembros de la Infantería de Marina de EE. UU., especializados en operaciones anfibias.'],
    ['malecones', 'Muros de piedra o concreto que protegen un puerto del oleaje.'],
    ['Estado Mayor', 'Grupo de oficiales que asesora al mando y planifica las operaciones; su jefe es la máxima autoridad de esa fuerza.'],
    ['Haebang Byeongdan', 'Cuerpo naval fundado por Sohn Won-il en 1945; es el origen de la Armada surcoreana.'],
    ['Orden al Mérito Militar Eulji', 'La segunda más alta de las condecoraciones militares de Corea del Sur por méritos en combate.'],
    ['Estrella de Plata', 'Condecoración de EE. UU. que reconoce el valor en combate.'],
    ['ascenso póstumo', 'Ascenso de grado que se concede a un militar después de su muerte.'],
    ['veterano', 'Persona que combatió en una guerra.'],
    ['marismas', 'Llanuras de lodo que el mar cubre y descubre con las mareas.'],
    ['marea', 'Subida y bajada periódica del nivel del mar. En Incheon la diferencia llega a unos 10 m.'],
    ['tolerancia', 'Respeto y aceptación hacia quienes piensan, viven o se ven diferente a nosotros.'],
    ['boyas', 'Objetos flotantes que señalan a los barcos el canal seguro o los peligros.']
  ]
};

/* ---------------------------------------------------------------------
   ⭐ 평화의 별 — 모두 모으면 딱 1,083개
   1951년 태평양을 건너온 콜롬비아대대 첫 용사 1,083명을 한 분씩 기억하는 별이에요.
   (숫자를 바꾸면 합계가 1,083에서 달라지니 조심!)
   --------------------------------------------------------------------- */
window.STAR_RULES = {
  total: 1083,
  quiz: [35, 15],        // 퀴즈: 처음에 맞히면 35, 두 번째에 맞히면 15  (× 12문제 = 420)
  question: 45,          // 질문 카드에 예상 답 쓰기                        (× 5 = 225)
  op: 10,                // 인천 5대 작전 하나 살펴보기                      (× 5 = 50)
  find: { war: 38, busan: 15, armistice: 27 },  // 38도선 / 6월 15일 부산 도착 / 7월 27일 정전  (= 80)
  mission: 261,          // 팔미도 등대: 안내한 함대 261척
  voyage: 25,            // 콜롬비아 → 부산, 25일 동안의 태평양 항해
  allies: 22             // 전쟁 흐름 끝까지 보기: 함께한 22개 나라
  // 합계 420 + 225 + 50 + 80 + 261 + 25 + 22 = 1,083
};

/* ---------------------------------------------------------------------
   질문 카드 — 학생들이 참전용사께 실제로 보낸 질문 (원문: "to 콜롬비아 참전용사.hwpx")
   answers: 이 질문에 답한 영상 (3단계 엔딩에서 재생)
     video: { type: 'youtube', src: '유튜브 주소' }  또는  { type: 'mp4', src: 'videos/파일이름.mp4' }
     src가 비어 있으면 "영상 준비 중" 자리표시가 나옵니다.
   --------------------------------------------------------------------- */
window.QUESTIONS = {
  q1: {
    asker: '민○연', askerRoman: 'Min D.',
    en: 'Why did Colombian soldiers decide to come all the way to Korea to fight? What gave them the courage to come to a country so far from home?',
    text: { ko: '콜롬비아 군인들은 왜 그렇게 먼 한국까지 와서 싸우기로 결심하셨나요? 고향에서 그렇게 먼 나라로 올 수 있었던 용기는 어디에서 나왔나요?', es: '¿Por qué los soldados colombianos decidieron venir a combatir a un lugar tan lejano como Corea? ¿De dónde sacaron el valor para ir a un país tan distante de su hogar?' },
    answers: [
      {
        veteran: 'jaime',
        video: { type: 'mp4', src: '' }, // 원본: Answer Jaime Álvarez to Min doyeon_내보내기.mp4
        summary: {
          ko: '저는 민주주의를 "누가 억지로 시키지 않아도 스스로 선택할 수 있는 자유"라고 생각해요. 어떤 나라가 한국을 침략해 자기 생각을 강요하려 한다는 걸 알았고, 그 자유를 지키고 싶었어요. 그 생각이 말도 풍습도 다른 먼 나라로 갈 용기를 주었어요.',
          es: 'Para mí la democracia es la libertad de decidir por uno mismo, sin que nadie te obligue. Sabía que un país pretendía invadir Corea e imponerle sus ideas, y quise defender esa libertad. Esa convicción me dio el valor para ir a un país lejano, con otro idioma y otras costumbres.'
        }
      },
      {
        veteran: 'jorge',
        video: { type: 'mp4', src: '' }, // 원본: Answer Jorge Suarez to Min doyeon_내보내기.mp4
        summary: {
          ko: '제 경우에는 다른 나라를 알고 싶다는 마음이 컸어요. 우리는 군인이었고, 늘 이야기로만 듣던 전쟁이 무엇인지, 다른 세상은 어떤 곳인지 알고 싶었어요.',
          es: 'En mi caso, me movía el deseo de conocer otras tierras. Éramos militares y queríamos saber qué era realmente la guerra, de la que siempre oíamos hablar, y descubrir otros mundos.'
        }
      }
    ]
  },
  q2: {
    asker: '원○율', askerRoman: 'Won S.',
    en: 'What was the most difficult or painful moment you experienced during the Korean War? How did you keep going?',
    text: { ko: '6·25 전쟁 중에 겪은 가장 힘들거나 아팠던 순간은 언제였나요? 어떻게 계속 버틸 수 있었나요?', es: '¿Cuál fue el momento más difícil o doloroso que vivió en la Guerra de Corea? ¿Cómo pudo seguir adelante?' },
    answers: [
      {
        veteran: 'jorge',
        video: { type: 'mp4', src: '' }, // 원본: Answer Jorge Suarez to Won seoyul_내보내기.mp4
        summary: {
          ko: '가장 힘들었던 건 전우들이 쓰러지는 모습을 보는 것이었어요. 다친 동료를 보면 마치 나에게 일어난 일 같았어요. 떠나간 동료도 있었지만, 살아남은 우리는 계속 앞으로 나아가야 했어요.',
          es: 'Lo más difícil fue ver caer a los compañeros. Ver a un compañero herido o muerto era como si le pasara a uno mismo. Algunos se quedaron en el camino, pero los que sobrevivimos teníamos que seguir adelante.'
        }
      }
    ]
  },
  q3: {
    asker: '최○준', askerRoman: 'Choi Y.',
    en: 'After fighting together in Korea, do you feel a special friendship between Korea and Colombia? What does that friendship mean to you?',
    text: { ko: '한국에서 함께 싸운 뒤, 한국과 콜롬비아 사이에 특별한 우정을 느끼시나요? 그 우정은 어떤 의미인가요?', es: 'Después de luchar juntos en Corea, ¿siente una amistad especial entre Corea y Colombia? ¿Qué significa para usted esa amistad?' },
    answers: [
      {
        veteran: 'jaime',
        video: { type: 'mp4', src: '' }, // 원본: Answer Jaime Alvarez to Choi yijun_내보내기.mp4
        summary: {
          ko: '한국을 위해 힘을 보탰다는 것은 언제나 제 자랑이에요. 지금 한국이 이룬 모습을 보며 한국과 한국 사람들을 진심으로 사랑하게 되었어요. 유명한 말처럼, 우리는 전쟁 속의 형제였고 평화 속에서도 형제예요.',
          es: 'Haber contribuido a la causa de Corea siempre ha sido motivo de orgullo para mí. Al ver lo que Corea es hoy, llegué a querer de verdad a ese país y a su gente. Como dice la conocida frase: hermanos en la guerra, hermanos en la paz.'
        }
      },
      {
        veteran: 'jorge',
        video: { type: 'mp4', src: '' }, // 원본: Answer Jorge Suárez to Choi yijun_내보내기.mp4
        summary: {
          ko: '전쟁 뒤 우리와 여러분은 아주 가까웠어요. 오랜 시간이 지나도 여러분이 우리를 기억해 주어 고마워요. 여러분의 자유를 위해 작은 모래 한 알을 보탤 수 있었던 것이 자랑스러워요.',
          es: 'Después de la guerra, la relación entre ustedes y nosotros ha sido muy cercana. Gracias por recordarnos después de tantos años. Nos alegra haber puesto un pequeño grano de arena por su libertad.'
        }
      }
    ]
  },
  q4: {
    asker: '김○지', askerRoman: 'Kim M.',
    en: 'When you see how much Korea has grown and changed since the war, how do you feel? Are you proud?',
    text: { ko: '전쟁 이후 한국이 이렇게 많이 자라고 변한 모습을 보면 어떤 기분이 드세요? 자랑스러우신가요?', es: 'Cuando ve cuánto ha crecido y cambiado Corea desde la guerra, ¿cómo se siente? ¿Está orgulloso?' },
    answers: [
      {
        veteran: 'jaime',
        video: { type: 'mp4', src: '' }, // 원본: Answer Jaime Alvarez to Minji Kim_내보내기.mp4
        summary: {
          ko: '한국을 지키기 위해 참전을 결심했던 것이 정말 자랑스러워요. 전쟁 이후 한국이 이룬 성공과 발전이 마치 제 일처럼 느껴져요. 여러분 나라의 성공을 보며 큰 기쁨을 느껴요.',
          es: 'Me enorgullece profundamente haber decidido ir a defender Corea. Siento el éxito y el desarrollo que Corea alcanzó después de la guerra casi como propios. Ver prosperar a su país me llena de alegría.'
        }
      },
      {
        veteran: 'jorge',
        video: { type: 'mp4', src: '' }, // 원본: Answer Jorge Suarez to Minji Kim_내보내기.mp4
        summary: {
          ko: '전쟁 이후 한국에 다시 가 보지는 못했지만, 한국이 경제·과학 등 모든 면에서 얼마나 발전했는지 알고 있어요. 정말 놀라워요. 우리 콜롬비아 사람들도 무척 기뻐요.',
          es: 'No he vuelto a Corea desde la guerra, pero sé cuánto ha avanzado en todos los campos: la economía, la ciencia… Es admirable, y a los colombianos nos llena de alegría.'
        }
      }
    ]
  },
  q5: {
    asker: '김○환', askerRoman: 'Kim J.',
    en: 'What message of peace do you want to give to young students like us? What can we do to keep your sacrifice and memory alive?',
    text: { ko: '저희 같은 어린 학생들에게 어떤 평화의 메시지를 전하고 싶으세요? 참전용사님의 희생과 기억을 이어 가려면 저희가 무엇을 할 수 있을까요?', es: '¿Qué mensaje de paz quiere dar a estudiantes jóvenes como nosotros? ¿Qué podemos hacer para mantener vivos su sacrificio y su memoria?' },
    answers: [
      {
        veteran: 'jaime',
        video: { type: 'mp4', src: '' }, // 원본: Answer Jaime Alvarez to Juhwan Kim_내보내기.mp4
        summary: {
          ko: '평화의 메시지는 미움을 내려놓는 거예요. 옷차림이나 생각이 다르다고 미워하면 안 돼요. 가족의 다름을 받아들이듯 다른 사람도 받아들이세요. 제게 가장 중요한 말은 "관용"이에요. 관용이 있을 때 평화가 찾아와요.',
          es: 'El mensaje de paz es dejar atrás el odio. No debemos odiar a nadie porque se vista, actúe o piense diferente. Acepten a los demás como aceptan las diferencias dentro de su propia familia. Para mí la palabra clave es "tolerancia": con tolerancia llegará la paz.'
        }
      },
      {
        veteran: 'jorge',
        video: { type: 'mp4', src: '' }, // 원본: Answer Jorge Suarez to Juhwan Kim_내보내기.mp4
        summary: {
          ko: '지금 가진 평화를 잘 지키세요. 다시는 전쟁의 순간으로 돌아가지 않도록요. 여러분은 미래의 지도자로서 나라를 평화롭게 지킬 책임이 있어요. 전쟁이 가르쳐 준 것을 기억하세요.',
          es: 'Procuren conservar la paz que tienen, para no volver nunca a los tiempos de guerra. Ustedes, como futuros líderes, tendrán la responsabilidad de que su país viva en paz. No olviden lo que nos enseña la guerra.'
        }
      }
    ]
  }
};

window.VETERANS = {
  jaime: { name: { ko: '하이메 알바레스', es: 'Jaime Álvarez' }, role: { ko: '해군 참전용사 · 92세', es: 'Veterano de la Armada · 92 años' } },
  jorge: { name: { ko: '호르헤 수아레스', es: 'Jorge Suárez' }, role: { ko: '참전용사', es: 'Veterano' } }
};

/* ---------------------------------------------------------------------
   더 알아보기 (엔딩 화면) — 국가보훈부 자료
   --------------------------------------------------------------------- */
window.LINKS = [
  {
    name: { ko: 'Finding Heroes (추모의 벽) 앱', es: 'App Finding Heroes (Muro del Recuerdo)' },
    desc: { ko: '6·25 전쟁 참전용사의 이름과 이야기를 찾아볼 수 있어요.', es: 'Consulta los nombres y las historias de los veteranos de la Guerra de Corea.' },
    // ★TODO 보훈부가 안내한 정확한 앱 설치 주소로 바꿔 주세요
    url: 'https://play.google.com/store/search?q=Finding%20Heroes&c=apps'
  },
  {
    name: { ko: '유엔참전용사 디지털 아카이브', es: 'Archivo digital de veteranos de la ONU' },
    desc: { ko: '참전용사 인터뷰, 사진, 편지 등 진짜 기록이 모여 있어요.', es: 'Fuentes primarias: entrevistas, fotografías y cartas de los veteranos.' },
    url: 'https://unarchives.mpva.go.kr/'
  },
  {
    name: { ko: '국가보훈부', es: 'Ministerio de Patriotas y Veteranos de Corea' },
    desc: { ko: '나라를 위해 헌신한 분들을 기억하는 정부 기관이에요.', es: 'Entidad del gobierno surcoreano que honra la memoria de quienes sirvieron al país.' },
    url: 'https://www.mpva.go.kr/'
  }
];

/* 학생 모둠 캔바 작품 (엔딩 화면 갤러리)
   ★TODO 공개 전: 캔바 '공유 → 보기 전용 링크'로 바꿔 주세요 (편집 링크는 누구나 고칠 수 있어요!) */
window.GROUP_WORKS = [
  { name: { ko: '1모둠 · 인천 6·25 전쟁 5대 전투 & 잊지 말아야 할 영웅들', es: 'Grupo 1 · Las cinco grandes batallas de Incheon y los héroes que no debemos olvidar' }, url: 'https://www.canva.com/design/DAHT6E1N4Fc/qUVAedjz1E1_4GMGCx81hQ/view' },
  { name: { ko: '2모둠 · 6·25 전쟁 때 콜롬비아가 참전한 전투', es: 'Grupo 2 · Las batallas en las que participó Colombia' }, url: 'https://canva.link/afq75w0bon61f9l' },
  { name: { ko: '3모둠 · 콜롬비아', es: 'Grupo 3 · Colombia' }, url: 'https://canva.link/w1zhvd3j3a0wlfq' },
  { name: { ko: '4모둠', es: 'Grupo 4' }, url: 'https://canva.link/ac622kddxmupdrr' },
  { name: { ko: '5모둠 · 기억해야 할 그날, 6·25 전쟁 속 인천', es: 'Grupo 5 · Un día para recordar: Incheon en la Guerra de Corea' }, url: 'https://canva.link/c5g6hginkh0p586' }
];
