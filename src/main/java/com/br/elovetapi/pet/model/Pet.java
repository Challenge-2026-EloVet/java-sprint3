package com.br.elovetapi.pet.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "elo_pet")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPet;

    private String nome;

    private String especie;

    private String raca;

    private Character sexo;

    private LocalDate dataNascimento;

    private Integer idadeAproximada;

    private Boolean flagCastrado;
}
