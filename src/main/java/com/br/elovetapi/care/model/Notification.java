package com.br.elovetapi.care.model;

import com.br.elovetapi.care.enums.NotificationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long targetUserId;
    private Long carePlanId;
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    private String payload;
    private LocalDateTime sentAt;
}