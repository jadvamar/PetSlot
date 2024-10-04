package com.PetSlot.PetSlot.DTO;

import com.PetSlot.PetSlot.Entity.Images;
import com.PetSlot.PetSlot.Entity.Pets;
import com.PetSlot.PetSlot.Entity.Services;
import com.PetSlot.PetSlot.Entity.User;
import lombok.Data;

import java.sql.Time;
import java.util.List;

@Data
public class ShopDTO {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private Time start;
    private Time end;
    private Double lat;
    private Double lag;
    private List<String> pets;
    private List<String> services;
    private List<byte []> images;
    private Long user;
    private byte[] photo;

    public ShopDTO(){}

    // Constructor
    public ShopDTO(Long id, String name, String description, String address, String phone,
                   Time start, Time end, Double lat, Double lag, Long user) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.phone = phone;
        this.start = start;
        this.end = end;
        this.lat = lat;
        this.lag = lag;
        this.user = user;
    }

    public ShopDTO(Long id, String name, String description, String address, String phone) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.address = address;
        this.phone = phone;
    }

}

