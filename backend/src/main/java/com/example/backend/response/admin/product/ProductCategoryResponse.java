package com.example.backend.response.admin.product;

import com.example.backend.entity.ProductCategoryEntity;

public record ProductCategoryResponse(
        Integer id,
        String name
) {
    public static ProductCategoryResponse fromEntity(ProductCategoryEntity category) {
        return new ProductCategoryResponse(
                category.getId().getCategoryId(),
                category.getCategory().getName()
        );
    }
}
