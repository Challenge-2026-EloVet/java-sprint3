package com.br.elovetapi.care.mapper;

import com.br.elovetapi.care.dtos.CarePlanItemDTO;
import com.br.elovetapi.care.dtos.CarePlanRequestDTO;
import com.br.elovetapi.care.dtos.CarePlanResponseDTO;
import com.br.elovetapi.care.enums.CarePlanItemStatus;
import com.br.elovetapi.care.model.CarePlan;
import com.br.elovetapi.care.model.CarePlanItem;

import java.util.List;
import java.util.stream.Collectors;

public class CarePlanMapper {

    public static CarePlan toEntity(Long veterinaryId, CarePlanRequestDTO dto, Long createdBy) {
        CarePlan cp = new CarePlan();
        cp.setVeterinaryId(veterinaryId);
        cp.setPetId(dto.petId());
        cp.setPetOwnerId(dto.petOwnerId());
        cp.setNotes(dto.notes());
        cp.setStatus("SENT");
        cp.setCreatedAt(java.time.LocalDateTime.now());
        cp.setCreatedByUserId(createdBy);
        return cp;
    }

    public static CarePlanResponseDTO toDTO(CarePlan cp, List<CarePlanItem> items) {
        return new CarePlanResponseDTO(
                cp.getId(),
                cp.getVeterinaryId(),
                cp.getPetId(),
                cp.getPetOwnerId(),
                cp.getCreatedAt(),
                cp.getCreatedByUserId(),
                cp.getStatus(),
                cp.getNotes(),
                items == null ? null : items.stream().map(CarePlanMapper::itemToDTO).collect(Collectors.toList())
        );
    }

    public static CarePlanItem toItemEntity(Long carePlanId, CarePlanItemDTO dto) {
        CarePlanItem item = new CarePlanItem();
        item.setCarePlanId(carePlanId);
        item.setTitle(dto.title());
        item.setDescription(dto.description());
        item.setDueDate(dto.dueDate());
        item.setStatus(CarePlanItemStatus.fromValue(dto.status()));
        return item;
    }

    public static CarePlanItemDTO itemToDTO(CarePlanItem item) {
        return new CarePlanItemDTO(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getDueDate(),
                item.getStatus() == null ? null : item.getStatus().name()
        );
    }
}