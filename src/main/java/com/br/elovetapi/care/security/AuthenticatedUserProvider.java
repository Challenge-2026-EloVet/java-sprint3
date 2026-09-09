package com.br.elovetapi.care.security;
import com.br.elovetapi.user.model.User;

public interface AuthenticatedUserProvider {
    User getCurrentUser();
}