package com.example.backend.controller.user;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("UserProductController")
@RequestMapping("/api/user/products")
@RequiredArgsConstructor
public class ProductController {
}
