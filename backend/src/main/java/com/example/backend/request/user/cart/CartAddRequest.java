package com.example.backend.request.user.cart;

public record CartAddRequest(
        Integer productId,
        Integer quantity
) {
}


