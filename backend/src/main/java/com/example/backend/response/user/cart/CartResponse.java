package com.example.backend.response.user.cart;

import com.example.backend.entity.CartEntity;

import java.util.Comparator;
import java.util.List;

public record CartResponse(
        Integer id,
        Integer userId,
        Integer totalQuantity,
        Integer totalPrice,
        List<CartItemResponse> cartItems) {
    public static CartResponse fromEntity(CartEntity cart) {

        List<CartItemResponse> cartItems = cart.getCartItems().stream()
                .sorted(Comparator.comparing(item -> item.getId()))
                .map(CartItemResponse::fromEntity)
                .toList();

        int totalQuantity = cartItems.stream()
                .mapToInt(CartItemResponse::quantity)
                .sum();

        int totalPrice = cartItems.stream()
                .mapToInt(item -> item.product().price().intValue() * item.quantity())
                .sum();

        return new CartResponse(
                cart.getId(),
                cart.getUser().getId(),
                totalQuantity,
                totalPrice,
                cartItems);
    }
}
