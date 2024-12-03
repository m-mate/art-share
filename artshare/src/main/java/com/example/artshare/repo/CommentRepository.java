package com.example.artshare.repo;

import com.example.artshare.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {



    List<Comment> findByAuthor_Id(Long userId);

    List<Comment> findByPainting_Id(Long paintingId);

}
