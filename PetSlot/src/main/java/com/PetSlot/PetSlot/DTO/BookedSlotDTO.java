package com.PetSlot.PetSlot.DTO;


import com.PetSlot.PetSlot.Entity.Shop;
import com.PetSlot.PetSlot.Entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookedSlotDTO {

    private  Long id;
    private Long shop;

    public BookedSlotDTO(Long shop, Long user, LocalTime startTime, LocalTime endTime, LocalDate date) {
        this.shop = shop;
        this.user = user;
        this.startTime = startTime;
        this.endTime = endTime;
        this.date = date;
    }

    private Long user;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate date;
    private String userEmail;
    private String shopName;
    private Integer completed;

    public BookedSlotDTO(LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public BookedSlotDTO(){}
}
