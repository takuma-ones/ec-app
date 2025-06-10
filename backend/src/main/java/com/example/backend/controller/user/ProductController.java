package com.example.backend.controller.user;

import com.example.backend.response.user.product.ProductDetailResponse;

import com.example.backend.response.user.product.ProductResponse;
import com.example.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("UserProductController")
@RequestMapping("/api/user/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 一覧取得
    @GetMapping
    public List<ProductResponse> list() {
        return productService.findAll()
                .stream()
                .map(ProductResponse::fromEntity)
                .toList();
    }

    // 1件取得
    @GetMapping("/{id}")
    public ProductDetailResponse get(@PathVariable Integer id) {
        return ProductDetailResponse.fromEntity(productService.findById(id));
    }

    // 登録（作成）


    // 更新


    // 削除（論理削除）
}
