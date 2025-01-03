package com.example.doctor_reservation.service;

import com.example.doctor_reservation.dto.DoctorDto;
import com.example.doctor_reservation.entity.Department;
import com.example.doctor_reservation.entity.Doctor;
import com.example.doctor_reservation.entity.User;
import com.example.doctor_reservation.entity.UserRole;
import com.example.doctor_reservation.repository.DepartmentRepository;
import com.example.doctor_reservation.repository.DoctorRepository;
import com.example.doctor_reservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired

    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Doctor> findDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    public List<Doctor> findDoctorsByDepartment(String departmentName) {
        return doctorRepository.findByDepartmentsName(departmentName);
    }
    public Doctor findDoctorById(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));
    }

    public DoctorService(DoctorRepository doctorRepository, UserRepository userRepository) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }


    public Doctor addDoctor(Doctor doctor, Long userId, List<Long> departmentIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        doctor.setUser(user);

        // Check if departmentIds is null or empty
        if (departmentIds == null || departmentIds.isEmpty()) {
            throw new IllegalArgumentException("Department IDs cannot be null or empty");
        }

        List<Department> departments = departmentRepository.findAllById(departmentIds);
        if (departments.isEmpty()) {
            throw new IllegalArgumentException("No valid departments found");
        }

        doctor.setDepartments(departments);

        user.setRole(UserRole.DOCTOR);

        return doctorRepository.save(doctor);
    }


    public Doctor findDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId).orElse(null);
    }

    public DoctorDto convertToDoctorDto(Doctor doctor) {
        DoctorDto doctorDto = new DoctorDto();
        doctorDto.setId(doctor.getId());
        doctorDto.setFullName(doctor.getUser().getFullName()); // Assuming User has `fullName`
        doctorDto.setSpecialization(doctor.getSpecialization());
        doctorDto.setQualification(doctor.getQualification());
        doctorDto.setUserId(doctor.getUser().getId());
        // Map department IDs from the doctor
        doctorDto.setDepartmentIds(
                doctor.getDepartments()
                        .stream()
                        .map(Department::getId)
                        .collect(Collectors.toList())
        );
        return doctorDto;
    }
    public Doctor updateDoctor(Long doctorId, Doctor updatedDoctor) {
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new IllegalArgumentException("Doctor not found."));
        doctor.setSpecialization(updatedDoctor.getSpecialization());
        doctor.setQualification(updatedDoctor.getQualification());
        return doctorRepository.save(doctor);
    }
}
