document.addEventListener("DOMContentLoaded", function () {
    // 날씨 데이터 가져오기
    const weatherData = sessionStorage.getItem("weatherData");

    if (!weatherData) {
        alert("날씨 정보를 불러올 수 없습니다.");
        document.getElementById("uv-info").textContent = "날씨 데이터를 불러오지 못했습니다.";
        return;
    }

    fetch("/api/ultraviolet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: weatherData, // JSON 데이터 전송
    })
        .then(response => response.json())
        .then(data => {
            console.log('Response data:', data);

            // 데이터 렌더링
            document.getElementById("uv-info").innerHTML = `
                자외선 강도: <span class="highlight">${data.uvLevel || "정보 없음"}</span>
            `;
            document.getElementById("recommendation-info").textContent = data.recommendation || "추천 정보를 불러오지 못했습니다.";
            document.getElementById("additional-tips").textContent = data.additionalTips || "추가적인 팁 없음";

            // 추천 데이터를 세션에 저장 (JSON 형식으로)
            sessionStorage.setItem("ultravioletInfo", JSON.stringify(data));

            const ultravioletData = sessionStorage.getItem("ultravioletInfo");
            if (ultravioletData) {
                try {
                    const data = JSON.parse(ultravioletData); // JSON 형식으로 파싱

                    // OpenAI 응답에서 필요한 데이터 추출
                    const content = JSON.parse(data.choices[0].message.content);

                    // DOM 요소에 데이터 렌더링
                    document.getElementById("uv-info").innerHTML = `
                        <strong>자외선 강도:</strong> <span class="highlight">${content.uvLevel || "정보 없음"}</span>
                    `;
                    document.getElementById("recommendation-info").textContent = content.recommendation || "추천 정보를 불러오지 못했습니다.";
                    document.getElementById("additional-tips").textContent = content.additionalTips || "추가적인 팁 없음";
                } catch (error) {
                    console.error("Error parsing ultraviolet data:", error);
                    document.getElementById("uv-info").textContent = "데이터를 처리하는 중 오류가 발생했습니다.";
                }
            } else {
                // 데이터가 없을 경우 기본 메시지 표시
                document.getElementById("uv-info").textContent = "저장된 자외선 정보가 없습니다.";
                document.getElementById("recommendation-info").textContent = "";
                document.getElementById("additional-tips").textContent = "";
            }
        })
        .catch(error => {
            console.error("Error fetching ultraviolet information:", error);
            document.getElementById("uv-info").textContent = "자외선 데이터를 불러오지 못했습니다.";
        });
});
