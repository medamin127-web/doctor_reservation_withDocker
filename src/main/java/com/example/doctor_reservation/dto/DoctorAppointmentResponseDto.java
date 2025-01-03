package com.example.doctor_reservation.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DoctorAppointmentResponseDto {
    private Long appointmentId;
    private LocalDateTime appointmentDateTime;
    private String status;
    private PatientDetailsDto patient;


    @Data
    @Builder
    public static class PatientDetailsDto {
        private Long patientId;
        private String patientName;
        private String patientEmail;
    }
}
