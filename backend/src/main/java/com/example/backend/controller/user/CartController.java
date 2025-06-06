package com.example.backend.controller.user;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("UserCartController")
@RequestMapping("/api/user/carts")
@RequiredArgsConstructor
public class CartController {
}
