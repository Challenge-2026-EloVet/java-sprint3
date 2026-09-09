package com.br.elovetapi.care.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "follow_up_log")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowUpLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long carePlanItemId;
    private String action;
    private Long performedBy;
    private LocalDateTime performedAt;
    private String note;
}