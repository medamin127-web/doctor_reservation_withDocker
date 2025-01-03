package com.example.doctor_reservation.controller;

import com.example.doctor_reservation.dto.AuthRequest;
import com.example.doctor_reservation.dto.AuthResponse;
import com.example.doctor_reservation.entity.User;
import com.example.doctor_reservation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.doctor_reservation.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        String token = userService.authenticate(request.getUsername(), request.getPassword());

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name()));
    }
}
