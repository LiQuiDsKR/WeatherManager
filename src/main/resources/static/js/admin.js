let currentSuggestionIndex = null; // 현재 선택된 건의사항의 인덱스

// 서버에서 건의사항 목록 가져오기
async function fetchSuggestions() {
    try {
        const response = await fetch('/api/suggestions');
        const suggestions = await response.json();

        const suggestionList = document.querySelector('.suggestion-list');
        suggestionList.innerHTML = ''; // 기존 내용 초기화

        // 동적으로 건의사항 생성
        suggestions.forEach((item, index) => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';

            suggestionItem.innerHTML = `
                <h2>${item.title}</h2>
                <p><strong>작성자:</strong> ${item.name}</p>
                <p><strong>분류:</strong> ${item.category}</p>
                <p>${item.suggestion}</p>
                ${item.replied ? `<p><strong>답변:</strong> ${item.replyContent}</p>` : '<p><em>답변이 없습니다.</em></p>'}
                <div class="action-buttons">
                    <button class="reply-btn" onclick="openReplyModal(${index})">답변</button>
                    <button class="delete-btn" onclick="deleteSuggestion(${index})">삭제</button>
                </div>
            `;

            suggestionList.appendChild(suggestionItem);
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        alert('건의사항 목록을 불러오는 중 문제가 발생했습니다.');
    }
}

// 답변 모달 창 열기
function openReplyModal(index) {
    currentSuggestionIndex = index; // 현재 건의사항 인덱스 설정
    document.getElementById('reply-modal').style.display = 'flex';
}

// 답변 모달 창 닫기
function closeModal() {
    document.getElementById('reply-modal').style.display = 'none';
}

// 답변 제출
async function submitReply() {
    const replyContent = document.getElementById('reply-content').value;

    if (!replyContent) {
        alert('답변 내용을 입력하세요.');
        return;
    }

    try {
        const response = await fetch(`/api/suggestions/${currentSuggestionIndex}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ replyContent })
        });

        if (response.ok) {
            alert('답변이 성공적으로 등록되었습니다!');
            closeModal();
            fetchSuggestions(); // 목록 갱신
        } else {
            alert('답변 등록에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error submitting reply:', error);
        alert('답변 등록 중 문제가 발생했습니다.');
    }
}

// 건의사항 삭제
async function deleteSuggestion(index) {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    try {
        const response = await fetch(`/api/suggestions/${index}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('건의사항이 성공적으로 삭제되었습니다!');
            fetchSuggestions(); // 목록 갱신
        } else {
            alert('건의사항 삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error deleting suggestion:', error);
        alert('건의사항 삭제 중 문제가 발생했습니다.');
    }
}

// 페이지 로드 시 건의사항 가져오기
document.addEventListener('DOMContentLoaded', fetchSuggestions);
