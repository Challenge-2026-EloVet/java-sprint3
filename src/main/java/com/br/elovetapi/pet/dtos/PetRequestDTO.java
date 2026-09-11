package com.br.elovetapi.pet.dtos;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record PetRequestDTO(
        @NotBlank(message = "O nome não pode ser nulo ou vazio")
        @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres")
        String nome,

        @NotBlank(message = "A espécie não pode ser nula ou vazia")
        @Size(max = 50, message = "A espécie deve ter no máximo 50 caracteres")
        String especie,

        @Size(max = 100, message = "A raça deve ter no máximo 100 caracteres")
        String raca,

        @Pattern(regexp = "^[MFN]$", message = "O sexo deve ser 'M', 'F' ou 'N'")
        String sexo,

        @PastOrPresent(message = "A data de nascimento não pode ser futura")
        LocalDate dataNascimento,

        @PositiveOrZero(message = "A idade aproximada deve ser maior ou igual a zero")
        @Max(value = 999, message = "A idade aproximada deve ter no máximo 3 dígitos")
        Integer idadeAproximada,

        Boolean flagCastrado
) {
}
