package com.br.elovetapi.care.security;
import com.br.elovetapi.care.model.CarePlan;
import com.br.elovetapi.care.repository.CarePlanRepository;
import com.br.elovetapi.user.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.util.Objects;

@Component("carePlanAuthorizationService")
public class CarePlanAuthorizationService {
    private final CarePlanRepository carePlanRepository;
    public CarePlanAuthorizationService(CarePlanRepository carePlanRepository) {
        this.carePlanRepository = carePlanRepository;
    }
    public boolean canManageCarePlan(Long carePlanId, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return false;
        }
        User principal = (User) authentication.getPrincipal();
        if (isAdmin(principal)) {
            return true;
        }
        return carePlanRepository.findById(carePlanId)
                .map(CarePlan::getPetOwnerId)
                .map(ownerId -> Objects.equals(principal.getIdUsuario(), ownerId))
                .orElse(false);
    }
    private boolean isAdmin(User user) {
        return user.getTipoUsuario() != null && user.getTipoUsuario().name().equals("ADMIN");
    }
}