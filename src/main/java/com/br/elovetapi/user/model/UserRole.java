package com.br.elovetapi.user.model;

public enum UserRole {
    ADMIN("admin"),
    USER("user"),
    VETERINARIO("veterinario"),
    RESPONSAVEL("responsavel");

    private String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}