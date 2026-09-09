package com.br.elovetapi.security.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthenticationDTO(
        @NotBlank(message = "O nome de usuário não pode ser nulo ou vazio")
        @Size(max = 100, message = "O nome de usuário deve ter no máximo 100 caracteres")
        String nomeUsuario,

        @NotBlank(message = "A senha não pode ser nula ou vazia")
        String senha
) {
}
