package com.br.elovetapi.veterinary.exceptions;

public class VeterinaryNotFoundException extends RuntimeException {
    public VeterinaryNotFoundException(String message) {
        super(message);
    }
}