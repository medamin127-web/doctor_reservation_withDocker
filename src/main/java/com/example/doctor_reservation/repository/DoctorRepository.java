package com.example.doctor_reservation.repository;

import com.example.doctor_reservation.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findBySpecialization(String specialization);

    List<Doctor> findByDepartmentsName(String departmentName);

    Optional<Doctor> findByUserId(Long userId);// Find doctors by department name
}
