package com.example.backend.request.admin.category;

import com.example.backend.entity.Category;

public record CategoryRequest(
        String name
) {

    public Category toEntity() {

        Category category = new Category();
        category.setName(name);
        return category;
    }

}
