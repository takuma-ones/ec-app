package com.example.backend.response.admin.product;

import com.example.backend.entity.ProductCategoryEntity;

public record ProductCategoryResponse(
        ProductCategoryIdResponse id,
        String name
) {
    public static ProductCategoryResponse fromEntity(ProductCategoryEntity category) {
        return new ProductCategoryResponse(
                new ProductCategoryIdResponse(
                        category.getId().getProductId(),
                        category.getId().getCategoryId()
                ),
                category.getCategory().getName() // CategoryEntity 経由でカテゴリ名を取得
        );
    }
}
