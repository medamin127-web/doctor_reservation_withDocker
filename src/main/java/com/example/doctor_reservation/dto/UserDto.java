package com.example.doctor_reservation.dto;

import com.example.doctor_reservation.entity.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {

    private Long id;
    private String fullName;
    private String username;
    private String email;
    private UserRole role;
    private String profilePictureUrl;
}