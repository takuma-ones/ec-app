package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.example.backend.repository", // Repositoryのベースパッケージ
        repositoryBaseClass = com.example.backend.repository.base.BaseRepositoryImpl.class // 共通実装を使う設定
)
public class JpaConfig {
}