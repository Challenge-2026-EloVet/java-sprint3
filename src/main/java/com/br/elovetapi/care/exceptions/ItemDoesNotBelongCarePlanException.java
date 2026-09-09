package com.br.elovetapi.care.exceptions;

public class ItemDoesNotBelongCarePlanException extends RuntimeException {
    public ItemDoesNotBelongCarePlanException(String message) {
        super(message);
    }
}
