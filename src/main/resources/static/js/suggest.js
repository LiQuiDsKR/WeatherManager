// 건의사항 목록 불러오기
async function fetchSuggestions() {
    try {
        const response = await fetch('/api/suggestions'); // API 호출
        const suggestions = await response.json();

        const suggestionList = document.querySelector('.suggestion-list');
        suggestionList.innerHTML = ''; // 기존 내용 초기화

        // 서버에서 가져온 데이터를 동적으로 HTML에 추가
        suggestions.forEach((item, index) => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';

            suggestionItem.innerHTML = `
                <h2>${item.title}</h2>
                <p><strong>작성자:</strong> ${item.name}</p>
                <p><strong>분류:</strong> ${item.category}</p>
                <p>${item.suggestion}</p>
                ${item.replied ? `<p><strong>답변:</strong> ${item.replyContent}</p>` : '<p><em>아직 답변이 없습니다.</em></p>'}
            `;

            suggestionList.appendChild(suggestionItem);
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        alert('건의사항 목록을 가져오는 중 문제가 발생했습니다.');
    }
}


function addSuggestion() {
    window.location.href = '/html/newsuggest.html';
}

document.addEventListener('DOMContentLoaded', fetchSuggestions);