package com.example.artshare.config;

import org.springframework.security.core.GrantedAuthority;

public class SimpleGrantedAuthority implements GrantedAuthority {
    private String role;

    @Override
    public String getAuthority() {
        return role;
    }
}
