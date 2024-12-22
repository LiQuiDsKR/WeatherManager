document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        document.body.innerHTML = '<h1>게시글 ID가 없습니다.</h1>';
        return;
    }

    // API 호출로 게시글 데이터 가져오기
    fetch(`/api/post/${postId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Post not found');
            }
            return response.json();
        })
        .then(post => {
            console.log('Post Data:', post);

            // 제목, 내용, 조회수, 좋아요 수 반영
            document.getElementById('post-title').textContent = post.title;
            document.getElementById('post-content').textContent = post.content;
            document.getElementById('post-views').textContent = `조회수: ${post.views}`;

            // 작성자 닉네임 렌더링
            const authorElement = document.getElementById('author-name');
            if (post.authorNickname) {
                authorElement.textContent = post.authorNickname;
            } else {
                authorElement.textContent = '익명'; // 닉네임이 없는 경우 '익명'으로 표시
            }


            // 코디 데이터 렌더링
            const coordinate = post.coordinate;
            if (coordinate) {
                document.getElementById('coordinate-title').textContent = coordinate.title || '코디 정보';
                document.getElementById('coordinate-description').textContent = coordinate.description || '';
                const itemsContainer = document.getElementById('coordinate-items');
                coordinate.items.forEach(item => {
                    const itemElement = document.createElement('li');
                    itemElement.innerHTML = `
                        <strong>${item.name}</strong> (${item.type}): ${item.description}
                    `;
                    itemsContainer.appendChild(itemElement);
                });
            }

            // 좋아요 버튼 설정
            const likeButton = document.getElementById('like-btn');
            if (likeButton) {
                likeButton.textContent = `❤️ ${post.likes}`;
                likeButton.addEventListener('click', () => handlePostLike(postId, likeButton));
            }

            // 댓글 목록 추가
            const commentsList = document.getElementById('comments-list');
            post.comments.forEach(comment => addCommentToList(comment, commentsList));

            // 댓글 작성 기능 추가
            const submitCommentButton = document.getElementById('submit-comment');
            const commentAuthorInput = document.getElementById('comment-author');
            const commentContentInput = document.getElementById('comment-content');
            submitCommentButton.addEventListener('click', () => {
                const commentAuthor = commentAuthorInput.value.trim();
                const commentContent = commentContentInput.value.trim();

                if (!commentAuthor || !commentContent) {
                    alert('작성자와 댓글 내용을 입력하세요.');
                    return;
                }

                handleCommentSubmit(postId, commentAuthor, commentContent, commentsList, commentAuthorInput, commentContentInput);
            });
        })
        .catch(error => {
            console.error('Error fetching post:', error);
            document.body.innerHTML = '<h1>게시글을 불러올 수 없습니다.</h1>';
        });
});

/**
 * 게시글 좋아요 처리
 */
function handlePostLike(postId, likeButton) {
    fetch(`/api/post/${postId}/like`, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to like post');
            }
            return response.json();
        })
        .then(updatedPost => {
            likeButton.textContent = `❤️ ${updatedPost.likes}`;
        })
        .catch(error => console.error('Error liking post:', error));
}

/**
 * 댓글 추가
 */
function addCommentToList(comment, commentsList) {
    const commentItem = document.createElement('li');
    commentItem.innerHTML = `
        <span class="comment-author">${comment.commentAuthorNickname}</span>
        <span class="comment-content">${comment.commentContent}</span>
        <button class="like-comment-btn">❤️ ${comment.likes}</button>
    `;
    const likeButton = commentItem.querySelector('.like-comment-btn');
    likeButton.addEventListener('click', () => handleCommentLike(comment.id, likeButton));
    commentsList.appendChild(commentItem);
}

/**
 * 댓글 좋아요 처리
 */
function handleCommentLike(commentId, likeButton) {
    fetch(`/api/comment/${commentId}/like`, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to like comment');
            }
            return response.json();
        })
        .then(updatedComment => {
            likeButton.textContent = `❤️ ${updatedComment.likes}`;
        })
        .catch(error => console.error('Error liking comment:', error));
}

/**
 * 댓글 작성 처리
 */
function handleCommentSubmit(postId, commentAuthor, commentContent, commentsList, commentAuthorInput, commentContentInput) {
    fetch(`/api/post/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentAuthorNickname: commentAuthor, commentContent })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }
            return response.json();
        })
        .then(newComment => {
            addCommentToList(newComment, commentsList);
            commentAuthorInput.value = '';
            commentContentInput.value = '';
        })
        .catch(error => console.error('Error submitting comment:', error));
}
