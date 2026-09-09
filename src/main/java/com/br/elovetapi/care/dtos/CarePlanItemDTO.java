package com.br.elovetapi.care.dtos;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record CarePlanItemDTO(
        Long id,
        @NotBlank(message = "Item title cannot be blank")
        String title,
        String description,
        @FutureOrPresent(message = "dueDate must be today or in the future")
        LocalDate dueDate,
        String status
) {
}