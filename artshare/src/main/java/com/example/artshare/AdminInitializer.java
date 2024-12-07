package com.example.artshare;

import com.example.artshare.model.Role;
import com.example.artshare.model.User;
import com.example.artshare.repo.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(8);



    @Value("${admin.username:admin}")
    private String adminUsername;

    @Value("${admin.password:admin123}")
    private String adminPassword;

    public AdminInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;

    }

    @Override
    public void run(String... args) {
        User existingAdmin = userRepository.findByUsername(adminUsername);
        if (existingAdmin == null) {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setPassword(encoder.encode(adminPassword));
            admin.setRole(Role.ROLE_ADMIN); // Set the role as admin

            userRepository.save(admin);
            System.out.println("Admin user created: " + adminUsername);
        } else {
            System.out.println("Admin user already exists.");
        }
    }
}

