package com.example.doctor_reservation.repository;

import com.example.doctor_reservation.entity.User;
import com.example.doctor_reservation.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // Custom method to find users by role
    List<User> findByRole(UserRole role);
}
