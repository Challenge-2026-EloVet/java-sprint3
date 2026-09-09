package com.br.elovetapi.veterinary.mapper;

import com.br.elovetapi.veterinary.dtos.VeterinaryRequestDTO;
import com.br.elovetapi.veterinary.dtos.VeterinaryResponseDTO;
import com.br.elovetapi.veterinary.model.Veterinary;
import org.springframework.stereotype.Component;

@Component
public class VeterinaryMapper {
    public VeterinaryResponseDTO toResponse(Veterinary veterinary) {
        return new VeterinaryResponseDTO(
                veterinary.getIdVeterinario(),
                veterinary.getUsuario() != null ? veterinary.getUsuario().getIdUsuario() : null,
                veterinary.getNomeCompleto(),
                veterinary.getCpf(),
                veterinary.getRg(),
                veterinary.getDataNascimento(),
                veterinary.getCrmv(),
                veterinary.getTelefone()
        );
    }

    public void updateVeterinaryFromRequest(VeterinaryRequestDTO request, Veterinary existingVeterinary) {
        existingVeterinary.setNomeCompleto(request.nomeCompleto());
        existingVeterinary.setCpf(request.cpf());
        existingVeterinary.setRg(request.rg());
        existingVeterinary.setDataNascimento(request.dataNascimento());
        existingVeterinary.setCrmv(request.crmv());
        existingVeterinary.setTelefone(request.telefone());
    }

    public Veterinary toEntity(VeterinaryRequestDTO request) {
        Veterinary veterinary = new Veterinary();
        veterinary.setNomeCompleto(request.nomeCompleto());
        veterinary.setCpf(request.cpf());
        veterinary.setRg(request.rg());
        veterinary.setDataNascimento(request.dataNascimento());
        veterinary.setCrmv(request.crmv());
        veterinary.setTelefone(request.telefone());
        return veterinary;
    }
}