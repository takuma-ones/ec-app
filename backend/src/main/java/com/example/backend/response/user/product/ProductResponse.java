// ProductResponse.java
package com.example.backend.response.user.product;

import com.example.backend.entity.ProductEntity;
import com.example.backend.entity.ProductImageEntity;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public record ProductResponse(
        Integer id,
        String sku,
        String name,
        String description,
        Integer price,
        Integer stock,
        boolean published,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<ProductImageResponse> productImages,
        List<ProductCategoryResponse> productCategories) {
    public static ProductResponse fromEntity(ProductEntity product) {
        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.isPublished(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                product.getProductImages().stream()
                        .filter(image -> !image.getIsDeleted())
                        .sorted(Comparator.comparing(ProductImageEntity::getSortOrder))
                        .map(ProductImageResponse::fromEntity)
                        .toList(),

                product.getProductCategories().stream()
                        .filter(pc -> !pc.getCategory().getIsDeleted())
                        .map(ProductCategoryResponse::fromEntity)
                        .toList());
    }
}
