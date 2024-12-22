package com.liquidskr.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class PostDTO {
    private int id;
    private String authorNickname;
    private String title;
    private String content;
    private ItemSetDTO coordinate; // 추가된 필드
    private int likes;
    private int views;
    private String createdAt;
    private List<CommentDTO> comments;

    // Getters and Setters

    @JsonProperty("authorNickname")
    public String getAuthorNickname() {
        return authorNickname;
    }

    public void setAuthorNickname(String authorNickname) {
        this.authorNickname = authorNickname;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ItemSetDTO getCoordinate() {
        return coordinate;
    }

    public void setCoordinate(ItemSetDTO coordinate) {
        this.coordinate = coordinate;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public List<CommentDTO> getComments() {
        return comments;
    }

    public void setComments(List<CommentDTO> comments) {
        this.comments = comments;
    }
}
