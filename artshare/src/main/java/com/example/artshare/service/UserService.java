package com.example.artshare.service;

import com.example.artshare.dto.UserDTO;
import com.example.artshare.model.Role;
import com.example.artshare.model.User;
import com.example.artshare.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class UserService {
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(8);

    private UserRepository userRepository;

    private JWTService jwtService;
    @Autowired
    public void setJwtService(JWTService jwtService) {
        this.jwtService = jwtService;
    }

    private AuthenticationManager authenticationManager;

    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }

    public User updateUser(String username, User user) {
        User userOptional = userRepository.findByUsername(username);

        if(userOptional != null) {
            if (!user.getPassword().isEmpty()) {
                userOptional.setPassword(encoder.encode(user.getPassword()));
            }
            userOptional.setEmail(user.getEmail());
            userOptional.setFirstName(user.getFirstName());
            userOptional.setLastName(user.getLastName());
            userOptional.setUsername(user.getUsername());

            return userRepository.save(userOptional);
        }else {
            throw new RuntimeException("User not found");
        }



    }

    public User updateRole(Long id) {
        User user = userRepository.findById(id).get();
        Role currentRole = user.getRole();
        if(currentRole == Role.ROLE_ADMIN) {
            user.setRole(Role.ROLE_USER);
        }else {
            user.setRole(Role.ROLE_ADMIN);
        }
        return userRepository.save(user);
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user-> new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole())).collect(Collectors.toList());
    }

    public String verifyUser(String username, String password) {
        Authentication authentication =
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,
                        password));
        User user = getUserByName(username);
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(username, user.getRole());
        }
        return "Fail";
    }

    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByName(String username) {
        return userRepository.findByUsername(username);
    }

    public UserDTO getUserByNameDTO(String username) {
        User user = userRepository.findByUsername(username);
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole());
    }

    public Role getUsersRole(String username) {
        return userRepository.findByUsername(username).getRole();
    }
}
