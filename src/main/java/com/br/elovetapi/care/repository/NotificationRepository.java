package com.br.elovetapi.care.repository;

import com.br.elovetapi.care.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTargetUserId(Long userId);
}