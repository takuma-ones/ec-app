package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF無効（開発用）
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // 全てのリクエストを許可
                )
                .formLogin(form -> form.disable()) // ログインフォームを無効
                .httpBasic(basic -> basic.disable()); // Basic認証も無効

        return http.build();
    }
}