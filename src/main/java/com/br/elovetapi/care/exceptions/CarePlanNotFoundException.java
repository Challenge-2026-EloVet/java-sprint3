package com.br.elovetapi.care.exceptions;

public class CarePlanNotFoundException extends RuntimeException {
    public CarePlanNotFoundException(String message) {
        super(message);
    }
}
