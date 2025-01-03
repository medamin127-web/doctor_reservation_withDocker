package com.example.doctor_reservation.controller;

import com.example.doctor_reservation.dto.BookAppointmentDto;
import com.example.doctor_reservation.dto.DoctorAppointmentResponseDto;
import com.example.doctor_reservation.entity.Appointment;
import com.example.doctor_reservation.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody BookAppointmentDto bookAppointmentDto) {
        Appointment appointment = appointmentService.bookAppointment(bookAppointmentDto);
        return ResponseEntity.ok(appointment);
    }


    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsForPatient(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentService.getAppointmentsForPatient(patientId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsForDoctor(@PathVariable Long doctorId) {
        List<Appointment> appointments = appointmentService.getAppointmentsForDoctor(doctorId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}/availability")
    public ResponseEntity<Map<LocalDate, List<LocalTime>>> getDoctorAvailability(@PathVariable Long doctorId) {
        Map<LocalDate, List<LocalTime>> availability = appointmentService.getAllAppointmentsForDoctor(doctorId);
        return ResponseEntity.ok(availability);
    }



    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<Void> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @RequestParam("status") String status) {
        appointmentService.updateAppointmentStatus(appointmentId, status);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/doctor/{doctorId}/today")
    public ResponseEntity<List<DoctorAppointmentResponseDto>> getTodaysAppointments(@PathVariable Long doctorId) {
        List<DoctorAppointmentResponseDto> appointments = appointmentService.getTodaysAppointments(doctorId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}/history")
    public ResponseEntity<List<DoctorAppointmentResponseDto>> getCompletedAppointments(@PathVariable Long doctorId) {
        List<DoctorAppointmentResponseDto> appointments = appointmentService.getCompletedAppointments(doctorId);
        return ResponseEntity.ok(appointments);
    }

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long appointmentId) {
        appointmentService.cancelAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }
}

