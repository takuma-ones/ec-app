package com.example.backend.response.admin.category;

import com.example.backend.entity.CategoryEntity;

public record CategoryResponse(
        Integer id,
        String name
) {
    public static CategoryResponse toResponse(CategoryEntity entity) {
        return new CategoryResponse(
                entity.getId(),
                entity.getName()
        );
    }
}
