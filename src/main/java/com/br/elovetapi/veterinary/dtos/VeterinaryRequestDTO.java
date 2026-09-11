package com.br.elovetapi.veterinary.dtos;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record VeterinaryRequestDTO(
        @NotBlank(message = "O nome completo não pode ser nulo ou vazio")
        @Size(max = 150, message = "O nome completo deve ter no máximo 150 caracteres")
        String nomeCompleto,

        @NotBlank(message = "O CPF não pode ser nulo ou vazio")
        @Pattern(regexp = "^[0-9]{11}$", message = "O CPF deve conter exatamente 11 dígitos numéricos")
        String cpf,

        @Size(max = 20, message = "O RG deve ter no máximo 20 caracteres")
        String rg,

        @Past(message = "A data de nascimento deve ser uma data passada")
        LocalDate dataNascimento,

        @NotBlank(message = "O CRMV não pode ser nulo ou vazio")
        @Size(max = 30, message = "O CRMV deve ter no máximo 30 caracteres")
        String crmv,

        @Size(max = 20, message = "O telefone deve ter no máximo 20 caracteres")
        String telefone,

        @NotNull(message = "O id do usuário não pode ser nulo")
        Long idUsuario
) {
}