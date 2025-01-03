package com.example.doctor_reservation.service;

import com.example.doctor_reservation.dto.UserRegistrationDto;
import com.example.doctor_reservation.entity.Department;
import com.example.doctor_reservation.entity.Doctor;
import com.example.doctor_reservation.entity.User;
import com.example.doctor_reservation.entity.UserRole;
import com.example.doctor_reservation.repository.DoctorRepository;
import com.example.doctor_reservation.repository.UserRepository;
import com.example.doctor_reservation.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.doctor_reservation.repository.DepartmentRepository;


import java.io.File;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired

    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public User registerUser(UserRegistrationDto userDto, MultipartFile profilePicture) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists.");
        }
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists.");
        }

        User user = User.builder()
                .fullName(userDto.getFullName())
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .role(userDto.getRole())
                .build();

        // Handle profile picture
        if (profilePicture != null && !profilePicture.isEmpty()) {
            String profilePictureUrl = saveProfilePicture(profilePicture);
            user.setProfilePictureUrl(profilePictureUrl);
        }

        return userRepository.save(user);
    }

    private String saveProfilePicture(MultipartFile file) {
        try {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String uploadDir = "C:\\Users\\Asus\\Documents\\Doctor_Reservation\\upload"; // Set your upload directory
            File destination = new File(uploadDir + "/" + filename);
            file.transferTo(destination);
            return "/uploads/" + filename;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save profile picture", e);
        }
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User updateProfilePicture(Long userId, String profilePictureUrl) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found."));
        user.setProfilePictureUrl(profilePictureUrl);
        return userRepository.save(user);
    }


    public User promoteToAdmin(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (user.getRole() == UserRole.PATIENT) {
            user.setRole(UserRole.ADMIN);
            return userRepository.save(user);
        }
        throw new IllegalArgumentException("User is not a patient.");
    }

    public User promoteToDoctor(Long userId, String specialization, String qualification, Long departmentId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found."));
        if (user.getRole() == UserRole.PATIENT) {
            // Create and set the doctor entity (assuming Doctor is another entity)
            Doctor doctor = new Doctor();
            doctor.setUser(user);  // Link the doctor to the user
            doctor.setSpecialization(specialization);
            doctor.setQualification(qualification);

            // Wrap the department in a list
            Department department = departmentRepository.findById(departmentId).orElseThrow(() -> new IllegalArgumentException("Department not found"));
            doctor.setDepartments(List.of(department));  // Set the department as a list

            user.setRole(UserRole.DOCTOR);
            userRepository.save(user);
            doctorRepository.save(doctor);  // Save the doctor entity
            return user;
        }
        throw new IllegalArgumentException("User is not a patient.");
    }


    public String authenticate(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            // Include fullName in the token
            return jwtUtil.generateToken(username, user.get().getFullName(),user.get().getId());
        }

        throw new RuntimeException("Invalid username or password");
    }
}
