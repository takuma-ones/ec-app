package com.example.backend.request.admin.product;

public record ProductImageRequest(
        String url,
        Integer sortOrder
) {
}
