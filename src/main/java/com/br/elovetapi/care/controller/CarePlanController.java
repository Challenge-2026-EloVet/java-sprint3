package com.br.elovetapi.care.controller;

import com.br.elovetapi.care.dtos.CarePlanRequestDTO;
import com.br.elovetapi.care.dtos.CarePlanResponseDTO;
import com.br.elovetapi.care.dtos.MarkItemRequestDTO;
import com.br.elovetapi.care.service.CarePlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
public class CarePlanController {

    private final CarePlanService carePlanService;

    public CarePlanController(CarePlanService carePlanService) {
        this.carePlanService = carePlanService;
    }

    @PostMapping("/veterinaries/{vetId}/care-plans")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarePlanResponseDTO> createCarePlan(@PathVariable Long vetId, @RequestBody @Valid CarePlanRequestDTO dto){
        var created = carePlanService.createCarePlan(vetId, dto);
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping("/users/{userId}/care-plans")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<CarePlanResponseDTO>> listForUser(@PathVariable Long userId){
        return ResponseEntity.ok(carePlanService.listCarePlansForUser(userId));
    }

    @PostMapping("/care-plans/{carePlanId}/items/{itemId}/mark")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<CarePlanResponseDTO> markItem(@PathVariable Long carePlanId, @PathVariable Long itemId, @RequestBody @Valid MarkItemRequestDTO dto){
        return ResponseEntity.ok(carePlanService.markItem(carePlanId, itemId, dto));
    }

    @PostMapping("/admin/process-reminders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> processReminders(){
        int sent = carePlanService.processReminders();
        return ResponseEntity.ok("Reminders processed: " + sent);
    }
}