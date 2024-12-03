package com.example.artshare.repo;

import com.example.artshare.model.Painting;
import com.example.artshare.model.Rating;
import com.example.artshare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByPaintingId(Long paintingId);

    Rating findByUserAndPainting(User user, Painting painting);

}
