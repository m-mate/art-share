package com.example.artshare.controller;

import com.example.artshare.model.Comment;
import com.example.artshare.service.CommentService;
import com.example.artshare.service.PaintingService;
import com.example.artshare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private  CommentService commentService;

    private  PaintingService paintingService;

    private  UserService userService;

    @Autowired
    public void setCommentService(CommentService commentService) {
        this.commentService = commentService;
    }

    @Autowired
    public void setPaintingService(PaintingService paintingService) {
        this.paintingService = paintingService;
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    // Create a new comment
    @PostMapping("/painting/{paintingId}/{username}")
    public ResponseEntity<Comment> createComment(@PathVariable Long paintingId, @PathVariable String username, @RequestBody Comment comment) {
        comment.setAuthor(userService.getUserByName(username));
        comment.setPainting(paintingService.getPaintingById(paintingId));
        Comment savedComment = commentService.saveComment(comment);
        return ResponseEntity.ok(savedComment);
    }

    // Update a comment
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable Long id, @RequestBody Comment commentDetails) {
        Comment updatedComment = commentService.updateComment(id, commentDetails);
        return ResponseEntity.ok(updatedComment);
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        Comment commentToDelete = commentService.updateComment(id, new Comment()); // Ensure comment exists
        commentService.deleteComment(commentToDelete);
        return ResponseEntity.noContent().build();
    }

    // Get all comments for a user
    @GetMapping("/painting/{paintingId}")
    public ResponseEntity<List<Comment>> getAllCommentsByUser(@PathVariable Long paintingId) {
        List<Comment> comments = commentService.getAllCommentsOfPainting(paintingId);
        return ResponseEntity.ok(comments);
    }
}
