package com.example.artshare.service;

import com.example.artshare.model.Comment;
import com.example.artshare.repo.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    CommentRepository commentRepository;
    private UserService userService;
    private PaintingService paintingService;


    @Autowired
    public void setCommentRepository(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public void deleteComment(Comment comment) {
        commentRepository.delete(comment);
    }

    public Comment updateComment(Long id, Comment commentDetails) {
        Optional<Comment> commentOptional = commentRepository.findById(id);

        if (commentOptional.isPresent()) {
            Comment existingComment = commentOptional.get();
            existingComment.setContent(commentDetails.getContent());
            existingComment.setModified(true);
            return commentRepository.save(existingComment);
        }else {
            throw new RuntimeException("Comment not found with id " + id);
        }
    }

    public List<Comment> getAllCommentsOfUser(Long userId) {
        return commentRepository.findByAuthor_Id(userId);
    }

    public List<Comment> getAllCommentsOfPainting(Long paintingId) {
        return commentRepository.findByPainting_Id(paintingId);
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setPaintingService(PaintingService paintingService) {
        this.paintingService = paintingService;
    }
}
