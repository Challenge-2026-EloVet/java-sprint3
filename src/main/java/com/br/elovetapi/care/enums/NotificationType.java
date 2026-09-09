package com.br.elovetapi.care.enums;
import com.br.elovetapi.care.exceptions.CarePlanValidationException;
public enum NotificationType {
    HANDOFF,
    AUDIT_HANDOFF,
    AUDIT_MARK_ITEM,
    REMINDER,
    AUDIT_REMINDER;
    public static NotificationType fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new CarePlanValidationException("Notification type is required");
        }
        try {
            return NotificationType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new CarePlanValidationException("Invalid notification type: " + value);
        }
    }
}