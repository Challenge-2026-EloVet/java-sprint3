package com.br.elovetapi.care.service;

import com.br.elovetapi.care.enums.NotificationType;
import com.br.elovetapi.care.model.Notification;
import com.br.elovetapi.care.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(Long targetUserId, Long carePlanId, NotificationType type, String payload) {
        Notification notification = new Notification();
        notification.setTargetUserId(targetUserId);
        notification.setCarePlanId(carePlanId);
        notification.setType(type);
        notification.setPayload(payload);
        notification.setSentAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
}