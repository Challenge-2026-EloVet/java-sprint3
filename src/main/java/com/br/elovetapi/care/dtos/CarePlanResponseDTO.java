package com.br.elovetapi.care.dtos;

import java.time.LocalDateTime;
import java.util.List;

public record CarePlanResponseDTO(
        Long id,
        Long veterinaryId,
        Long petId,
        Long petOwnerId,
        LocalDateTime createdAt,
        Long createdByUserId,
        String status,
        String notes,
        List<CarePlanItemDTO> items
) {
}