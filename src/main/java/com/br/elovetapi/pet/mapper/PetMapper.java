package com.br.elovetapi.pet.mapper;

import com.br.elovetapi.pet.dtos.PetRequestDTO;
import com.br.elovetapi.pet.dtos.PetResponseDTO;
import com.br.elovetapi.pet.model.Pet;
import org.springframework.stereotype.Component;

@Component
public class PetMapper {
    public PetResponseDTO toResponse(Pet pet) {
        return new PetResponseDTO(
                pet.getIdPet(),
                pet.getNome(),
                pet.getEspecie(),
                pet.getRaca(),
                pet.getSexo(),
                pet.getDataNascimento(),
                pet.getIdadeAproximada(),
                pet.getFlagCastrado(),
                pet.getFoto()
        );
    }

    public void updatePetFromRequest(PetRequestDTO petRequestDTO, Pet existingPet) {
        existingPet.setNome(petRequestDTO.nome());
    }

    public Pet toEntity(PetRequestDTO petRequestDTO) {
        Pet pet = new Pet();
        pet.setNome(petRequestDTO.nome());
        return pet;
    }
}
