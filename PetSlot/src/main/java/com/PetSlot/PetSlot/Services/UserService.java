package com.PetSlot.PetSlot.Services;

import com.PetSlot.PetSlot.DTO.LoginDTO;
import com.PetSlot.PetSlot.DTO.UserDTO;
import com.PetSlot.PetSlot.payload.response.LoginMesage;

public interface UserService {
    String signupUser(UserDTO userDTO);
    LoginMesage loginUser(LoginDTO loginDTO);
}