package com.example.doctor_reservation.service;

import com.example.doctor_reservation.dto.BookAppointmentDto;
import com.example.doctor_reservation.dto.DoctorAppointmentResponseDto;
import com.example.doctor_reservation.entity.Appointment;
import com.example.doctor_reservation.entity.AppointmentStatus;
import com.example.doctor_reservation.entity.Doctor;
import com.example.doctor_reservation.entity.User;
import com.example.doctor_reservation.repository.AppointmentRepository;
import com.example.doctor_reservation.repository.DoctorRepository;
import com.example.doctor_reservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    public Appointment bookAppointment(BookAppointmentDto bookAppointmentDto) {
        User patient = userRepository.findById(bookAppointmentDto.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found."));
        Doctor doctor = doctorRepository.findById(bookAppointmentDto.getDoctorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found."));

        LocalDateTime appointmentDateTime = LocalDateTime.parse(bookAppointmentDto.getDateTime());

        // Check doctor's availability
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorIdAndAppointmentDateTimeBetween(
                bookAppointmentDto.getDoctorId(),
                appointmentDateTime.minusMinutes(30),
                appointmentDateTime.plusMinutes(30)
        );
        if (!existingAppointments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Doctor is not available at the requested time.");
        }

        if (appointmentDateTime.isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot book an appointment in the past.");
        }

        if (appointmentDateTime.isAfter(LocalDateTime.now().plusMonths(3))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointments cannot be booked more than 3 months in advance.");
        }

        // Create and save the appointment
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDateTime(appointmentDateTime)
                .status(AppointmentStatus.SCHEDULED)
                .build();

        return appointmentRepository.save(appointment);
    }
    public List<Appointment> getAppointmentsForPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public Map<LocalDate, List<LocalTime>> getAllAppointmentsForDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);

        return appointments.stream()
                .collect(Collectors.groupingBy(
                        appointment -> appointment.getAppointmentDateTime().toLocalDate(),
                        Collectors.mapping(
                                appointment -> appointment.getAppointmentDateTime().toLocalTime(),
                                Collectors.toList()
                        )
                ));
    }


    public void updateAppointmentStatus(Long appointmentId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found."));
        appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase()));
        appointmentRepository.save(appointment);
    }

    public List<DoctorAppointmentResponseDto> getTodaysAppointments(Long doctorId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);

        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentDateTimeBetween(doctorId, startOfDay, endOfDay);

        return appointments.stream()
                .map(this::mapToDoctorAppointmentResponseDto)
                .collect(Collectors.toList());
    }

    public List<DoctorAppointmentResponseDto> getCompletedAppointments(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndStatus(doctorId, AppointmentStatus.COMPLETED);

        return appointments.stream()
                .map(this::mapToDoctorAppointmentResponseDto)
                .collect(Collectors.toList());
    }

    // Upcoming appointments
    public List<DoctorAppointmentResponseDto> getUpcomingAppointments(Long doctorId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = LocalDate.now().plusDays(1).atStartOfDay();
        
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentDateTimeAfterAndStatus(
            doctorId, 
            tomorrow,
            AppointmentStatus.SCHEDULED
        );
    
        return appointments.stream()
            .map(this::mapToDoctorAppointmentResponseDto)
            .collect(Collectors.toList());
    }

    private DoctorAppointmentResponseDto mapToDoctorAppointmentResponseDto(Appointment appointment) {
        return DoctorAppointmentResponseDto.builder()
                .appointmentId(appointment.getId())
                .appointmentDateTime(appointment.getAppointmentDateTime())
                .status(appointment.getStatus().name())
                .patient(DoctorAppointmentResponseDto.PatientDetailsDto.builder()
                        .patientId(appointment.getPatient().getId())
                        .patientName(appointment.getPatient().getFullName())
                        .patientEmail(appointment.getPatient().getEmail())
                        .build())
                .build();
    }

    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found."));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }
}
