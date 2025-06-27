package com.example.backend.response.user.product;

import com.example.backend.entity.ProductEntity;
import com.example.backend.entity.ProductImageEntity;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

public record ProductDetailResponse(
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
    public static ProductDetailResponse fromEntity(ProductEntity product) {
        return new ProductDetailResponse(
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
                        .sorted(Comparator.comparing(pc -> pc.getCategory().getId()))
                        .map(ProductCategoryResponse::fromEntity)
                        .toList()

        );
    }
}
