// com.example.backend.controller.user.CartController.java

package com.example.backend.controller.user;

import com.example.backend.entity.CartEntity;
import com.example.backend.request.user.cart.CartAddRequest;
import com.example.backend.request.user.cart.CartUpdateRequest;
import com.example.backend.response.user.cart.CartResponse;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController("UserCartController")
@RequestMapping("/api/user/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // カート情報の取得
    @GetMapping
    public CartResponse getMyCart() {
        CustomUserDetails loginUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = loginUser.getId();

        CartEntity cart = cartService.findByUserId(userId);
        return CartResponse.fromEntity(cart);
    }

    // カート内アイテムの数量取得
    @GetMapping("/quantity")
    public int getMyCartItemsQuantity() {
        CustomUserDetails loginUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = loginUser.getId();

        return cartService.sumCartItemQuantitiesByUserId(userId);
    }

    // カートへのアイテム追加（ResponseEntityでステータス返却）
    @PostMapping
    public ResponseEntity<CartResponse> addCartItem(@RequestBody CartAddRequest request) {
        CustomUserDetails loginUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = loginUser.getId();

        CartEntity updatedCart = cartService.addItemToCart(userId, request.productId(), request.quantity());
        CartResponse response = CartResponse.fromEntity(updatedCart);
        return ResponseEntity.ok(response);  // HTTP 200 OK + JSON
    }

    // カート内アイテムの数量更新
    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable Integer productId,
            @RequestBody CartUpdateRequest request
    ) {
        CustomUserDetails loginUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = loginUser.getId();

        CartEntity updatedCart = cartService.updateItemQuantity(userId, productId, request.quantity());
        CartResponse response = CartResponse.fromEntity(updatedCart);
        return ResponseEntity.ok(response); // HTTP 200 OK
    }

    // item物理削除
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> deleteCartItem(@PathVariable Integer productId) {
        CustomUserDetails loginUser = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Integer userId = loginUser.getId();

        CartEntity updatedCart = cartService.removeItemFromCart(userId, productId);
        CartResponse response = CartResponse.fromEntity(updatedCart);
        return ResponseEntity.ok(response); // HTTP 200 OK
    }

}
