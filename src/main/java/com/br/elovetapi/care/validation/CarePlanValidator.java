package com.br.elovetapi.care.validation;
import com.br.elovetapi.care.dtos.CarePlanRequestDTO;
import com.br.elovetapi.care.enums.CarePlanItemStatus;
import com.br.elovetapi.care.exceptions.CarePlanValidationException;
import org.springframework.stereotype.Component;

@Component
public class CarePlanValidator {
    public void validateCreateDto(CarePlanRequestDTO dto) {
        require(dto != null, "Care plan request is required");
        require(dto.petId() != null, "PetId is required");
        require(dto.petOwnerId() != null, "PetOwnerId is required");
        require(dto.items() != null && !dto.items().isEmpty(), "Care plan must have at least one item");
    }
    public CarePlanItemStatus validateItemStatus(String status) {
        return CarePlanItemStatus.fromValue(status);
    }
    private void require(boolean expression, String message) {
        if (!expression) {
            throw new CarePlanValidationException(message);
        }
    }
}