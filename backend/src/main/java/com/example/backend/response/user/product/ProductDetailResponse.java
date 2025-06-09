package com.example.backend.response.user.product;

import com.example.backend.entity.ProductEntity;

import java.time.LocalDateTime;
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
        List<ProductCategoryResponse> productCategories
) {
    public static ProductDetailResponse toResponse(ProductEntity product) {
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
                        .map(ProductImageResponse::fromEntity)
                        .toList(),
                product.getProductCategories().stream()
                        .map(ProductCategoryResponse::fromEntity)
                        .toList()
        );
    }
}
