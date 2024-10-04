package com.PetSlot.PetSlot.Services.impl;

import com.PetSlot.PetSlot.DTO.LoginDTO;
import com.PetSlot.PetSlot.DTO.UserDTO;
import com.PetSlot.PetSlot.Entity.User;
import com.PetSlot.PetSlot.Repository.UserRepository;
import com.PetSlot.PetSlot.Services.UserService;
import com.PetSlot.PetSlot.payload.response.LoginMesage;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service
public class Userimpl implements UserService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public String signupUser(UserDTO userDTO) {
        // Check if the user already exists by email
        User existingUser = userRepo.findByEmail(userDTO.getEmail());
        if (existingUser != null) {
            // If user exists, throw an exception
            throw new IllegalStateException("User with email " + userDTO.getEmail() + " already exists.");
        }

        // If user doesn't exist, proceed with saving the new user
        User user = new User(
                userDTO.getId(),
                userDTO.getName(),
                userDTO.getEmail(),
                this.passwordEncoder.encode(userDTO.getPassword()),
                userDTO.getRole()
        );
        userRepo.save(user);
        return user.getEmail();
    }


    UserDTO userDTO;
   @Override
    public LoginMesage loginUser(LoginDTO loginDTO) {
        String msg = "";
        User user1 = userRepo.findByEmail(loginDTO.getEmail());
        if (user1 != null) {
            String password = loginDTO.getPassword();
            String encodedPassword = user1.getPassword();
            boolean isPwdRight = passwordEncoder.matches(password, encodedPassword);
            if (isPwdRight) {
                Optional<User> user = userRepo.findOneByEmailAndPassword(loginDTO.getEmail(), encodedPassword);
                if (user.isPresent()) {
                    return new LoginMesage("Login Success", true);
                } else {
                    return new LoginMesage("Login Failed", false);
                }
            } else {
                return new LoginMesage("password Not Match", false);
            }
        }else {
            return new LoginMesage("Email not exits", false);
        }
    }
}