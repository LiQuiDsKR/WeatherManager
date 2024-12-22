package com.liquidskr.dto;

public class CommentDTO {
    private int id; // 댓글 ID
    private String commentAuthorNickname; // 댓글 작성자 닉네임
    private String commentContent; // 댓글 내용
    private int likes; // 좋아요 수
    private String commentCreatedAt; // 댓글 작성 시간 (추가)

    // Getter & Setter for id
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // Getter & Setter for commentAuthorNickname
    public String getCommentAuthorNickname() {
        return commentAuthorNickname;
    }

    public void setCommentAuthorNickname(String commentAuthorNickname) {
        this.commentAuthorNickname = commentAuthorNickname;
    }

    // Getter & Setter for commentContent
    public String getCommentContent() {
        return commentContent;
    }

    public void setCommentContent(String commentContent) {
        this.commentContent = commentContent;
    }

    // Getter & Setter for likes
    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    // Getter & Setter for commentCreatedAt (추가)
    public String getCommentCreatedAt() {
        return commentCreatedAt;
    }

    public void setCommentCreatedAt(String commentCreatedAt) {
        this.commentCreatedAt = commentCreatedAt;
    }
}
