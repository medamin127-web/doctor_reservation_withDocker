package com.example.doctor_reservation.controller;

import com.example.doctor_reservation.dto.DoctorDto;
import com.example.doctor_reservation.dto.UserDto;
import com.example.doctor_reservation.dto.UserRegistrationDto;
import com.example.doctor_reservation.entity.User;
import com.example.doctor_reservation.entity.UserRole;
import com.example.doctor_reservation.repository.DoctorRepository;
import com.example.doctor_reservation.repository.UserRepository;
import com.example.doctor_reservation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<User> registerUser(
            @ModelAttribute UserRegistrationDto userRegistrationDto,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture

    ) {
        User registeredUser = userService.registerUser(userRegistrationDto, profilePicture);
        return ResponseEntity.ok(registeredUser);
    }


    @GetMapping("/{username}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR')")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.findByUsername(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}/profile-picture")
    public ResponseEntity<User> uploadProfilePicture(@PathVariable Long userId, @RequestParam MultipartFile file) {
        String profilePictureUrl = "mockUrl"; // Implement file upload logic
        User updatedUser = userService.updateProfilePicture(userId, profilePictureUrl);
        return ResponseEntity.ok(updatedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{userId}/promoteToAdmin")
    public ResponseEntity<User> promoteToAdmin(@PathVariable Long userId) {
        User promotedUser = userService.promoteToAdmin(userId);
        return ResponseEntity.ok(promotedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{userId}/promoteToDoctor")
    public ResponseEntity<User> promoteToDoctor(@PathVariable Long userId,
                                                @RequestParam String specialization,
                                                @RequestParam String qualification,
                                                @RequestParam Long departmentId) {
        User promotedUser = userService.promoteToDoctor(userId, specialization, qualification, departmentId);
        return ResponseEntity.ok(promotedUser);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Fetch all users with role 'PATIENT'
    @GetMapping("/patients")
    public List<UserDto> getAllPatients() {
        List<User> patients = userRepository.findByRole(UserRole.PATIENT);
        return patients.stream()
                .map(user -> {
                    UserDto userDto = new UserDto();
                    userDto.setId(user.getId());
                    userDto.setFullName(user.getFullName());
                    userDto.setUsername(user.getUsername());
                    userDto.setEmail(user.getEmail());
                    userDto.setRole(user.getRole());
                    userDto.setProfilePictureUrl(user.getProfilePictureUrl());
                    return userDto;
                })
                .collect(Collectors.toList());
    }

    // Fetch all users with role 'DOCTOR'
    @GetMapping("/doctors")
    public List<UserDto> getAllDoctors() {
        List<User> doctors = userRepository.findByRole(UserRole.DOCTOR);
        return doctors.stream()
                .map(user -> {
                    UserDto userDto = new UserDto();
                    userDto.setId(user.getId());
                    userDto.setFullName(user.getFullName());
                    userDto.setUsername(user.getUsername());
                    userDto.setEmail(user.getEmail());
                    userDto.setRole(user.getRole());
                    userDto.setProfilePictureUrl(user.getProfilePictureUrl());
                    return userDto;
                })
                .collect(Collectors.toList());
    }
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
    }
}
