package com.br.elovetapi.veterinary.dtos;

import java.time.LocalDate;

public record VeterinaryResponseDTO(
        Long idVeterinario,
        Long idUsuario,
        String nomeCompleto,
        String cpf,
        String rg,
        LocalDate dataNascimento,
        String crmv,
        String telefone
) {
}