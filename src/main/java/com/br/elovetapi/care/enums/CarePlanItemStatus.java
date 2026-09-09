package com.br.elovetapi.care.enums;

import com.br.elovetapi.care.exceptions.CarePlanValidationException;

public enum CarePlanItemStatus {
    PENDING,
    DONE,
    CANCELLED;

    public static CarePlanItemStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            return PENDING;
        }

        try {
            return CarePlanItemStatus.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new CarePlanValidationException("Invalid care plan item status: " + value);
        }
    }
}