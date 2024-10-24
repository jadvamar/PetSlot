package com.PetSlot.PetSlot.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Table(name = "rating")
@Entity
@Data
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(name = "rate", nullable = false)
    private Long rate;

    @Column(name = "comment", length = 500)
    private String comment;
}
