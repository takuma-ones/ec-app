package com.example.backend.request.admin.product;

public record ProductImageRequest(
        String base64,
        Integer sortOrder
) {
}
