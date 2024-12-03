package com.example.artshare.service;

import com.example.artshare.model.Painting;
import com.example.artshare.model.Rating;
import com.example.artshare.model.User;
import com.example.artshare.repo.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    RatingRepository ratingRepository;
    private UserService userService;

    @Autowired
    public void setRatingRepository(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    public Rating saveRating(Rating rating) {

        return ratingRepository.save(rating);
    }

    public void deleteRating(Rating rating) {
        ratingRepository.delete(rating);
    }

    public Rating updateRating(Long id,Rating ratingData) {
        Optional<Rating> ratingOptional = ratingRepository.findById(id);
        if (ratingOptional.isPresent()) {
            Rating existingRating = ratingOptional.get();
            existingRating.setScore(ratingData.getScore());
            return ratingRepository.save(existingRating);
        }else {
            throw new RuntimeException("Rating not found with id " + id);
        }

    }

    public List<Rating> getAllRatingsOfPainting(Long paintingId) {
        return ratingRepository.findByPaintingId(paintingId);
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    public Rating findByUserAndPainting(User user, Painting painting) {
        return ratingRepository.findByUserAndPainting(user, painting);
    }
}
