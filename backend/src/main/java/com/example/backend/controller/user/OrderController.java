package com.example.backend.controller.user;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("UserOrderController")
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class OrderController {
}
