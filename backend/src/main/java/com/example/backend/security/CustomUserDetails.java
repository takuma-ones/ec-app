package com.example.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final Integer id;
    private final String username;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(
            Integer id,
            String username,
            String password,
            Collection<? extends GrantedAuthority> authorities
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    public Integer getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // アカウントの有効期限を制御したい場合はここを変更
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // アカウントのロック状態を制御したい場合はここを変更
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // 資格情報の有効期限を制御したい場合はここを変更
    }

    @Override
    public boolean isEnabled() {
        return true; // 有効なユーザーかを制御したい場合はここを変更
    }
}
