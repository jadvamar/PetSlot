package com.PetSlot.PetSlot.payload.response;

import lombok.Data;

@Data
public class LoginMesage {
    String message;
    Boolean status;

    public LoginMesage(String message, Boolean status) {
        this.message = message;
        this.status = status;
    }
}
