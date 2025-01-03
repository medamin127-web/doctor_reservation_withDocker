package com.example.doctor_reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDto {
    private Long id;

    private String fullName;
    private String specialization;
    private String qualification;
    private Long userId;

    private List<Long> departmentIds;// This should be populated from the frontend
}