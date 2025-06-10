package com.example.backend.response.admin.user;

import com.example.backend.entity.UserEntity;
import java.time.LocalDateTime;

public record UserResponse(
        Integer id,
        String name,
        String email,
        String phone,
        String address,
        boolean isDeleted,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static UserResponse fromEntity(UserEntity entity) {
        return new UserResponse(
                entity.getId(),
                entity.getName(),
                entity.getEmail(),
                entity.getPhone(),
                entity.getAddress(),
                entity.getIsDeleted(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
