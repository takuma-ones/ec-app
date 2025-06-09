package com.example.backend.response.admin.user;

import com.example.backend.entity.UserEntity;
import java.time.LocalDateTime;

public record UserDetailResponse(
        Integer id,
        String name,
        String email,
        String phone,
        String address,
        boolean isDeleted,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static UserDetailResponse toResponse(UserEntity entity) {
        return new UserDetailResponse(
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
