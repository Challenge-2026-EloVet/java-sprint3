package com.br.elovetapi.care.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CarePlanRequestDTO(
        @NotNull(message = "petId is required")
        Long petId,
        @NotNull(message = "petOwnerId is required")
        Long petOwnerId,
        String notes,
        @NotNull(message = "care plan must have at least one item")
        @Size(min = 1, message = "care plan must have at least one item")
        List<CarePlanItemDTO> items
) {
}