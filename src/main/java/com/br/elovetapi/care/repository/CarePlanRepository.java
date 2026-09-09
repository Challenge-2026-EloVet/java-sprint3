package com.br.elovetapi.care.repository;

import com.br.elovetapi.care.model.CarePlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarePlanRepository extends JpaRepository<CarePlan, Long> {
    List<CarePlan> findByPetOwnerId(Long petOwnerId);
}