package com.PetSlot.PetSlot.Entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.sql.Time;
import java.util.List;

@Entity
@Table(name = "shops")
@Data
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false , length= 15)
    private String phone;

    @Column(nullable = false)
    private Time start; // Opening time

    @Column(nullable = false)
    private Time end;   // Closing time

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @OneToMany(mappedBy = "shop", fetch = FetchType.LAZY, cascade = CascadeType.ALL,orphanRemoval = true)
    @BatchSize(size = 10)
    @Fetch(FetchMode.SUBSELECT)
    private List<Pets> pets;

    @OneToMany(mappedBy = "shop", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @BatchSize(size = 10)
    @Fetch(FetchMode.SUBSELECT)
    private List<Services> services;

    @OneToMany(mappedBy = "shop", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @BatchSize(size = 10)
    @Fetch(FetchMode.SUBSELECT)
    private List<Images> images;

    public Shop(){

    }
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
