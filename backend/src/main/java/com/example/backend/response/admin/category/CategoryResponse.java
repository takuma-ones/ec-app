package com.example.backend.response.admin.category;

import com.example.backend.entity.Category;

public record CategoryResponse(
        Integer id,
        String name
) {
    public static CategoryResponse toResponse(Category entity) {
        return new CategoryResponse(
                entity.getId(),
                entity.getName()
        );
    }
}
