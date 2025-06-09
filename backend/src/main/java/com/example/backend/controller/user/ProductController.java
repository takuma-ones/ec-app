package com.example.backend.controller.user;

import com.example.backend.entity.ProductEntity;
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
    public List<ProductEntity> list() {
        return productService.findAll();
    }

    // 1件取得
    @GetMapping("/{id}")
    public ProductEntity get(@PathVariable Integer id) {
        return productService.findById(id);
    }

    // 登録（作成）


    // 更新


    // 削除（論理削除）
}
