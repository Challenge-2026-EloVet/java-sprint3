package com.br.elovetapi.veterinary.model;

import com.br.elovetapi.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "elo_veterinario")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Veterinary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVeterinario;
    private String nomeCompleto;
    private String cpf;
    private String rg;
    private LocalDate dataNascimento;
    private String crmv;
    private String telefone;
    @OneToOne
    @JoinColumn(name = "id_usuario")
    private User usuario;
}