package com.br.elovetapi.care.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MarkItemRequestDTO(
        @NotNull(message = "status is required")
        @NotBlank(message = "status cannot be blank")
        String status,
        String note
) {
}