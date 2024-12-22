document.addEventListener("DOMContentLoaded", () => {
    const weatherData = sessionStorage.getItem("weatherData");

    if (!weatherData) {
        alert("날씨 정보를 불러오는 데 실패했습니다. 메인 페이지로 돌아갑니다.");
        window.location.href = "/html/index.html";
        return;
    }

    fetch('/api/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: weatherData, // JSON 데이터 전송
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch recommendation");
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            renderClothingRecommendation(data); // 데이터 렌더링
            sessionStorage.setItem("recommendationData", JSON.stringify(data)); // 추천 데이터를 세션에 저장
        })
        .catch(error => {
            console.error('Error fetching recommendation:', error);
            document.getElementById('recommendations').innerHTML = '<p>추천 데이터를 가져오는 중 문제가 발생했습니다.</p>';
        });
});

function renderClothingRecommendation(data) {
    const container = document.getElementById('recommendations');
    if (!container) {
        console.error('recommendations 컨테이너를 찾을 수 없습니다.');
        return;
    }

    if (!data || !data.items || !Array.isArray(data.items)) {
        container.innerHTML = `<p>추천 데이터를 불러오는 데 실패했습니다.</p>`;
        console.error('Invalid data format:', data);
        return;
    }

    // 결과를 동적으로 생성
    container.innerHTML = `
        <h2>${data.title || "추천 옷차림"}</h2>
        <p>${data.description || "날씨에 맞는 옷차림을 추천드립니다."}</p>
        <ul id="recommendation-items">
            ${data.items.map(item => `
                <li>
                    <strong>${item.name}</strong> (${item.type}): ${item.description || "설명 없음"}
                    ${item.imageUrl ? `<br><img src="${item.imageUrl}" alt="${item.name}" style="max-width: 200px; max-height: 200px;">` : ""}
                </li>
            `).join('')}
        </ul>
    `;
}

// "코디 공유하기" 버튼 클릭 시
function shareRecommendation() {
    const recommendationData = sessionStorage.getItem("recommendationData");
    if (!recommendationData) {
        alert("추천 데이터를 찾을 수 없습니다. 다시 시도해주세요.");
        return;
    }

    // 새 글쓰기 페이지로 추천 데이터를 전달
    window.location.href = `/html/newpost.html?data=${encodeURIComponent(recommendationData)}`;
}