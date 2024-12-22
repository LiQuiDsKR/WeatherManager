document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/posts') // API 엔드포인트를 설정합니다.
        .then(response => response.json())
        .then(posts => {
            const postContainer = document.getElementById('post-container');
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <div class="post-header">
                        <h2>${post.title}</h2>
                        <p>${post.content}</p>
                        <span class="views">조회수: ${post.views}</span>
                    </div>
                    <div class="reaction">
                        <button class="like-btn" disabled>❤️ ${post.likes}</button>
                        <button class="comment-btn"><i class="fas fa-comments"></i> ${post.comments.length}개 댓글</button>
                    </div>
                `;

                // 게시글 카드 클릭 시 post.html로 이동하고 ID 전달
                postElement.addEventListener('click', () => {
                    fetch(`/api/post/${post.id}/view`, { method: 'POST' }) // 조회수 증가 API
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to increment views');
                            }
                            return response.json();
                        })
                        .then(() => {
                            // 조회수 증가 성공 후 게시글 상세 페이지로 이동
                            window.location.href = `/html/post.html?id=${post.id}`;
                        })
                        .catch(error => console.error('Error incrementing views:', error));
                });

                postContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
});

// 새 글 작성 버튼 클릭 이벤트
document.querySelector('.share-btn').addEventListener('click', function () {
    // recommendationData 초기화
    sessionStorage.removeItem('recommendationData');

    // newpost.html로 이동
    window.location.href = 'newpost.html';
});
