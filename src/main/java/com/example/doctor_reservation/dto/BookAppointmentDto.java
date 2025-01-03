package com.example.doctor_reservation.dto;

// BookAppointmentDto


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookAppointmentDto {
    private Long patientId;
    private Long doctorId;
    private String dateTime; // Format: yyyy-MM-ddTHH:mm
}
