package com.example.backend.enums;

public enum OrderStatus {
    PENDING, // 注文が保留中
    PAID, // 注文が支払われた
    SHIPPED, // 注文が発送された
    DELIVERED, // 注文が配達された
    CANCELLED // 注文がキャンセルされた
}
