package com.example.artshare.controller;

import com.example.artshare.dto.UserDTO;
import com.example.artshare.model.Role;
import com.example.artshare.model.User;
import com.example.artshare.service.JWTService;
import com.example.artshare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    private UserService userService;
   private JWTService jwtService;
    private AuthenticationManager authenticationManager;




    @Autowired
    public void setJwtService(JWTService jwtService) {
        this.jwtService = jwtService;
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.register(user);
        return new ResponseEntity<>(registeredUser,HttpStatus.CREATED);
    }

    @DeleteMapping("users/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("users/{username}")
    public ResponseEntity<User> updateUser(@PathVariable String username, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(username, user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/users/{username}")
    public UserDTO findUserByUsername(@PathVariable String username) {
        return userService.getUserByNameDTO(username);
    }

    @PutMapping("/users/role/{userId}")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable Long userId) {

        return new ResponseEntity<>(userService.updateRole(userId),HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginUser) {

        return ResponseEntity.ok(userService.verifyUser(loginUser.getUsername(), loginUser.getPassword()));
    }

    @GetMapping("{username}/role")
    public Role getUserRole(@PathVariable String username) {
        return userService.getUsersRole(username);
    }




    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
}
