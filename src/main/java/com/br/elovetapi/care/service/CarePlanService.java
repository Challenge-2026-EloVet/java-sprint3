package com.br.elovetapi.care.service;

import com.br.elovetapi.care.dtos.CarePlanItemDTO;
import com.br.elovetapi.care.dtos.CarePlanRequestDTO;
import com.br.elovetapi.care.dtos.CarePlanResponseDTO;
import com.br.elovetapi.care.dtos.MarkItemRequestDTO;
import com.br.elovetapi.care.enums.CarePlanItemStatus;
import com.br.elovetapi.care.enums.NotificationType;
import com.br.elovetapi.care.exceptions.CarePlanNotFoundException;
import com.br.elovetapi.care.exceptions.CarePlanValidationException;
import com.br.elovetapi.care.exceptions.ItemDoesNotBelongCarePlanException;
import com.br.elovetapi.care.exceptions.ItemNotFoundException;
import com.br.elovetapi.care.mapper.CarePlanMapper;
import com.br.elovetapi.care.model.CarePlan;
import com.br.elovetapi.care.model.CarePlanItem;
import com.br.elovetapi.care.repository.CarePlanItemRepository;
import com.br.elovetapi.care.repository.CarePlanRepository;
import com.br.elovetapi.care.security.AuthenticatedUserProvider;
import com.br.elovetapi.care.validation.CarePlanValidator;
import com.br.elovetapi.pet.exceptions.PetNotFoundException;
import com.br.elovetapi.pet.repository.PetRepository;
import com.br.elovetapi.user.model.User;
import com.br.elovetapi.user.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class CarePlanService {

    private final CarePlanRepository carePlanRepository;
    private final CarePlanItemRepository carePlanItemRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuthenticatedUserProvider authenticatedUserProvider;
    private final CarePlanValidator carePlanValidator;

    public CarePlanService(CarePlanRepository carePlanRepository,
                          CarePlanItemRepository carePlanItemRepository,
                          PetRepository petRepository,
                          UserRepository userRepository,
                          NotificationService notificationService,
                          AuthenticatedUserProvider authenticatedUserProvider,
                          CarePlanValidator carePlanValidator) {
        this.carePlanRepository = carePlanRepository;
        this.carePlanItemRepository = carePlanItemRepository;
        this.petRepository = petRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.authenticatedUserProvider = authenticatedUserProvider;
        this.carePlanValidator = carePlanValidator;
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public CarePlanResponseDTO createCarePlan(Long veterinaryId, CarePlanRequestDTO dto) {
        carePlanValidator.validateCreateDto(dto);

        petRepository.findById(dto.petId())
                .orElseThrow(() -> new PetNotFoundException("Pet not found with id: " + dto.petId()));

        boolean userExists = userRepository.existsById(dto.petOwnerId());
        if (!userExists) {
            throw new CarePlanValidationException("User not found with id: " + dto.petOwnerId());
        }

        User creator = authenticatedUserProvider.getCurrentUser();
        CarePlan saved = carePlanRepository.save(CarePlanMapper.toEntity(veterinaryId, dto, creator.getIdUsuario()));
        List<CarePlanItem> items = saveItems(saved.getId(), dto.items());

        notifyWithAudit(
                dto.petOwnerId(),
                saved.getId(),
                NotificationType.HANDOFF,
                "Care plan created with " + items.size() + " items",
                NotificationType.AUDIT_HANDOFF,
                "Audit: care plan " + saved.getId() + " created"
        );

        return CarePlanMapper.toDTO(saved, items);
    }

    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public List<CarePlanResponseDTO> listCarePlansForUser(Long userId) {
        List<CarePlan> plans = carePlanRepository.findByPetOwnerId(userId);
        return plans.stream()
                .map(plan -> CarePlanMapper.toDTO(plan, carePlanItemRepository.findByCarePlanId(plan.getId())))
                .toList();
    }

    @Transactional
    @PreAuthorize("@carePlanAuthorizationService.canManageCarePlan(#carePlanId, authentication)")
    public CarePlanResponseDTO markItem(Long carePlanId, Long itemId, MarkItemRequestDTO dto) {
        CarePlan carePlan = carePlanRepository.findById(carePlanId)
                .orElseThrow(() -> new CarePlanNotFoundException("Care plan not found"));

        CarePlanItem item = carePlanItemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found"));

        if (!item.getCarePlanId().equals(carePlanId)) {
            throw new ItemDoesNotBelongCarePlanException("Item does not belong to care plan");
        }

        CarePlanItemStatus newStatus = carePlanValidator.validateItemStatus(dto.status());
        item.setStatus(newStatus);
        carePlanItemRepository.save(item);

        User currentUser = authenticatedUserProvider.getCurrentUser();
        notifyWithAudit(
                currentUser.getIdUsuario(),
                carePlanId,
                NotificationType.AUDIT_MARK_ITEM,
                "Item " + item.getId() + " marked " + newStatus + ". Note: " + dto.note(),
                NotificationType.AUDIT_MARK_ITEM,
                "Audit: item " + item.getId() + " updated in care plan " + carePlanId
        );

        return CarePlanMapper.toDTO(carePlan, carePlanItemRepository.findByCarePlanId(carePlanId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public int processReminders() {
        List<CarePlanItem> dueItems = carePlanItemRepository.findByStatusAndDueDate(CarePlanItemStatus.PENDING, LocalDate.now());

        dueItems.forEach(item -> carePlanRepository.findById(item.getCarePlanId()).ifPresent(cp ->
                notifyWithAudit(
                        cp.getPetOwnerId(),
                        cp.getId(),
                        NotificationType.REMINDER,
                        "Reminder: " + item.getTitle(),
                        NotificationType.AUDIT_REMINDER,
                        "Audit: reminder sent for item " + item.getId()
                )
        ));

        return dueItems.size();
    }

    private void notifyWithAudit(Long userId,
                                Long carePlanId,
                                NotificationType type,
                                String message,
                                NotificationType auditType,
                                String auditMessage) {
        notificationService.createNotification(userId, carePlanId, type, message);
        notificationService.createNotification(userId, carePlanId, auditType, auditMessage);
    }

    private List<CarePlanItem> saveItems(Long carePlanId, List<CarePlanItemDTO> itemsDto) {
        List<CarePlanItem> items = itemsDto.stream()
                .map(item -> CarePlanMapper.toItemEntity(carePlanId, item))
                .toList();
        return carePlanItemRepository.saveAll(items);
    }
}