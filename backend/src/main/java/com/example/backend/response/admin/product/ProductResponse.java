// ProductResponse.java
package com.example.backend.response.admin.product;

import com.example.backend.entity.ProductEntity;
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
                        .sorted(Comparator.comparing(image -> image.getSortOrder()))
                        .map(ProductImageResponse::fromEntity)
                        .collect(Collectors.toList()),
                product.getProductCategories().stream()
                        .filter(pc -> !pc.getCategory().getIsDeleted())
                        .sorted(Comparator.comparing(pc -> pc.getCategory().getId()))
                        .map(ProductCategoryResponse::fromEntity)
                        .toList());
    }
}
