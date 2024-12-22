package com.liquidskr.controller;

import com.liquidskr.dto.CommentDTO;
import com.liquidskr.service.BoardService;
import com.liquidskr.dto.PostDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class BoardController {

    private final BoardService boardService;

    // Constructor-based Dependency Injection
    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/posts")
    public List<PostDTO> getPosts() {
        // Spring Boot automatically converts the return value to JSON
        return boardService.getAllPosts();
    }

    // 게시글 상세 조회
    @GetMapping("/post/{id}")
    public PostDTO getPostById(@PathVariable int id) {
        PostDTO post = boardService.getPostById(id);
        if (post == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        return post;
    }

    // 게시글 작성
    @PostMapping("/posts")
    public PostDTO createPost(@RequestBody PostDTO newPost) {
        PostDTO createdPost = boardService.createPost(newPost);
        if (createdPost == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create post");
        }
        return createdPost;
    }

    // 조회수 증가
    @PostMapping("/post/{id}/view")
    public PostDTO incrementViews(@PathVariable int id) {
        PostDTO updatedPost = boardService.incrementViews(id);
        if (updatedPost == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        return updatedPost;
    }

    // 좋아요 증가
    @PostMapping("/post/{id}/like")
    public PostDTO increaseLike(@PathVariable int id) {
        PostDTO updatedPost = boardService.incrementLikes(id);
        if (updatedPost == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        return updatedPost;
    }

    // 댓글 작성
    @PostMapping("/post/{id}/comment")
    public CommentDTO addComment(@PathVariable int id, @RequestBody CommentDTO newComment) {
        CommentDTO addedComment = boardService.addCommentToPost(id, newComment);
        if (addedComment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }
        return addedComment;
    }

    // 댓글 좋아요
    @PostMapping("/comment/{id}/like")
    public CommentDTO likeComment(@PathVariable int id) {
        CommentDTO updatedComment = boardService.likeComment(id);
        if (updatedComment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }
        return updatedComment;
    }
}
