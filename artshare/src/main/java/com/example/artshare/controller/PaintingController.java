package com.example.artshare.controller;

import com.example.artshare.model.Painting;
import com.example.artshare.model.User;
import com.example.artshare.model.UserPrincipal;
import com.example.artshare.service.PaintingService;
import com.example.artshare.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/paintings")
public class PaintingController {
    PaintingService paintingService;
    private UserService userService;

    @Autowired
    public void setPaintingService(PaintingService paintingService) {
        this.paintingService = paintingService;
    }

    @PostMapping(path ="/add-painting/{username}",consumes = {"multipart/form-data"})
    public ResponseEntity<Painting> addPainting(@RequestParam("painting") String paintingJson,
                                                @RequestParam("image") MultipartFile imageFile,
                                                @PathVariable String username) {
        Painting painting =convertJsonToPainting(paintingJson);
        Long userId = userService.getUserByName(username).getId();
        paintingService.savePainting(painting, userId,imageFile);
        return ResponseEntity.ok(painting);

    }

    @GetMapping("/{paintingId}")
    public ResponseEntity<Painting> getPainting(@PathVariable Long paintingId) {
        Painting painting = paintingService.getPaintingById(paintingId);
        return ResponseEntity.ok(painting);
    }

    // Get all paintings
    @GetMapping
    public ResponseEntity<List<Painting>> getAllPaintings() {
        List<Painting> paintings = paintingService.findAllPaintings();
        return ResponseEntity.ok(paintings);
    }

    // Get paintings by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Painting>> getPaintingsByUser(@PathVariable Long userId) {
        try {
            User user = userService.getUser(userId);
            List<Painting> paintings = paintingService.findPaintingByUser(user);
            return ResponseEntity.ok(paintings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Update a painting
    @PutMapping("/{id}")
    public ResponseEntity<Painting> updatePainting(@PathVariable Long id, @RequestBody Painting paintingDetails) {
        try {
            Painting updatedPainting = paintingService.updatePainting(id, paintingDetails);
            return ResponseEntity.ok(updatedPainting);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Delete a painting
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePainting(@PathVariable Long id) {
        Painting paintingOptional = paintingService.getPaintingById(id);
        if (paintingOptional == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        paintingService.deletePainting(paintingOptional);
        return ResponseEntity.noContent().build();
    }

    private Painting convertJsonToPainting(String json) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(json, Painting.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert JSON to Painting", e);
        }
    }


    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
}
