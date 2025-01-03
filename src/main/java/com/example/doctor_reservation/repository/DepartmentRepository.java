package com.example.doctor_reservation.repository;

import com.example.doctor_reservation.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Department findByName(String name);

    boolean existsByName(String name);

}