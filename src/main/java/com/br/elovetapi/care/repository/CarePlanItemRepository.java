package com.br.elovetapi.care.repository;

import com.br.elovetapi.care.enums.CarePlanItemStatus;
import com.br.elovetapi.care.model.CarePlanItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CarePlanItemRepository extends JpaRepository<CarePlanItem, Long> {
    List<CarePlanItem> findByCarePlanId(Long carePlanId);
    List<CarePlanItem> findByStatusAndDueDate(CarePlanItemStatus status, LocalDate dueDate);
}