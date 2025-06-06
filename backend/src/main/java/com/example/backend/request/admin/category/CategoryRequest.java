package com.example.backend.request.admin.category;

import com.example.backend.entity.CategoryEntity;

public record CategoryRequest(
        String name
) {

    public CategoryEntity toEntity() {

        CategoryEntity category = new CategoryEntity();
        category.setName(name);
        return category;
    }

}
