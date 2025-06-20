package com.example.backend.service;

import com.example.backend.entity.CartEntity;
import com.example.backend.entity.CartItemEntity;
import com.example.backend.entity.ProductEntity;
import com.example.backend.entity.UserEntity;
import com.example.backend.repository.CartItemRepository;
import com.example.backend.repository.CartRepository;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // ID取得（isDeleted = false のみ）
    public CartEntity findByUserId(Integer userId) {
        return cartRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found with userId: " + userId));
    }

    // カートアイテム数量を取得
    public int sumCartItemQuantitiesByUserId(Integer userId) {
        CartEntity cart = cartRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found with userId: " + userId));

        List<CartItemEntity> items = cartItemRepository.findByCartId(cart.getId());

        return items.stream()
                .mapToInt(CartItemEntity::getQuantity)
                .sum();
    }


    // カートアイテム追加
    public CartEntity addItemToCart(Integer userId, Integer productId, Integer quantity) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CartEntity cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    CartEntity newCart = new CartEntity();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 既に同じ商品がカートにある場合は数量を加算
        Optional<CartItemEntity> existingItemOpt = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);
        int currentQuantity = existingItemOpt.map(CartItemEntity::getQuantity).orElse(0);
        int newTotalQuantity = currentQuantity + quantity;

        // 在庫より多い場合はエラー
        if (newTotalQuantity > product.getStock()) {
            throw new IllegalArgumentException("指定された数量が在庫を超えています。現在の在庫: " + product.getStock());
        }

        if (existingItemOpt.isPresent()) {
            CartItemEntity item = existingItemOpt.get();
            item.setQuantity(newTotalQuantity);
            cartItemRepository.save(item);
        } else {
            CartItemEntity item = new CartItemEntity();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        // カートを再取得して返す（最新状態）
        return cartRepository.findById(cart.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found after update"));
    }


    // カートアイテムの数量を更新する
    public CartEntity updateItemQuantity(Integer userId, Integer productId, Integer newQuantity) {
        if (newQuantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        CartEntity cart = cartRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItemEntity item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 在庫チェック
        if (newQuantity > product.getStock()) {
            throw new IllegalArgumentException("指定された数量が在庫を超えています。現在の在庫: " + product.getStock());
        }

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);

        return cartRepository.findById(cart.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found after update"));
    }

    // カートアイテムの物理削除
    public CartEntity removeItemFromCart(Integer userId, Integer productId) {
        CartEntity cart = cartRepository.findByUserIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItemEntity item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItemRepository.delete(item);

        return cartRepository.findById(cart.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found after item deletion"));
    }

}
