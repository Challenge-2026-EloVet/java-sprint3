package com.br.elovetapi.veterinary.service;

import com.br.elovetapi.veterinary.dtos.VeterinaryRequestDTO;
import com.br.elovetapi.veterinary.dtos.VeterinaryResponseDTO;
import com.br.elovetapi.veterinary.exceptions.VeterinaryNotFoundException;
import com.br.elovetapi.veterinary.mapper.VeterinaryMapper;
import com.br.elovetapi.veterinary.model.Veterinary;
import com.br.elovetapi.veterinary.repository.VeterinaryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VeterinaryService {

    private final VeterinaryRepository veterinaryRepository;
    private final VeterinaryMapper veterinaryMapper;

    public VeterinaryService(VeterinaryRepository veterinaryRepository, VeterinaryMapper veterinaryMapper) {
        this.veterinaryRepository = veterinaryRepository;
        this.veterinaryMapper = veterinaryMapper;
    }

    public List<Veterinary> getAllVeterinaries() {
        return veterinaryRepository.findAll();
    }

    public Veterinary getVeterinaryById(Long id) {
        return veterinaryRepository.findById(id)
                .orElseThrow(() -> new VeterinaryNotFoundException("Veterinary not found with id: " + id));
    }

    public VeterinaryResponseDTO createVeterinary(VeterinaryRequestDTO veterinaryRequestDTO) {
        Veterinary veterinary = veterinaryMapper.toEntity(veterinaryRequestDTO);
        return veterinaryMapper.toResponse(veterinaryRepository.save(veterinary));
    }

    public VeterinaryResponseDTO updateVeterinary(Long id, VeterinaryRequestDTO veterinaryRequestDTO) {
        Veterinary existingVeterinary = getVeterinaryById(id);
        veterinaryMapper.updateVeterinaryFromRequest(veterinaryRequestDTO, existingVeterinary);
        return veterinaryMapper.toResponse(veterinaryRepository.save(existingVeterinary));
    }

    public void deleteVeterinary(Long id) {
        veterinaryRepository.delete(getVeterinaryById(id));
    }
}