package com.example.artshare.service;

import com.example.artshare.model.Painting;
import com.example.artshare.model.User;
import com.example.artshare.repo.PaintingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class PaintingService {
    PaintingRepository paintingRepository;
    private UserService userService;

    @Autowired
    public void setPaintingRepository(PaintingRepository paintingRepository) {
        this.paintingRepository = paintingRepository;
    }

    public Painting savePainting(Painting painting, Long userId, MultipartFile image) {

        try {
            byte[] imageBytes = image.getBytes();
            painting.setImage(imageBytes);
            painting.setPainter(userService.getUser(userId));
            return paintingRepository.save(painting);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }


    }

    public Painting getPaintingById(Long id) {
        return paintingRepository.findById(id).orElse(null);
    }

    public List<Painting> findAllPaintings() {
        return paintingRepository.findAll();
    }

    public void deletePainting(Painting painting) {
        paintingRepository.delete(painting);
    }

    public Painting updatePainting(Long id,Painting paintingDetails) {
        Optional<Painting> paintingOptional = paintingRepository.findById(id);

        if (paintingOptional.isPresent()) {
            Painting existingPainting = paintingOptional.get();
            existingPainting.setTitle(paintingDetails.getTitle());
            existingPainting.setDescription(paintingDetails.getDescription());
            return paintingRepository.save(existingPainting);
        } else {
            throw new RuntimeException("Painting not found with ID: " + id);
        }
    }

    public List<Painting> findPaintingByUser(User user) {
        return paintingRepository.findPaintingByPainter(user);
    }


    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
}
