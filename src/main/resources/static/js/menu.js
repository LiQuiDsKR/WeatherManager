// 메뉴 버튼과 드롭다운 요소 선택
const menuBtn = document.querySelector('.menu-btn');
const dropdown = document.querySelector('.dropdown');

// 초기 상태 설정
dropdown.style.display = 'none';

// 버튼 클릭 시 드롭다운 토글
menuBtn.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
});

function navigateToHome() {
    window.location.href = '/html/index.html'; // 홈 페이지 경로
}