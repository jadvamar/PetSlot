package com.PetSlot.PetSlot.Services.impl;

import com.PetSlot.PetSlot.Entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomerDetails implements UserDetails {

    private final User user;

    public CustomerDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Assign role as an authority
        return Collections.singleton(new SimpleGrantedAuthority(user.getRole()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    public String getId() {
        return toString(user.getId());
    }

    private String toString(long id) {  // primitive long, not Long object
        return String.valueOf(id);      // convert long to String
    }

    @Override
    public String getUsername() {
        return user.getEmail(); // Assuming email is the username
    }

    public String getRole() {
        return user.getRole(); // Assuming email is the username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
