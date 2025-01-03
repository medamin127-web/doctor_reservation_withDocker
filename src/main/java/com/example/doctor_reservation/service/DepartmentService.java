package com.example.doctor_reservation.service;

import com.example.doctor_reservation.dto.DepartmentDTO;
import com.example.doctor_reservation.entity.Department;
import com.example.doctor_reservation.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public Department addDepartment(Department department) {
        if (departmentRepository.existsByName(department.getName())) {
            throw new IllegalArgumentException("Department already exists.");
        }
        return departmentRepository.save(department);
    }

    public List<DepartmentDTO> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(department -> new DepartmentDTO(
                        department.getId(),
                        department.getName()
                ))
                .collect(Collectors.toList());
    }

    public Department getDepartmentByName(String name) {
        return departmentRepository.findByName(name);
    }
}
