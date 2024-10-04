package com.PetSlot.PetSlot.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtRequestDTO {
    private String email;
    private String password;
}
