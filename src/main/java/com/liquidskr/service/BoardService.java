package com.liquidskr.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.liquidskr.dto.CommentDTO;
import com.liquidskr.dto.PostDTO;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class BoardService {

    private static final String POSTS_JSON_PATH = "data/posts.json";

    public List<PostDTO> getAllPosts() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            File file = new ClassPathResource("data/posts.json").getFile();

            // 파일 경로 확인
            System.out.println("JSON 파일 경로: " + file.getAbsolutePath());

            // 데이터 로드 시 예외 처리 및 확인
            List<PostDTO> posts = objectMapper.readValue(file,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, PostDTO.class));

            // 로드된 데이터 출력
            posts.forEach(post -> System.out.println("로드된 게시글: " + post.getTitle()));
            return posts;
        } catch (Exception e) {
            // 예외 메시지 출력
            e.printStackTrace();
            return Collections.emptyList();
        }
    }


    public PostDTO getPostById(int id) {
        List<PostDTO> posts = getAllPosts();
        return posts.stream()
                .filter(post -> post.getId() == id) // ID로 필터링
                .findFirst()
                .orElse(null); // 없으면 null 반환
    }

    // 게시글 작성
    public PostDTO createPost(PostDTO newPost) {
        List<PostDTO> posts = getAllPosts();

        // 새로운 ID 설정
        int newId = posts.stream()
                .mapToInt(PostDTO::getId)
                .max()
                .orElse(0) + 1;
        newPost.setId(newId);

        // 기본값 설정
        newPost.setLikes(0);
        newPost.setViews(0);
        newPost.setCreatedAt(LocalDateTime.now().toString());
        newPost.setComments(new ArrayList<>());

        // 리스트에 추가
        posts.add(newPost);

        // JSON 파일 업데이트
        updatePostsJson(posts);

        return newPost;
    }

    // 조회수 증가
    public PostDTO incrementViews(int id) {
        List<PostDTO> posts = getAllPosts();
        PostDTO post = posts.stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElse(null);

        if (post == null) {
            return null;
        }

        // 조회수 1 증가
        post.setViews(post.getViews() + 1);

        // JSON 파일 업데이트
        updatePostsJson(posts);

        return post;
    }

    // 좋아요 증가
    public PostDTO incrementLikes(int id) {
        List<PostDTO> posts = getAllPosts();
        PostDTO post = posts.stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElse(null);

        if (post == null) {
            return null;
        }

        // 좋아요 수 증가
        post.setLikes(post.getLikes() + 1);

        // JSON 파일 업데이트
        updatePostsJson(posts);

        return post;
    }

    // JSON 파일 업데이트
    private void updatePostsJson(List<PostDTO> posts) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            File file = new ClassPathResource(POSTS_JSON_PATH).getFile();
            objectMapper.writeValue(file, posts);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public CommentDTO addCommentToPost(int postId, CommentDTO newComment) {
        List<PostDTO> posts = getAllPosts();
        PostDTO post = posts.stream()
                .filter(p -> p.getId() == postId)
                .findFirst()
                .orElse(null);

        if (post == null) {
            return null;
        }

        // 새로운 댓글 추가
        newComment.setId(post.getComments().size() + 1); // 댓글 ID 자동 생성
        newComment.setLikes(0); // 초기 좋아요 수
        post.getComments().add(newComment);

        // JSON 파일 업데이트
        updatePostsJson(posts);

        return newComment;
    }

    public CommentDTO likeComment(int commentId) {
        List<PostDTO> posts = getAllPosts();
        for (PostDTO post : posts) {
            for (CommentDTO comment : post.getComments()) {
                if (comment.getId() == commentId) {
                    // 좋아요 증가
                    comment.setLikes(comment.getLikes() + 1);
                    updatePostsJson(posts); // JSON 업데이트
                    return comment;
                }
            }
        }
        return null;
    }
}
