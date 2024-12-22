// 건의사항 제출 함수
async function submitSuggestion() {
    // 입력된 값 가져오기
    const name = document.getElementById('name').value || '익명'; // 기본값: 익명
    const category = document.getElementById('category').value || '미분류';
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    // 필수 입력값 검증
    if (!title || !content) {
        alert('제목과 내용을 모두 입력해주세요!');
        return;
    }

    // 건의사항 객체 생성
    const suggestion = {
        timestamp: new Date().toISOString(), // 현재 시간
        name, // 작성자 이름
        title, // 제목
        category, // 분류
        suggestion: content, // 내용
        replied: false, // 기본값: false
        replyContent: null, // 기본값: null
        replyTime: null // 기본값: null
    };

    try {
        // 서버에 POST 요청
        const response = await fetch('/api/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(suggestion)
        });

        if (response.ok) {
            alert('건의사항이 성공적으로 등록되었습니다!');
            // 건의사항 목록 페이지로 이동
            window.location.href = '/html/suggest.html';
        } else {
            alert('건의사항 제출에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('Error submitting suggestion:', error);
        alert('건의사항 제출 중 오류가 발생했습니다.');
    }
}

// 제출 버튼 클릭 이벤트 리스너 추가
document.querySelector('.submit-btn').addEventListener('click', submitSuggestion);
