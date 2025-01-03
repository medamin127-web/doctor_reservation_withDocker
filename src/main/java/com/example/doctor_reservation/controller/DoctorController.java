package com.example.doctor_reservation.controller;

import com.example.doctor_reservation.dto.DoctorDto;
import com.example.doctor_reservation.entity.Doctor;
import com.example.doctor_reservation.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.doctor_reservation.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private DoctorRepository doctorRepository;


    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    public ResponseEntity<Doctor> addDoctor(@RequestBody DoctorDto doctorDto) {
        Doctor doctor = new Doctor();
        doctor.setSpecialization(doctorDto.getSpecialization());
        doctor.setQualification(doctorDto.getQualification());

        Doctor savedDoctor = doctorService.addDoctor(doctor, doctorDto.getUserId(), doctorDto.getDepartmentIds());
        return ResponseEntity.ok(savedDoctor);
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long doctorId) {
        Doctor doctor = doctorService.findDoctorById(doctorId);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<DoctorDto> getDoctorByUserId(@PathVariable Long userId) {
        Doctor doctor = doctorService.findDoctorByUserId(userId);
        if (doctor != null) {
            DoctorDto doctorDto = doctorService.convertToDoctorDto(doctor); // Convert Doctor to DoctorDto
            return ResponseEntity.ok(doctorDto); // Return DoctorDto
        }
        return ResponseEntity.notFound().build(); // Return 404 if doctor is not found
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@PathVariable String specialization) {
        List<Doctor> doctors = doctorService.findDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(doctors);
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }


    @GetMapping("/department/{departmentName}")
    public ResponseEntity<List<Doctor>> getDoctorsByDepartment(@PathVariable String departmentName) {
        List<Doctor> doctors = doctorService.findDoctorsByDepartment(departmentName);
        return ResponseEntity.ok(doctors);
    }



    @DeleteMapping("/{doctorId}")
    public void deleteDoctor(@PathVariable Long doctorId) {
        doctorRepository.deleteById(doctorId);
    }
}

