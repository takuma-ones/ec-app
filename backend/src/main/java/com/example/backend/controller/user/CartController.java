package com.example.backend.controller.user;

import com.example.backend.entity.CartEntity;
import com.example.backend.request.admin.product.ProductRequest;
import com.example.backend.response.admin.product.ProductDetailResponse;
import com.example.backend.response.admin.product.ProductResponse;
import com.example.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("UserCartController")
@RequestMapping("/api/user/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // 一覧取得


    // 1件取得
    @GetMapping("/{userId}")
    public CartEntity getByUserId(@PathVariable Integer userId) {
        return cartService.findByUserId(userId);
    }


    // 登録（作成）


    // 更新


    // 削除（論理削除）

}
