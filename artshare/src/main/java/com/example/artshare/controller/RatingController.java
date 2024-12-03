package com.example.artshare.controller;

import com.example.artshare.model.Painting;
import com.example.artshare.model.Rating;
import com.example.artshare.model.User;
import com.example.artshare.model.UserPrincipal;
import com.example.artshare.service.PaintingService;
import com.example.artshare.service.RatingService;
import com.example.artshare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;
    private final UserService userService;
    private final PaintingService paintingService;

    @Autowired
    public RatingController(RatingService ratingService, UserService userService, PaintingService paintingService) {
        this.ratingService = ratingService;
        this.userService = userService;
        this.paintingService = paintingService;
    }

    @PostMapping("/{paintingId}/{username}")
    public ResponseEntity<Rating> addRating(@RequestBody Rating rating,
                                            @PathVariable String username,
                                            @PathVariable Long paintingId) {
        try {

            Painting painting = paintingService.getPaintingById(paintingId);
            User user = userService.getUserByName(username);


            Rating existingRating = ratingService.findByUserAndPainting(user, painting);

            if (existingRating != null) {

                existingRating.setScore(rating.getScore());
                Rating updatedRating = ratingService.saveRating(existingRating);
                return new ResponseEntity<>(updatedRating, HttpStatus.OK);
            } else {

                rating.setPainting(painting);
                rating.setUser(user);
                Rating savedRating = ratingService.saveRating(rating);
                return new ResponseEntity<>(savedRating, HttpStatus.CREATED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Delete a rating
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long id) {
        try {
            Rating rating = ratingService.updateRating(id, null); // Check existence
            ratingService.deleteRating(rating);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Update a rating
    @PutMapping("/{id}")
    public ResponseEntity<Rating> updateRating(@PathVariable Long id, @RequestBody Rating ratingData) {
        try {
            Rating updatedRating = ratingService.updateRating(id, ratingData);
            return ResponseEntity.ok(updatedRating);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Get all ratings of a painting
    @GetMapping("/painting/{paintingId}")
    public ResponseEntity<List<Rating>> getRatingsByPainting(@PathVariable Long paintingId) {
        try {
            List<Rating> ratings = ratingService.getAllRatingsOfPainting(paintingId);
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
