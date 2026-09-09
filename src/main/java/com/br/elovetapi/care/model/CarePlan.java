package com.br.elovetapi.care.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import com.br.elovetapi.care.model.CarePlanItem;

@Entity
@Table(name = "care_plan")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarePlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long veterinaryId;
    private Long petId;
    private Long petOwnerId;
    private LocalDateTime createdAt;
    private Long createdByUserId;
    private String status;
    private String notes;
    @Transient
    private List<CarePlanItem> items;
}