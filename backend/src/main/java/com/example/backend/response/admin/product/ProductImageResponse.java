package com.example.backend.response.admin.product;

import com.example.backend.entity.ProductImageEntity;
import java.time.LocalDateTime;

public record ProductImageResponse(
        Integer id,
        String imageUrl,
        Integer sortOrder
) {
    public static ProductImageResponse fromEntity(ProductImageEntity image) {
        return new ProductImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getSortOrder()
        );
    }
}
