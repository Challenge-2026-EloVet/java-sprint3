package com.br.elovetapi.care.model;

import com.br.elovetapi.care.enums.CarePlanItemStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "care_plan_item")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarePlanItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long carePlanId;
    private String title;
    private String description;
    private LocalDate dueDate;
    @Enumerated(EnumType.STRING)
    private CarePlanItemStatus status = CarePlanItemStatus.PENDING;
}