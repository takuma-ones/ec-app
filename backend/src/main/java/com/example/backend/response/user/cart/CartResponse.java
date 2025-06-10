package com.example.backend.response.user.cart;

import com.example.backend.entity.CartEntity;

import java.util.List;

public record CartResponse(
        Integer id,
        Integer userId,
        List<CartItemResponse> cartItems
) {
    public static CartResponse toResponse(CartEntity cart) {
        return new CartResponse(
                cart.getId(),
                cart.getUser().getId(),
                cart.getCartItems().stream()
                        .map(CartItemResponse::toResponse)
                        .toList()
        );
    }
}
