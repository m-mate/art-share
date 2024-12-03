package com.example.artshare.repo;

import com.example.artshare.model.Painting;
import com.example.artshare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaintingRepository extends JpaRepository<Painting, Long> {

    List<Painting> findPaintingByPainter(User user);



}
