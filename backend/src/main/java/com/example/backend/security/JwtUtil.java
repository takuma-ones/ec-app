package com.example.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    // 秘密鍵（256ビット = 32バイトの乱数をbase64等で管理推奨）
    // 簡易例として直接生成してますが、環境変数やプロパティで管理してください
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // トークン有効期間（例：1時間）
    private final long jwtExpirationMs = 3600000;

    // ユーザ名（subject）を抽出
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 有効期限を抽出
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // 汎用クレーム抽出
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // 全クレーム取得
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // トークンが期限切れか判定
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // トークン生成
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }

    // トークンの妥当性チェック
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
