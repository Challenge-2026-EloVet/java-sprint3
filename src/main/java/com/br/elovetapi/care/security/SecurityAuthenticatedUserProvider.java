package com.br.elovetapi.care.security;
import com.br.elovetapi.user.model.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
@Component
public class SecurityAuthenticatedUserProvider implements AuthenticatedUserProvider {
    @Override
    public User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new SecurityException("Not authenticated");
        }
        return (User) auth.getPrincipal();
    }
}