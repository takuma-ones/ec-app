//package com.example.backend.controller.user;
//
//import com.example.backend.entity.CartEntity;
//import com.example.backend.request.user.cart.CartAddRequest;
//import com.example.backend.response.user.cart.CartResponse;
//import com.example.backend.security.CustomUserDetails;
//import com.example.backend.service.CartService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//
//@RestController("UserCartController")
//@RequestMapping("/api/user/carts")
//@RequiredArgsConstructor
//public class CartController {
//
//    private final CartService cartService;
//
//    // カート情報の取得
//    @GetMapping
//    public CartResponse getMyCart() {
//        CustomUserDetails loginUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        Integer userId = loginUser.getId();
//
//        CartEntity cart = cartService.findByUserId(userId);
//        return CartResponse.toResponse(cart);
//    }
//
//    // カートへのアイテム追加
//    @PostMapping
//    public CartResponse addCartItem(@RequestBody CartAddRequest request) {
//        CustomUserDetails loginUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        Integer userId = loginUser.getId();
//
//        CartEntity updatedCart = cartService.addItemToCart(userId, request.productId(), request.quantity());
//        return CartResponse.toResponse(updatedCart);
//    }
//
//    // 必要に応じて更新・削除も追加
//}
