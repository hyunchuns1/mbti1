// 1. 질문 데이터 (동의/비동의 방식에 맞춰 문장 수정)
// 질문에 동의할수록(그렇다) A 성향, 비동의할수록(아니다) B 성향으로 연산됩니다.
const questions = [
    { q: "문제가 안 풀릴 때 혼자 앓기보다 팀원이나 커뮤니티에 먼저 공유하는 편이다.", type: "EI", positive: "E", negative: "I" },
    { q: "IT 세미나나 개발자 행사에 가면 모르는 사람과도 쉽게 대화를 시작한다.", type: "EI", positive: "E", negative: "I" },
    { q: "화이트보드에 아이디어를 마구 던지며 회의할 때 개발 의욕이 더 솟구친다.", type: "EI", positive: "E", negative: "I" },
    
    { q: "코드를 짤 때 당장의 기능 구현보다 미래의 확장성과 아키텍처 구조를 더 고민한다.", type: "NS", positive: "N", negative: "S" },
    { q: "새 오픈소스를 쓸 때 원리나 개념을 담은 문서를 정독하는 게 퀵스타트 코드 복사보다 편하다.", type: "NS", positive: "N", negative: "S" },
    
    { q: "코드 리뷰 때 내 로직에 날카로운 기술적 비판을 들으면 감정 상하지 않고 순수하게 기쁘다.", type: "TF", positive: "T", negative: "F" },
    { q: "동료가 에러 때문에 힘들어하면 위로의 말보다는 디버깅 가이드를 먼저 주는 편이다.", type: "TF", positive: "T", negative: "F" },
    { q: "팀장이 능력이 다소 부족하더라도 팀 분위기를 편안하게 이끌어주는 사람이 더 좋다.", type: "TF", positive: "F", negative: "T" },
    
    { q: "개발 주기를 시작하기 전, 일자별 티켓 분배와 할 일 관리가 완벽히 되어야 안심된다.", type: "JP", positive: "J", negative: "P" },
    { q: "마감 직전 갑작스러운 요구사항 변경이 오더라도 짜증보다 유연하게 대처하는 편이다.", type: "JP", positive: "P", negative: "J" }
];

// 2. 개발자 16가지 MBTI 캐릭터 정보 데이터
const results = {
    "INTJ": { title: "고독한 AI 아키텍트", avatar: "🤖", desc: "인간보다 완벽한 시스템 설계를 지향하는 설계자. 결점 없는 아키텍처를 볼 때 가장 짜릿해 합니다." },
    "INTP": "인터넷 망령 디버깅 장인", avatar: "🧠", desc: "최신 기술의 원리부터 심해 에러까지 파고드는 탐구자. 리팩토링할 때 자아 성찰을 느낍니다." },
    "INFJ": { title: "보이지 않는 코드 수호자", avatar: "🔮", desc: "팀의 장기적 성장과 조화로운 시스템을 꿈꾸는 통찰가. 주석 하나에도 깊은 철학을 담습니다." },
    "INFP": { title: "감성 한 스푼 프론트 장인", avatar: "🎨", desc: "유저의 마음에 가닿는 코드를 짜는 이상주의자. 코드의 심미성과 가독성을 매우 중시합니다." },
    "ISTJ": { title: "걸어 다니는 컴파일러", avatar: "📐", desc: "문서화와 테스트 코딩의 1인자. 정해진 규칙과 약속된 일정은 지구 종말이 와도 지킵니다." },
    "ISFJ": { title: "화면 뒤의 숨은 구원자", avatar: "🛡️", desc: "드러나지 않아도 팀의 레거시 버그와 궂은일을 묵묵히 처리하는 수호자. 팀원들이 가장 신뢰합니다." },
    "ISTP": { title: "서버실의 맥가이버", avatar: "🔧", desc: "말없이 들어와 터진 서버를 고치고 사라지는 무림 고수. 이론보단 지금 당장 돌아가는 코드가 최고입니다." },
    "ISFP": { title: "픽셀 아트 아티스트", avatar: "🖌️", desc: "디자인과 개발의 경계를 허무는 감각파 개발자. 영감이 올 때 몰아치는 코딩의 천재입니다." },
    "ENTJ": { title: "배를 이끄는 테크 리더", avatar: "🦁", desc: "스타트업 CTO에 최적화된 카리스마 리더. 비즈니스 가치와 팀의 속도를 무서운 효율로 끌어올립니다." },
    "ENTP": { title: "기술 검증 파괴왕", avatar: "💥", desc: "새로운 기술 스택 찍어 먹기와 해커톤을 사랑하는 도전자. 기존의 틀을 부수고 새 판을 짤 때 살아있음을 느낍니다." },
    "ENFJ": { title: "개발 문화 전도사", avatar: "📢", desc: "팀원 모두를 이끄는 성인군자형 리드. 스터디를 개설하고 팀의 행복 지수를 올리는 데 진심입니다." },
    "ENFP": { title: "인싸 오픈소스 메이커", avatar: "🦄", desc: "어디서든 아이디어가 튀어나오는 활동가. 기술 트렌드에 밝고 개발자 네트워킹의 중심에 서 있습니다." },
    "ESTJ": { title: "지라(Jira)의 지배자", avatar: "📊", desc: "일정 지연을 용납하지 않는 엄격한 PM 성향. 코드 컨벤션과 파이프라인 정리를 칼같이 집행합니다." },
    "ESFJ": { title: "오피스 최고의 마당발", avatar: "🤝", desc: "기획, 디자인, 영업팀 간의 커뮤니케이션 허브. 뛰어난 소통력으로 부서 간 갈등을 스무스하게 풀어냅니다." },
    "ESTP": { title: "실전 압축형 야생 개발자", avatar: "🏎️", desc: "이론 공부보단 무조건 프로덕션 배포부터 지르고 보는 실전파. 위기 상황에서 동물적인 감각으로 대처합니다." },
    "ESFP": { title: "코딩 실실 웃음 유발자", avatar: "🎉", desc: "무거운 개발실 분위기를 띄우는 유쾌한 개발자. 사용자 피드백에 즉각 반응하며 신나게 개발합니다." }
};

