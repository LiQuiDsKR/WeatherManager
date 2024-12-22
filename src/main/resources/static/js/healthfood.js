document.addEventListener("DOMContentLoaded", function () {
    const weatherData = sessionStorage.getItem("weatherData");

    if (!weatherData) {
        alert("날씨 정보를 불러올 수 없습니다.");
        document.getElementById("food-description").textContent = "날씨 데이터를 불러오지 못했습니다.";
        return;
    }

    fetch("/api/seasonaryfood", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: weatherData, // JSON 데이터 전송
    })
        .then(response => response.json())
        .then(data => {
            console.log("Response data:", data);

            // OpenAI 응답에서 content 필드를 가져옴
            let rawContent = data.choices[0]?.message?.content;
            if (!rawContent) {
                document.getElementById("food-description").textContent = "응답 데이터가 없습니다.";
                return;
            }

            // JSON 파싱 전 데이터 클린업
            let content;
            try {
                // 문제 있는 JSON 문자열 정리
                const cleanedContent = rawContent
                    .replace(/[\u2018\u2019]/g, "'") // 이상한 따옴표 처리
                    .replace(/[\u201C\u201D]/g, '"') // 이상한 쌍따옴표 처리
                    .replace(/[\n\r]/g, ""); // 불필요한 줄바꿈 제거

                content = JSON.parse(cleanedContent); // 클린업 후 JSON 파싱
            } catch (error) {
                console.error("Error parsing OpenAI response content:", error);
                document.getElementById("food-description").textContent = "데이터 처리 중 오류가 발생했습니다.";
                return;
            }

            // 데이터 렌더링
            const descriptionElement = document.getElementById("food-description");
            const foodListElement = document.getElementById("food-list");

            descriptionElement.textContent = content.description || "추천 정보를 불러오지 못했습니다.";

            // 음식 목록 렌더링
            foodListElement.innerHTML = ""; // 기존 리스트 초기화
            (content.foods || []).forEach(food => {
                const li = document.createElement("li");
                li.textContent = `${food.name}: ${food.benefit}`;
                foodListElement.appendChild(li);
            });

            // 추천 데이터를 세션에 저장
            sessionStorage.setItem("seasonaryFoodInfo", JSON.stringify(content));
        })
        .catch(error => {
            console.error("Error fetching seasonary food information:", error);
            document.getElementById("food-description").textContent = "음식 데이터를 불러오지 못했습니다.";
        });
});
