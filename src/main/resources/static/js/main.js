function setCity(cityName) {
    const cityInput = document.querySelector("input[name='city']");

    // 지역 이름을 영문으로 매핑
    const cityMap = {
        "서울": "Seoul",
        "부산": "Busan",
        "인천": "Incheon",
        "대구": "Daegu",
        "광주": "Gwangju",
        "대전": "Daejeon",
        "울산": "Ulsan"
    };

    cityInput.value = cityMap[cityName] || cityName; // 매핑된 영문 이름, 없으면 그대로 사용
}

async function fetchWeather() {
    const city = document.querySelector("input[name='city']").value;
    try {
        const response = await fetch(`/api/weather?city=${city}`);
        if (!response.ok) {
            throw new Error("날씨 데이터를 가져오는데 실패했습니다.");
        }

        const data = await response.json();

        // 날씨 데이터를 sessionStorage에 저장
        sessionStorage.setItem("weatherData", JSON.stringify(data));
        console.log("Saved Weather Data:", sessionStorage.getItem("weatherData"));


        // 화면에 날씨 정보 업데이트
        updateWeatherUI(data);
    } catch (error) {
        alert("날씨 데이터를 가져오는 데 문제가 발생했습니다.");
        console.error(error);
    }
}

function updateWeatherUI(data) {
    // 기온
    if (data.main?.temp !== undefined) {
        document.getElementById("temp").textContent = `${data.main.temp}°C`;
    }

    // 체감 온도
    if (data.main?.feels_like !== undefined) {
        document.getElementById("feels-like").textContent = `${data.main.feels_like}°C`;
    }

    // 습도
    if (data.main?.humidity !== undefined) {
        document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    }

    // 바람속도
    if (data.wind?.speed !== undefined) {
        document.getElementById("wind-speed").textContent = `${data.wind.speed} m/s`;
    }

    // 바람 방향
    if (data.wind?.deg !== undefined) {
        document.getElementById("wind-deg").textContent = `${data.wind.deg}°`;
    }

    // 구름량
    if (data.clouds?.all !== undefined) {
        document.getElementById("clouds").textContent = `${data.clouds.all}%`;
    }

    // 날씨 설명
    if (data.weather?.[0]?.description !== undefined) {
        document.getElementById("description").textContent = data.weather[0].description;
    }

    // 일출
    if (data.sys?.sunrise !== undefined) {
        document.getElementById("sunrise").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    }

    // 일몰
    if (data.sys?.sunset !== undefined) {
        document.getElementById("sunset").textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    }
}

// 추천 옷차림 페이지로 이동
function navigateToRecommendation() {
    const weatherData = sessionStorage.getItem("weatherData");
    console.log("Weather Data before navigation:", weatherData);

    if (!weatherData) {
        alert("날씨 정보를 먼저 검색해야 추천 옷차림을 볼 수 있습니다.");
        return;
    }

    window.location.href = "/html/recommend.html";
}
