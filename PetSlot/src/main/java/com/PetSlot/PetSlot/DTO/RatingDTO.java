package com.PetSlot.PetSlot.DTO;

import com.PetSlot.PetSlot.Entity.Shop;
import com.PetSlot.PetSlot.Entity.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class RatingDTO {

    private Long id;

    private Long userId;
    private String userName;
    private Long shopId;

    private Long rate;

    private  String comment;

    public RatingDTO(Long id, String userName, Long rate, String comment) {
        this.id = id;
        this.userName=userName;
        this.rate = rate;
        this.comment=comment;
    }
}
