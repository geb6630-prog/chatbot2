const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const text = userInput.value.trim();
    if (text === '') return;

    // 사용자 메시지 추가
    appendMessage(text, 'user');
    userInput.value = '';

    // 봇 응답 생성 (간단한 지연시간 추가로 자연스럽게)
    setTimeout(() => {
        const response = getBotResponse(text);
        appendMessage(response, 'bot');
    }, 500);
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    
    // 스크롤 맨 아래로
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(text) {
    // 소문자 및 공백 제거 (간단한 형태소 분석 대체)
    const normalizedText = text.replace(/ /g, "");

    // 구름빵 관련 키워드
    if (normalizedText.includes('구름빵') || normalizedText.includes('홍비') || normalizedText.includes('홍시')) {
        if (normalizedText.includes('줄거리') || normalizedText.includes('내용')) {
            return "구름빵은 홍비와 홍시가 나무에 걸린 구름을 가져와서 엄마가 구워준 구름빵을 먹고 하늘을 날게 되는 신나는 이야기야!";
        }
        if (normalizedText.includes('엄마') || normalizedText.includes('아빠')) {
            return "엄마는 구름으로 맛있는 빵을 구워주셨고, 홍비와 홍시는 지각할 뻔한 아빠에게 구름빵을 배달해주었단다!";
        }
        return "구름빵을 먹으면 우리도 하늘을 둥둥 날아다닐 수 있을까? 상상만 해도 너무 재미있지!";
    }

    // 무지개 물고기 관련 키워드
    if (normalizedText.includes('무지개물고기') || normalizedText.includes('비늘') || normalizedText.includes('물고기')) {
        if (normalizedText.includes('왜') || normalizedText.includes('외톨이')) {
            return "무지개 물고기가 처음에는 예쁜 은빛 비늘을 친구들에게 나누어주지 않아서 외톨이가 되었었어.";
        }
        if (normalizedText.includes('문어') || normalizedText.includes('할머니')) {
            return "지혜로운 문어 할머니가 무지개 물고기에게 비늘을 나누어주면 행복해질 거라고 조언해주셨지!";
        }
        if (normalizedText.includes('결말') || normalizedText.includes('마지막')) {
            return "마지막엔 무지개 물고기가 친구들에게 반짝이 비늘을 하나씩 나누어주며 진짜 친구를 얻고 가장 행복한 물고기가 된단다!";
        }
        return "반짝이는 비늘을 친구들과 나누어 가진 무지개 물고기처럼 우리도 친구들과 나누는 마음을 가지면 좋겠어!";
    }
    
    // 인사말 등
    if (normalizedText.includes('안녕') || normalizedText.includes('반가워')) {
        return "안녕! 반가워! '구름빵'이나 '무지개 물고기'에 대해 물어봐줘!";
    }

    // 기본 응답
    return "음.. 그건 잘 모르겠어. '구름빵'이나 '무지개 물고기'에 대해서 물어봐주면 잘 대답해줄 수 있어! 😃";
}
