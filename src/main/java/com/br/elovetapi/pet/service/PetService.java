package com.br.elovetapi.pet.service;

import com.br.elovetapi.pet.dtos.PetRequestDTO;
import com.br.elovetapi.pet.dtos.PetResponseDTO;
import com.br.elovetapi.pet.exceptions.PetNotFoundException;
import com.br.elovetapi.pet.mapper.PetMapper;
import com.br.elovetapi.pet.model.Pet;
import com.br.elovetapi.pet.repository.PetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {

    private final PetRepository petRepository;
    private final PetMapper petMapper;

    public PetService(PetRepository petRepository, PetMapper petMapper) {
        this.petRepository = petRepository;
        this.petMapper = petMapper;
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Pet getPetById(Long eloId) {
        return petRepository.findById(eloId).orElseThrow(() -> new PetNotFoundException("Pet not found with id: " + eloId));
    }

    public PetResponseDTO createPet(PetRequestDTO petRequestDTO) {
        Pet pet = petMapper.toEntity(petRequestDTO);
        return petMapper.toResponse(petRepository.save(pet));
    }

    public PetResponseDTO updatePet(Long eloId, PetRequestDTO petRequestDTO) {
        Pet existingPet = getPetById(eloId);
        petMapper.updatePetFromRequest(petRequestDTO, existingPet);
        return petMapper.toResponse(petRepository.save(existingPet));
    }

    public void deletePet(Long eloId) {
        petRepository.delete(getPetById(eloId));
    }
}
