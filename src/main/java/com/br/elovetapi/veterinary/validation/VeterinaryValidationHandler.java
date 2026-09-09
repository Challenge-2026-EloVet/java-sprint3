package com.br.elovetapi.veterinary.validation;

import com.br.elovetapi.pet.validation.PetValidationHandler;
import com.br.elovetapi.veterinary.exceptions.VeterinaryNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class VeterinaryValidationHandler {

    public record ErrorResponse(String mensagem, Integer codigoStatus) {
    }

    public record ValidationErrorResponse(String field, String message) {
        public ValidationErrorResponse(FieldError error) {
            this(error.getField(), error.getDefaultMessage());
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<PetValidationHandler.ValidationErrorResponse>> handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
        List<PetValidationHandler.ValidationErrorResponse> errors = exception.getFieldErrors().stream()
                .map(PetValidationHandler.ValidationErrorResponse::new)
                .toList();
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(VeterinaryNotFoundException.class)
    public ResponseEntity<PetValidationHandler.ErrorResponse> handleVeterinaryNotFound(VeterinaryNotFoundException exception) {
        log.warn("Business logic error: {}", exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new PetValidationHandler.ErrorResponse(exception.getMessage(), HttpStatus.NOT_FOUND.value()));
    }
}
