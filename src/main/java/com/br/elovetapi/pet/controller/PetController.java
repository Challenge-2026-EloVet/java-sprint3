package com.br.elovetapi.pet.controller;

import com.br.elovetapi.pet.dtos.PetRequestDTO;
import com.br.elovetapi.pet.dtos.PetResponseDTO;
import com.br.elovetapi.pet.model.Pet;
import com.br.elovetapi.pet.service.PetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("pet")
public class PetController {
    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public List<Pet> getAllPets() {
        return petService.getAllPets();
    }

    @GetMapping("/{eloId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public Pet getPetById(@PathVariable Long eloId) {
        return petService.getPetById(eloId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public PetResponseDTO createPet(@Valid @RequestBody PetRequestDTO pet){
        return petService.createPet(pet);
    }

    @PutMapping("/{eloId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public PetResponseDTO updatePet(@PathVariable Long eloId, @Valid @RequestBody PetRequestDTO pet){
        return petService.updatePet(eloId, pet);
    }

    @DeleteMapping("/{eloId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePet(@PathVariable Long eloId){
        petService.deletePet(eloId);
    }
}
