package com.br.elovetapi.pet.dtos;

import java.time.LocalDate;

public record PetResponseDTO(
        Long idPet,
        String nome,
        String especie,
        String raca,
        Character sexo,
        LocalDate dataNascimento,
        Integer idadeAproximada,
        Boolean flagCastrado,
        byte[] foto
) {
}
