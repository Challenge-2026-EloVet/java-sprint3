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
                pet.getFlagCastrado()
        );
    }

    public void updatePetFromRequest(PetRequestDTO petRequestDTO, Pet existingPet) {
        existingPet.setNome(petRequestDTO.nome());
        existingPet.setEspecie(petRequestDTO.especie());
        existingPet.setRaca(petRequestDTO.raca());
        existingPet.setSexo(petRequestDTO.sexo() != null ? petRequestDTO.sexo().charAt(0) : null);
        existingPet.setDataNascimento(petRequestDTO.dataNascimento());
        existingPet.setIdadeAproximada(petRequestDTO.idadeAproximada());
        existingPet.setFlagCastrado(petRequestDTO.flagCastrado());
    }

    public Pet toEntity(PetRequestDTO petRequestDTO) {
        Pet pet = new Pet();
        pet.setNome(petRequestDTO.nome());
        pet.setEspecie(petRequestDTO.especie());
        pet.setRaca(petRequestDTO.raca());
        pet.setSexo(petRequestDTO.sexo() != null ? petRequestDTO.sexo().charAt(0) : null);
        pet.setDataNascimento(petRequestDTO.dataNascimento());
        pet.setIdadeAproximada(petRequestDTO.idadeAproximada());
        pet.setFlagCastrado(petRequestDTO.flagCastrado());
        return pet;
    }
}