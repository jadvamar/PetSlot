package com.PetSlot.PetSlot.Services.impl;

import com.PetSlot.PetSlot.Entity.User;
import com.PetSlot.PetSlot.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;  // Assuming you have a UserRepository

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);  // Directly get User, may return null
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + email);
        }
        return new CustomerDetails(user);  // Assuming CustomUserDetails implements UserDetails
    }

}

