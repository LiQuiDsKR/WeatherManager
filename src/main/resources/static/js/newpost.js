document.addEventListener("DOMContentLoaded", function () {
    const recommendationData = sessionStorage.getItem("recommendationData");

    resetForm()

    // JSON 데이터 파싱
    // JSON 데이터 파싱 및 null 처리
        let data = {};
        if (recommendationData) {
            try {
                data = JSON.parse(recommendationData);
            } catch (e) {
                console.error("Failed to parse recommendationData:", e);
            }
        }

        // 데이터 구조 분해 할당 (기본값 설정)
        const { title = "", description = "", items = [] } = data;

    // 제목 및 설명 채우기
    document.querySelector('input[placeholder="의상 세트 제목을 입력하세요"]').value = title || "";
    document.querySelector('textarea[placeholder="의상 세트와 관련된 설명을 입력하세요"]').value = description || "";

    // 아이템 리스트 채우기
    const itemList = document.getElementById("item-list");
    if (Array.isArray(items) && items.length > 0) {
        items.forEach((item, index) => {
            const newItem = createItemElement(index + 1, item.name, item.type, item.description);
            itemList.appendChild(newItem);
        });
    } else {
        // 아이템이 없으면 기본적으로 하나의 빈 아이템 추가
        addItem();
    }

    // 글 업로드 기능
    const uploadButton = document.querySelector('.upload-btn');
    uploadButton.addEventListener('click', function () {
        const authorName = document.getElementById('author-name').value.trim();
        const title = document.querySelector('input[placeholder="의상 세트 제목을 입력하세요"]').value.trim();
        const description = document.querySelector('textarea[placeholder="의상 세트와 관련된 설명을 입력하세요"]').value.trim();

        // 아이템 리스트 가져오기
        const items = Array.from(document.querySelectorAll('.item')).map(item => ({
            name: item.querySelector('input[placeholder="아이템 이름"]').value.trim(),
            type: item.querySelector('input[placeholder="아이템 분류"]').value.trim(),
            description: item.querySelector('input[placeholder="아이템 설명"]').value.trim(),
        }));

        if (!title || !description || items.length === 0) {
            alert('제목, 설명, 또는 아이템이 비어있습니다. 모두 작성해주세요.');
            return;
        }

        fetch('/api/posts')
            .then(response => response.json())
            .then(posts => {
                const newId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;

                const postData = {
                    id: newId,
                    authorNickname: authorName || "익명",
                    title: title,
                    content: description,
                    coordinate: {
                        title: title,
                        description: description,
                        items: items,
                    },
                    likes: 0,
                    views: 0,
                    createdAt: new Date().toISOString(),
                    comments: [],
                };

                // 게시글 업로드
                fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to upload post');
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert('게시글이 성공적으로 업로드되었습니다!');
                        window.location.href = '/html/board.html';
                    })
                    .catch(error => {
                        console.error('Error uploading post:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching posts for ID generation:', error);
            });
    });
});
// 모든 입력폼 비우기
function resetForm() {
    // 제목 및 설명 초기화
    document.querySelector('input[placeholder="의상 세트 제목을 입력하세요"]').value = '';
    document.querySelector('textarea[placeholder="의상 세트와 관련된 설명을 입력하세요"]').value = '';
    document.getElementById('author-name').value = '';

    // 아이템 리스트 초기화
    const itemList = document.getElementById('item-list');
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // 빈 아이템 하나 추가
    addItem();
}


// 아이템 추가 기능
function addItem() {
    const itemList = document.getElementById("item-list");
    const itemCount = itemList.children.length + 1; // 현재 아이템 수를 기준으로 번호 계산
    const newItem = createItemElement(itemCount);
    itemList.appendChild(newItem); // 새로운 아이템 추가
    updateItemNumbers(); // 아이템 번호 업데이트
}

// 아이템 삭제 기능
function deleteItem(button) {
    const item = button.parentElement; // 삭제 버튼의 부모 요소(아이템)
    const itemList = document.getElementById("item-list");

    // 아이템 수가 1개일 경우 삭제하지 않음
    if (itemList.children.length > 1) {
        item.remove(); // 아이템 삭제
        updateItemNumbers(); // 아이템 번호 업데이트
    } else {
        alert("최소 1개의 아이템이 존재해야 합니다."); // 경고 메시지
    }
}

// 아이템 번호 업데이트
function updateItemNumbers() {
    const items = document.querySelectorAll(".item");
    items.forEach((item, index) => {
        item.querySelector("span").textContent = `아이템 ${index + 1}`; // 아이템 번호 업데이트
    });
}

// 아이템 엘리먼트 생성
function createItemElement(index, name = "", type = "", description = "") {
    const newItem = document.createElement("div");
    newItem.className = "item";
    newItem.innerHTML = `
        <span>아이템 ${index}</span>
        <input type="text" value="${name}" placeholder="아이템 이름">
        <input type="text" value="${type}" placeholder="아이템 분류">
        <input type="text" value="${description}" placeholder="아이템 설명">
        <button class="delete-btn" onclick="deleteItem(this)">삭제</button>
    `;
    return newItem;
}
