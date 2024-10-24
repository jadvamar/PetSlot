package com.PetSlot.PetSlot.DTO;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponseDTO {
    private String token;
    private String username;
    private Long id;
}