// 3. 상태 관리 변수
let currentIdx = 0;
let scores = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };

// 4. DOM 요소들
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress');
const nextBtn = document.getElementById('next-btn');

const charAvatar = document.getElementById('char-avatar');
const charTitle = document.getElementById('char-title');
const mbtiResult = document.getElementById('mbti-result');
const resultDesc = document.getElementById('result-desc');

// 5. 이벤트 리스너
document.getElementById('start-btn').addEventListener('click', startTest);
nextBtn.addEventListener('click', moveToNext);
document.getElementById('restart-btn').addEventListener('click', restartTest);

// 라디오 버튼을 선택할 때만 '다음 질문' 버튼을 활성화하는 로직
const radioButtons = document.querySelectorAll('input[name="likert"]');
radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        nextBtn.disabled = false;
    });
});

// 6. 기능 제어 함수
function startTest() {
    startScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    currentIdx = 0;
    showQuestion();
}

function showQuestion() {
    // 라디오 버튼 체크 초기화 및 다음 버튼 비활성화
    radioButtons.forEach(radio => radio.checked = false);
    nextBtn.disabled = true;

    if (currentIdx < questions.length) {
        const currentQ = questions[currentIdx];
        questionText.innerText = currentQ.q;
        
        // 상단 카운터 및 프로그레스 바 제어
        progressText.innerText = `${currentIdx + 1} / ${questions.length}`;
        progressBar.style.width = `${((currentIdx) / questions.length) * 100}%`;
    } else {
        showResult();
    }
}

function moveToNext() {
    // 체크된 라디오 버튼 가치 획득 (-2, -1, 0, 1, 2)
    const selectedRadio = document.querySelector('input[name="likert"]:checked');
    const weight = parseInt(selectedRadio.value);
    const currentQ = questions[currentIdx];

    // 가중치 계산 법칙: 양수면 positive 성향에 누적, 음수면 negative 성향에 절대값 누적
    if (weight > 0) {
        scores[currentQ.positive] += weight;
    } else if (weight < 0) {
        scores[currentQ.negative] += Math.abs(weight);
    }
    
    currentIdx++;
    showQuestion();
}

function showResult() {
    questionScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    // 스코어 최종 정산
    const mbti = 
        (scores.E >= scores.I ? "E" : "I") +
        (scores.N >= scores.S ? "N" : "S") +
        (scores.T >= scores.F ? "T" : "F") +
        (scores.J >= scores.P ? "J" : "P");

    const data = results[mbti];
    
    // 화면에 캐릭터 요소 렌더링
    mbtiResult.innerText = mbti;
    charAvatar.innerText = data.avatar;
    charTitle.innerText = data.title;
    resultDesc.innerText = data.desc;
}

function restartTest() {
    scores = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
    resultScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}
